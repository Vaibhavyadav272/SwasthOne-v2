"""
SwasthOne rPPG service (patched adapter around the unchanged V2 engine).

Changes vs. the original service.py (V2 engine file is NOT modified):
  1. Sampling rate is measured from the recording's frame timestamps instead of
     being hard-coded to 30 FPS (a 20 FPS recording read as 30 FPS reported
     108 bpm for a true 72 bpm and still got ACCEPT).
  2. Face detection runs on a downscaled grey frame (ROIs are still cut from the
     full-resolution frame) so a 720p/30 s clip no longer takes minutes.
  3. Hard limits: upload size, frame count and a wall-clock budget, so a request
     can never run forever.
  4. Clear errors when the face is missing in too many frames or the measured
     FPS is implausible, instead of a silent wrong answer.
  5. CORS allow-list from RPPG_ALLOWED_ORIGINS; per-stage timing in the log.
"""
import os
import tempfile
import time
from collections import defaultdict

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

import swasthone_rppg_FINAL_V2 as v2

MAX_UPLOAD_MB = int(os.environ.get("RPPG_MAX_UPLOAD_MB", "40"))
MAX_FRAMES = int(os.environ.get("RPPG_MAX_FRAMES", "2400"))        # ~80 s @ 30 fps
TIME_BUDGET_S = float(os.environ.get("RPPG_TIME_BUDGET_S", "90"))
DETECT_MAX_SIDE = int(os.environ.get("RPPG_DETECT_MAX_SIDE", "480"))
MIN_FACE_RATIO = float(os.environ.get("RPPG_MIN_FACE_RATIO", "0.80"))
MIN_FS, MAX_FS = 10.0, 60.0

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

_origins = [o.strip() for o in os.environ.get("RPPG_ALLOWED_ORIGINS", "").split(",") if o.strip()]
CORS(app, origins=_origins or "*")  # set RPPG_ALLOWED_ORIGINS in production


class AnalysisError(RuntimeError):
    """Error whose message is safe to show to the user."""

    def __init__(self, message, status=422):
        super().__init__(message)
        self.status = status


def effective_sampling_rate(timestamps):
    """FPS of the samples that actually went into the V2 buffers.

    Uses the frame timestamps of the buffered samples, so dropped/skipped frames
    (e.g. no face found) and variable-frame-rate recordings are accounted for.
    Returns None when timestamps are unusable.
    """
    ts = np.asarray(timestamps, dtype=float)
    if len(ts) < 30 or not np.all(np.isfinite(ts)):
        return None
    span = ts[-1] - ts[0]
    if span <= 5.0 or np.any(np.diff(ts) < 0):
        return None
    return float((len(ts) - 1) / span)


def _method_summaries(window_results):
    """Presentation-only summaries; does not participate in V2 scoring."""
    by_method = defaultdict(list)
    for window in window_results:
        for item in window.get("individual", []):
            by_method[item["method"]].append(item)

    summaries = []
    for method, items in by_method.items():
        weights = np.asarray(
            [max(1e-6, float(item.get("snr", 0.0)) + 6.0) for item in items],
            dtype=float,
        )
        hrs = np.asarray([float(item["hr"]) for item in items], dtype=float)
        hr = float(np.average(hrs, weights=weights)) if len(hrs) else None
        summaries.append({
            "method": method,
            "heartRate": round(hr) if hr is not None else None,
        })
    summaries.sort(key=lambda x: x["method"])
    return summaries


def analyze_video(file_storage, nominal_duration=None, cascade_factory=None):
    t_start = time.time()
    suffix = ".webm"
    filename = (file_storage.filename or "").lower()
    if filename.endswith(".mp4"):
        suffix = ".mp4"
    elif filename.endswith(".mov"):
        suffix = ".mov"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        file_storage.save(tmp)
        video_path = tmp.name

    cap = cv2.VideoCapture(video_path)
    try:
        if not cap.isOpened():
            raise AnalysisError(
                "Could not decode the browser recording. "
                "Make sure the browser supports WebM recording.",
                status=400,
            )

        cascade = (cascade_factory or (lambda: cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )))()
        if cascade.empty():
            raise RuntimeError("Could not load face detector.")

        buffers = {"Forehead": [], "Left Cheek": [], "Right Cheek": []}
        sample_ts = []          # timestamp (s) of every frame that was buffered
        all_face_history = []
        brightness_history = []
        smoothed_face = None
        frames = 0
        face_frames = 0
        last_frame_shape = (480, 640, 3)
        fallback_idx_ts = []    # frame-index timestamps if the container has none
        have_container_ts = True

        while True:
            if frames >= MAX_FRAMES:
                raise AnalysisError(
                    f"Recording is too long (more than {MAX_FRAMES} frames). "
                    "Please record 30 seconds.", status=413)
            if time.time() - t_start > TIME_BUDGET_S:
                elapsed = time.time() - t_start
                print(
                    f"[V2 TIMEOUT] stage=decode elapsed={elapsed:.1f}s "
                    f"frames={frames} faces={face_frames}"
                )
                raise AnalysisError(
                    "Analysis took too long and was stopped. Please retake the "
                    "measurement.", status=504)

            ok, frame = cap.read()
            if not ok:
                break

            pos_ms = cap.get(cv2.CAP_PROP_POS_MSEC)
            if not (pos_ms and np.isfinite(pos_ms) and pos_ms > 0) and frames > 0:
                have_container_ts = False
            ts = (pos_ms / 1000.0) if pos_ms else 0.0

            last_frame_shape = frame.shape
            frames += 1

            # --- face detection on a downscaled image ----------------------
            # Resize before grayscale conversion. The detector only needs a
            # <=480px image; ROI crops below still use the original frame.
            fh, fw = frame.shape[:2]
            scale = min(1.0, DETECT_MAX_SIDE / float(max(fh, fw)))
            if scale < 1.0:
                small_frame = cv2.resize(
                    frame,
                    (max(1, int(round(fw * scale))),
                     max(1, int(round(fh * scale)))),
                    interpolation=cv2.INTER_AREA,
                )
            else:
                small_frame = frame
            small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
            min_side = max(20, int(100 * scale))
            faces = cascade.detectMultiScale(
                small, scaleFactor=1.1, minNeighbors=5,
                minSize=(min_side, min_side),
            )
            if len(faces) and scale < 1.0:
                faces = [tuple(int(round(v / scale)) for v in f) for f in faces]

            if len(faces):
                face = max(faces, key=lambda r: r[2] * r[3])
                smoothed_face = v2.smooth_face_box(smoothed_face, face)
                x, y, w, h = smoothed_face
                all_face_history.append(smoothed_face)

                rois = v2.get_rois(frame, smoothed_face)
                extracted = {}
                for name, (x1, y1, x2, y2) in rois.items():
                    crop = frame[y1:y2, x1:x2]
                    if crop.size == 0:
                        continue
                    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                    rgb = cv2.resize(rgb, v2.ROI_SIZE, interpolation=cv2.INTER_AREA)
                    extracted[name] = rgb

                if set(buffers).issubset(extracted):
                    face_frames += 1
                    sample_ts.append(ts)
                    fallback_idx_ts.append(frames - 1)
                    for name in buffers:
                        buffers[name].append(extracted[name])

                px1 = max(0, x - int(v2.FACE_PADDING * w))
                py1 = max(0, y - int(v2.FACE_PADDING * h))
                px2 = min(frame.shape[1], x + w + int(v2.FACE_PADDING * w))
                py2 = min(frame.shape[0], y + h + int(v2.FACE_PADDING * h))
                fcrop = frame[py1:py2, px1:px2]
                if fcrop.size:
                    brightness_history.append(
                        float(np.mean(cv2.cvtColor(fcrop, cv2.COLOR_BGR2GRAY)))
                    )

        t_decode = time.time() - t_start

        if frames == 0:
            raise AnalysisError("No frames were decoded from the recording.", status=400)

        face_ratio = face_frames / float(frames)
        if face_ratio < MIN_FACE_RATIO:
            raise AnalysisError(
                f"Face was found in only {face_ratio * 100:.0f}% of the recording. "
                "Keep your face centred, well lit and still, then retake.")

        # --- sampling rate ---------------------------------------------------
        fs = effective_sampling_rate(sample_ts) if have_container_ts else None
        fs_source = "container-timestamps"
        if fs is None and nominal_duration and nominal_duration > 5:
            # Container has no usable timestamps: use the known capture length.
            fs = len(sample_ts) / float(nominal_duration)
            fs_source = "frames/nominal-duration"
        if fs is None:
            raise AnalysisError(
                "Could not determine the recording frame rate. Please retake.")
        if not (MIN_FS <= fs <= MAX_FS):
            raise AnalysisError(
                f"Recording frame rate looks wrong ({fs:.1f} FPS). Please retake "
                "in a brighter place or on a faster device.")

        n = min(len(v) for v in buffers.values())
        win = int(v2.WINDOW_SECONDS * fs)
        step = int(v2.STEP_SECONDS * fs)

        window_results = []
        if n >= win:
            for window_id, start_idx in enumerate(range(0, n - win + 1, step)):
                if time.time() - t_start > TIME_BUDGET_S:
                    elapsed = time.time() - t_start
                    print(
                        f"[V2 TIMEOUT] stage=window-start elapsed={elapsed:.1f}s "
                        f"window={window_id}"
                    )
                    raise AnalysisError(
                        "Analysis took too long and was stopped. Please retake "
                        "the measurement.", status=504)
                end_idx = start_idx + win
                sub = {name: vals[start_idx:end_idx] for name, vals in buffers.items()}
                window_start = time.time()
                result = v2.process_window(sub, fs, window_id=window_id)
                window_elapsed = time.time() - window_start
                print(
                    f"[V2 WINDOW TIMING] window={window_id} "
                    f"duration={window_elapsed:.2f}s "
                    f"elapsed_total={time.time() - t_start:.1f}s"
                )
                if result:
                    window_results.append(result)
                if time.time() - t_start > TIME_BUDGET_S:
                    elapsed = time.time() - t_start
                    print(
                        f"[V2 TIMEOUT] stage=window-processing elapsed={elapsed:.1f}s "
                        f"window={window_id} duration={window_elapsed:.2f}s"
                    )
                    raise AnalysisError(
                        "Analysis took too long and was stopped. Please retake "
                        "the measurement.", status=504)

        h, w = last_frame_shape[:2]
        motion = v2.compute_motion_score(all_face_history, w, h) if frames else 0.0
        lighting = v2.compute_lighting_score(brightness_history)
        final = v2.final_trust(window_results, motion, lighting)

        heart_rate = None if final["hr"] is None else int(round(final["hr"]))
        trust = int(round(final["trust"]))
        confidence = (
            "high" if final["accept"] and trust >= 70
            else "medium" if trust >= 40
            else "low"
        )

        print(
            f"[V2 TIMING] frames={frames} face_ratio={face_ratio:.2f} fs={fs:.2f} "
            f"({fs_source}) decode+detect={t_decode:.1f}s total={time.time() - t_start:.1f}s "
            f"windows={len(window_results)} hr={heart_rate} trust={trust}"
        )

        return {
            "heartRate": heart_rate,
            "trustScore": trust,
            "signalQuality": int(round(final["signal"])),
            "temporalStability": int(round(final["temporal"])),
            "algorithmAgreement": int(round(final["method"])),
            "regionAgreement": int(round(final["region"])),
            "motionStability": int(round(final["motion"])),
            "lighting": int(round(final["lighting"])),
            "confidence": confidence,
            "accept": bool(final["accept"]),
            "windowHrs": [round(float(x), 1) for x in final["window_hrs"]],
            "globalClusters": [
                {
                    "hr": round(float(c["hr"]), 1),
                    "score": round(float(c["score"]), 2),
                    "windows": len(c["windows"]),
                }
                for c in final.get("global_clusters", [])
            ],
            "methods": _method_summaries(window_results),
            "frames": frames,
            "samplingRate": round(float(fs), 2),
            "demoMode": False,
        }
    finally:
        cap.release()
        try:
            os.remove(video_path)
        except OSError:
            pass


@app.get("/health")
def health():
    return jsonify({"success": True, "service": "SwasthOne exact V2 rPPG service"})


@app.errorhandler(413)
def too_large(_):
    return jsonify({
        "success": False,
        "message": f"Recording is larger than {MAX_UPLOAD_MB} MB.",
    }), 413


@app.post("/analyze")
def analyze():
    recording = request.files.get("video")
    if recording is None:
        return jsonify({
            "success": False,
            "message": "A browser recording named 'video' is required.",
        }), 400

    try:
        nominal = float(request.form.get("duration", "0") or 0)
    except ValueError:
        nominal = 0.0

    try:
        result = analyze_video(recording, nominal_duration=nominal)
        if result["heartRate"] is None:
            print("[V2 DEBUG RESULT]", result)
            return jsonify({
                "success": False,
                "message": "V2 could not obtain a usable heart-rate estimate.",
                "result": result,
            }), 422
        return jsonify({"success": True, "result": result})
    except AnalysisError as exc:
        print(f"[V2 SERVICE] {exc}")
        return jsonify({"success": False, "message": str(exc)}), exc.status
    except Exception as exc:  # noqa: BLE001
        print(f"[V2 SERVICE ERROR] {exc!r}")
        return jsonify({
            "success": False,
            "message": "The rPPG service failed to process the recording.",
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("RPPG_PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
