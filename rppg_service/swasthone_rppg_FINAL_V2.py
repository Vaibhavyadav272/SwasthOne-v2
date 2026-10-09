"""
SwasthOne rPPG FINAL V2 DEMO PIPELINE

Camera -> face tracking -> 3 facial ROIs
-> 7 unsupervised rPPG methods (POS/CHROM primary, others supporting)
-> multi-peak spectral candidates -> overlapping temporal windows
-> cross-method + cross-region candidate consensus
-> TrustScore -> ACCEPT / RETAKE

Prototype screening/demo implementation. NOT clinically validated.
TrustScore is measurement-quality confidence, not a medical risk score.
"""

import time
from collections import defaultdict

import cv2
import numpy as np
from scipy.signal import butter, filtfilt

from unsupervised_methods.methods.POS_WANG import POS_WANG
from unsupervised_methods.methods.CHROME_DEHAAN import CHROME_DEHAAN
from unsupervised_methods.methods.ICA_POH import ICA_POH
from unsupervised_methods.methods.GREEN import GREEN
from unsupervised_methods.methods.LGI import LGI
from unsupervised_methods.methods.PBV import PBV
from unsupervised_methods.methods.OMIT import OMIT


# ============================================================
# SETTINGS
# ============================================================

CAMERA_INDEX = 0
DURATION_SECONDS = 30
ROI_SIZE = (72, 72)

MIN_HR = 45.0
MAX_HR = 140.0

WINDOW_SECONDS = 15.0
STEP_SECONDS = 5.0

FACE_SMOOTHING = 0.25
FACE_PADDING = 0.12

TRUST_THRESHOLD = 70.0

METHOD_TOLERANCE = 7.0
CANDIDATE_TOLERANCE = 5.0

# Number of spectral candidates retained from each method/ROI.
TOP_CANDIDATES = 5

# POS and CHROM are the primary methods; the remaining methods are
# supporting/rescue evidence rather than equal votes.
METHOD_WEIGHTS = {
    "POS": 1.35,
    "CHROM": 1.35,
    "ICA": 0.80,
    "GREEN": 0.75,
    "LGI": 0.75,
    "PBV": 0.75,
    "OMIT": 0.75,
}


# ============================================================
# BASIC HELPERS
# ============================================================

def clamp01(x):
    return float(np.clip(x, 0.0, 1.0))


def smooth_face_box(previous, current, alpha=FACE_SMOOTHING):
    if previous is None:
        return tuple(current)
    return tuple(
        int(alpha * c + (1.0 - alpha) * p)
        for p, c in zip(previous, current)
    )


def bandpass(signal, fs, low=0.65, high=3.0, order=3):
    signal = np.asarray(signal, dtype=np.float64).flatten()
    if len(signal) < max(30, order * 8):
        return signal

    nyq = fs / 2.0
    high = min(high, nyq * 0.90)
    low = max(low, 0.05)
    if low >= high:
        return signal - np.mean(signal)

    b, a = butter(order, [low / nyq, high / nyq], btype="band")
    try:
        return filtfilt(b, a, signal)
    except Exception:
        return signal - np.mean(signal)


# ============================================================
# SPECTRAL ANALYSIS
# ============================================================

def spectral_profile(bvp, fs):
    """Return HR grid + normalized spectral power."""
    bvp = np.asarray(bvp, dtype=np.float64).flatten()
    if len(bvp) < int(fs * 10):
        return None

    bvp = bvp - np.mean(bvp)
    bvp = bandpass(bvp, fs)

    if np.std(bvp) < 1e-8:
        return None

    # Zero padding improves peak localization, not information content.
    nfft = max(4096, 2 ** int(np.ceil(np.log2(len(bvp) * 8))))
    window = np.hanning(len(bvp))
    spec = np.abs(np.fft.rfft(bvp * window, n=nfft)) ** 2
    freqs = np.fft.rfftfreq(nfft, 1.0 / fs)

    valid = (freqs >= MIN_HR / 60.0) & (freqs <= MAX_HR / 60.0)
    freqs = freqs[valid]
    spec = spec[valid]

    if len(spec) < 10 or np.max(spec) <= 0:
        return None

    hr_grid = np.arange(MIN_HR, MAX_HR + 0.01, 0.5)
    power = np.interp(hr_grid / 60.0, freqs, spec)

    kernel = np.ones(5, dtype=np.float64) / 5.0
    power = np.convolve(power, kernel, mode="same")
    power = np.maximum(power, 0)
    power = power / (float(np.sum(power)) + 1e-12)

    return hr_grid, power


def spectral_candidates(hr_grid, power, top_n=TOP_CANDIDATES):
    """Return several meaningful spectral candidates instead of only argmax."""
    if hr_grid is None or power is None or len(power) < 10:
        return []

    peaks = []
    for i in range(2, len(power) - 2):
        if power[i] >= power[i - 1] and power[i] >= power[i + 1]:
            peaks.append(i)

    if not peaks:
        peaks = [int(np.argmax(power))]

    total = float(np.sum(power)) + 1e-12
    candidates = []

    for i in peaks:
        hr = float(hr_grid[i])
        base = float(power[i])

        # Local energy gives a more stable measure than one FFT bin.
        lo = max(0, i - 5)
        hi = min(len(power), i + 6)
        local_energy = float(np.sum(power[lo:hi]))

        # A local-background ratio acts like a lightweight prominence score.
        bg_mask = np.ones(len(power), dtype=bool)
        bg_mask[max(0, i - 10):min(len(power), i + 11)] = False
        background = float(np.mean(power[bg_mask])) if np.any(bg_mask) else total / len(power)
        prominence = base / (background + 1e-12)

        # Relative spectral support around the peak.
        rel_power = local_energy / total

        # SNR-like quantity using the local band against the remaining spectrum.
        rest = max(1e-12, total - local_energy)
        snr_like = 10.0 * np.log10((local_energy + 1e-12) /
                                    (rest / max(1, len(power) - (hi - lo)) + 1e-12))

        candidates.append({
            "hr": hr,
            "base_power": base,
            "relative_power": rel_power,
            "prominence": float(prominence),
            "snr": float(snr_like),
            "index": i,
        })

    # First rank by spectral evidence.
    candidates.sort(
        key=lambda c: (
            0.55 * c["relative_power"]
            + 0.25 * clamp01((c["prominence"] - 1.0) / 8.0)
            + 0.20 * clamp01((c["snr"] + 5.0) / 15.0)
        ),
        reverse=True,
    )

    # Avoid returning many almost-identical neighboring peaks.
    selected = []
    for c in candidates:
        if all(abs(c["hr"] - s["hr"]) >= 4.0 for s in selected):
            selected.append(c)
        if len(selected) >= top_n:
            break

    return selected


# ============================================================
# FACE / ROI
# ============================================================

def get_rois(frame, face):
    x, y, w, h = face

    candidates = {
        "Forehead": (
            x + int(0.18 * w),
            y + int(0.06 * h),
            x + int(0.82 * w),
            y + int(0.30 * h),
        ),
        "Left Cheek": (
            x + int(0.10 * w),
            y + int(0.50 * h),
            x + int(0.43 * w),
            y + int(0.76 * h),
        ),
        "Right Cheek": (
            x + int(0.57 * w),
            y + int(0.50 * h),
            x + int(0.90 * w),
            y + int(0.76 * h),
        ),
    }

    height, width = frame.shape[:2]
    rois = {}

    for name, (x1, y1, x2, y2) in candidates.items():
        x1 = max(0, min(x1, width - 1))
        x2 = max(1, min(x2, width))
        y1 = max(0, min(y1, height - 1))
        y2 = max(1, min(y2, height))
        if x2 > x1 and y2 > y1:
            rois[name] = (x1, y1, x2, y2)

    return rois


# ============================================================
# CANDIDATE CONSENSUS
# ============================================================

def candidate_weight(candidate, method, region):
    """Quality weight for one spectral candidate."""
    method_factor = METHOD_WEIGHTS.get(method, 0.75)
    power_factor = 0.35 + 0.65 * clamp01(candidate["relative_power"] / 0.20)
    prominence_factor = 0.45 + 0.55 * clamp01((candidate["prominence"] - 1.0) / 8.0)
    snr_factor = 0.35 + 0.65 * clamp01((candidate["snr"] + 5.0) / 15.0)
    return method_factor * power_factor * prominence_factor * snr_factor


def cluster_candidates(candidates, tolerance=CANDIDATE_TOLERANCE):
    """Cluster candidate HRs and return clusters sorted by evidence."""
    clusters = []

    for item in sorted(candidates, key=lambda x: x["hr"]):
        placed = False
        for cluster in clusters:
            center = cluster["hr"]
            if abs(item["hr"] - center) <= tolerance:
                cluster["items"].append(item)
                weights = np.array([x["weight"] for x in cluster["items"]], dtype=float)
                hrs = np.array([x["hr"] for x in cluster["items"]], dtype=float)
                cluster["hr"] = float(np.average(hrs, weights=weights))
                placed = True
                break
        if not placed:
            clusters.append({"hr": item["hr"], "items": [item]})

    scored = []
    for cluster in clusters:
        items = cluster["items"]
        total_weight = float(sum(x["weight"] for x in items))
        methods = set(x["method"] for x in items)
        regions = set(x["region"] for x in items)
        windows = set(x.get("window_id", -1) for x in items)

        # Diversity is important: repeated support from different methods,
        # regions and windows is stronger than many near-duplicate peaks.
        method_div = min(1.0, len(methods) / 4.0)
        region_div = min(1.0, len(regions) / 3.0)
        window_div = min(1.0, len(windows) / 3.0)

        diversity = 0.45 + 0.25 * method_div + 0.20 * region_div + 0.10 * window_div
        score = total_weight * diversity

        scored.append({
            "hr": float(cluster["hr"]),
            "score": float(score),
            "weight": total_weight,
            "methods": methods,
            "regions": regions,
            "windows": windows,
            "items": items,
        })

    scored.sort(key=lambda c: c["score"], reverse=True)
    return scored


def choose_window_hr(individual):
    """Choose a window HR from multiple candidates across all methods/ROIs."""
    candidate_items = []

    for item in individual:
        for candidate in item["candidates"]:
            candidate_items.append({
                **candidate,
                "method": item["method"],
                "region": item["region"],
                "weight": candidate_weight(candidate, item["method"], item["region"]),
            })

    clusters = cluster_candidates(candidate_items)
    if not clusters:
        return None, 0.0, 0.0, 0.0, []

    best = clusters[0]

    # Candidate confidence is based on how dominant the best cluster is and
    # how diverse its supporting evidence is. It is NOT accuracy.
    total_score = sum(c["score"] for c in clusters) + 1e-12
    dominance = best["score"] / total_score
    diversity = (
        0.40 * min(1.0, len(best["methods"]) / 4.0)
        + 0.35 * min(1.0, len(best["regions"]) / 3.0)
        + 0.25 * min(1.0, len(best["windows"]) / 1.0)
    )
    candidate_conf = 100.0 * clamp01(0.65 * dominance + 0.35 * diversity)

    method_flags = []
    region_support = defaultdict(list)
    for item in individual:
        close = abs(item["hr"] - best["hr"]) <= METHOD_TOLERANCE
        method_flags.append(close)
        if close:
            region_support[item["region"]].append(item["hr"])

    method_agreement = 100.0 * np.mean(method_flags) if method_flags else 0.0
    region_agreement = 100.0 * len(region_support) / 3.0

    # Spectral quality is the weighted average of candidates supporting the
    # selected cluster, capped by how much evidence is actually present.
    supporting = best["items"]
    support_weights = np.array([x["weight"] for x in supporting], dtype=float)
    support_quality = np.array([
        100.0 * clamp01(
            0.45 * (x["relative_power"] / 0.20)
            + 0.25 * ((x["prominence"] - 1.0) / 8.0)
            + 0.30 * ((x["snr"] + 5.0) / 15.0)
        )
        for x in supporting
    ])
    spectral_quality = float(np.average(support_quality, weights=support_weights))
    spectral_quality *= 0.65 + 0.35 * diversity

    return (
        float(best["hr"]),
        float(spectral_quality),
        float(method_agreement),
        float(region_agreement),
        clusters,
    )


# ============================================================
# WINDOW PROCESSING
# ============================================================

def process_window(region_buffers, fs, window_id=0):
    """Run all seven unsupervised methods and retain multiple HR candidates."""
    individual = []

    method_functions = [
        ("POS", POS_WANG),
        ("CHROM", CHROME_DEHAAN),
        ("ICA", ICA_POH),
        ("GREEN", GREEN),
        ("LGI", LGI),
        ("PBV", PBV),
        ("OMIT", OMIT),
    ]

    for region, frames in region_buffers.items():
        data = np.asarray(frames, dtype=np.float64)
        if len(data) < int(fs * 10):
            continue

        for method_name, fn in method_functions:
            try:
                # Toolbox signatures differ:
                # POS, CHROM and ICA require the sampling frequency;
                # the remaining methods take only the RGB frame data.
                if method_name in ("POS", "CHROM", "ICA"):
                    bvp = fn(data, fs)
                else:
                    bvp = fn(data)

                # Normalize every method output to a clean 1-D finite signal
                # before spectral analysis.
                bvp = np.asarray(bvp, dtype=np.float64).flatten()

                if len(bvp) < int(fs * 10):
                    raise ValueError("BVP output is shorter than 10 seconds")

                if not np.all(np.isfinite(bvp)):
                    raise ValueError("BVP output contains NaN or infinite values")

                profile = spectral_profile(bvp, fs)
                if profile is None:
                    continue

                hr_grid, power = profile
                candidates = spectral_candidates(hr_grid, power)
                if not candidates:
                    continue

                individual.append({
                    "region": region,
                    "method": method_name,
                    "hr": candidates[0]["hr"],
                    "snr": candidates[0]["snr"],
                    "candidates": candidates,
                    "window_id": window_id,
                })
            except Exception as exc:
                print(f"[WARN] {region}/{method_name}: {exc}")

    if not individual:
        return None

    hr, spectral_quality, method_agreement, region_agreement, clusters = choose_window_hr(individual)
    if hr is None:
        return None

    # Print the strongest cluster evidence for debugging/validation.
    top_clusters = clusters[:4]

    return {
        "hr": hr,
        "spectral_quality": spectral_quality,
        "method_agreement": method_agreement,
        "region_agreement": region_agreement,
        "individual": individual,
        "clusters": top_clusters,
    }


# ============================================================
# GLOBAL TRUST SCORE
# ============================================================

def compute_motion_score(face_history, frame_width, frame_height):
    if len(face_history) < 3:
        return 0.0

    centers = np.array([
        [
            (x + w / 2) / frame_width,
            (y + h / 2) / frame_height,
        ]
        for x, y, w, h in face_history
    ])

    movement = np.mean(np.linalg.norm(np.diff(centers, axis=0), axis=1))
    return 100.0 * clamp01(1.0 - movement * 35.0)


def compute_lighting_score(brightness):
    if len(brightness) < 3:
        return 0.0
    b = np.asarray(brightness, dtype=np.float64)
    mean = float(np.mean(b))
    if mean <= 1:
        return 0.0
    cv = float(np.std(b) / mean)
    return 100.0 * clamp01(1.0 - cv * 5.0)


def weighted_median(values, weights):
    values = np.asarray(values, dtype=float)
    weights = np.asarray(weights, dtype=float)
    order = np.argsort(values)
    values = values[order]
    weights = weights[order]
    c = np.cumsum(weights)
    return float(values[np.searchsorted(c, c[-1] / 2.0)])


def final_trust(window_results, motion_score, lighting_score):
    if not window_results:
        return {
            "hr": None, "trust": 0.0, "signal": 0.0,
            "temporal": 0.0, "method": 0.0, "region": 0.0,
            "motion": motion_score, "lighting": lighting_score,
            "accept": False, "window_hrs": [],
        }

    hrs = np.array([w["hr"] for w in window_results], dtype=float)
    weights = np.array([
        max(0.1, w["spectral_quality"] / 100.0)
        * max(0.25, w["method_agreement"] / 100.0)
        for w in window_results
    ])

    # First preserve the temporal median behavior from V1 as a safety net.
    temporal_median = weighted_median(hrs, weights)

    # V2 also clusters window HRs so a repeated candidate can win even when
    # one window briefly locks onto a harmonic/false peak.
    window_candidates = []
    for idx, w in enumerate(window_results):
        for cluster in w.get("clusters", []):
            window_candidates.append({
                "hr": cluster["hr"],
                "weight": cluster["score"],
                "method": "window_consensus",
                "region": "window",
                "window_id": idx,
            })

    global_clusters = cluster_candidates(window_candidates, tolerance=CANDIDATE_TOLERANCE)

    if global_clusters:
        best_global = global_clusters[0]
        # Require at least two temporal windows before overriding the V1 median.
        distinct_windows = len(best_global["windows"])
        if distinct_windows >= 2:
            final_hr = float(best_global["hr"])
        else:
            final_hr = temporal_median
    else:
        final_hr = temporal_median

    # Temporal stability is measured around the chosen HR rather than merely
    # around the raw median. This exposes instability instead of hiding it.
    spread = float(np.sqrt(np.average((hrs - final_hr) ** 2, weights=weights)))
    temporal = 100.0 * clamp01(np.exp(-spread / 8.0))

    signal = float(np.average(
        [w["spectral_quality"] for w in window_results],
        weights=weights,
    ))
    method = float(np.average(
        [w["method_agreement"] for w in window_results],
        weights=weights,
    ))
    region = float(np.average(
        [w["region_agreement"] for w in window_results],
        weights=weights,
    ))

    trust = (
        0.30 * signal
        + 0.25 * temporal
        + 0.20 * region
        + 0.15 * method
        + 0.05 * motion_score
        + 0.05 * lighting_score
    )

    accept = (
        trust >= TRUST_THRESHOLD
        and temporal >= 60.0
        and signal >= 45.0
        and method >= 50.0
        and region >= 66.0
    )

    return {
        "hr": final_hr,
        "trust": float(np.clip(trust, 0, 100)),
        "signal": signal,
        "temporal": temporal,
        "method": method,
        "region": region,
        "motion": motion_score,
        "lighting": lighting_score,
        "accept": accept,
        "window_hrs": hrs.tolist(),
        "global_clusters": global_clusters[:5],
    }


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 72)
    print("SwasthOne rPPG - FINAL V2 DEMO PIPELINE")
    print("7 METHODS | POS + CHROM PRIMARY | MULTI-PEAK TEMPORAL CONSENSUS")
    print("=" * 72)
    print("Keep your face centered, still and evenly illuminated.")
    print("Measurement duration: 30 seconds")
    print("Press Q to stop early.\n")

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    if cascade.empty():
        raise RuntimeError("Could not load face detector.")

    cap = cv2.VideoCapture(CAMERA_INDEX)
    if not cap.isOpened():
        raise RuntimeError("Could not open webcam.")

    cap.set(cv2.CAP_PROP_FPS, 30)

    buffers = {"Forehead": [], "Left Cheek": [], "Right Cheek": []}
    all_face_history = []
    brightness_history = []
    smoothed_face = None

    start = time.time()
    frames = 0
    last_frame_shape = (480, 640, 3)

    while time.time() - start < DURATION_SECONDS:
        ok, frame = cap.read()
        if not ok:
            continue

        last_frame_shape = frame.shape
        frames += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100)
        )

        if len(faces):
            face = max(faces, key=lambda r: r[2] * r[3])
            smoothed_face = smooth_face_box(smoothed_face, face)
            x, y, w, h = smoothed_face
            all_face_history.append(smoothed_face)

            rois = get_rois(frame, smoothed_face)
            extracted = {}

            for name, (x1, y1, x2, y2) in rois.items():
                crop = frame[y1:y2, x1:x2]
                if crop.size == 0:
                    continue
                rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                rgb = cv2.resize(rgb, ROI_SIZE, interpolation=cv2.INTER_AREA)
                extracted[name] = rgb

            if set(buffers).issubset(extracted):
                for name in buffers:
                    buffers[name].append(extracted[name])

            px1 = max(0, x - int(FACE_PADDING * w))
            py1 = max(0, y - int(FACE_PADDING * h))
            px2 = min(frame.shape[1], x + w + int(FACE_PADDING * w))
            py2 = min(frame.shape[0], y + h + int(FACE_PADDING * h))
            fcrop = frame[py1:py2, px1:px2]
            if fcrop.size:
                brightness_history.append(
                    float(np.mean(cv2.cvtColor(fcrop, cv2.COLOR_BGR2GRAY)))
                )

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            for name, (x1, y1, x2, y2) in rois.items():
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 165, 255), 2)

        remaining = max(0.0, DURATION_SECONDS - (time.time() - start))
        cv2.putText(frame, f"rPPG scan: {remaining:04.1f}s", (20, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(frame, "Keep face still | Q = stop", (20, 65),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)
        cv2.imshow("SwasthOne - rPPG Scan V2", frame)

        if (cv2.waitKey(1) & 0xFF) == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

    elapsed = max(0.1, time.time() - start)
    fs = frames / elapsed

    print(f"\nCaptured frames : {frames}")
    print(f"Elapsed time    : {elapsed:.2f} s")
    print(f"Measured FPS    : {fs:.2f}")
    print("Region samples:")
    for name, vals in buffers.items():
        print(f"  {name:<12}: {len(vals)}")

    n = min(len(v) for v in buffers.values())
    win = int(WINDOW_SECONDS * fs)
    step = int(STEP_SECONDS * fs)

    window_results = []
    if n >= win:
        for window_id, start_idx in enumerate(range(0, n - win + 1, step)):
            end_idx = start_idx + win
            sub = {name: vals[start_idx:end_idx] for name, vals in buffers.items()}
            result = process_window(sub, fs, window_id=window_id)
            if result:
                window_results.append(result)
                cluster_text = ", ".join(
                    f"{c['hr']:.0f}({len(c['methods'])}m/{len(c['regions'])}r)"
                    for c in result["clusters"][:3]
                )
                print(
                    f"Window {start_idx/fs:04.1f}-{end_idx/fs:04.1f}s: "
                    f"HR={result['hr']:.1f} | "
                    f"signal={result['spectral_quality']:.0f} | "
                    f"method={result['method_agreement']:.0f} | "
                    f"region={result['region_agreement']:.0f} | "
                    f"candidates={cluster_text}"
                )

    h, w = last_frame_shape[:2]
    motion = compute_motion_score(all_face_history, w, h) if frames else 0.0
    lighting = compute_lighting_score(brightness_history)

    final = final_trust(window_results, motion, lighting)

    print("\n" + "=" * 72)
    print("SWASTHONE FINAL V2 rPPG RESULT")
    print("=" * 72)
    if final["hr"] is None:
        print("Heart Rate          : N/A")
    else:
        print(f"Heart Rate          : {final['hr']:.0f} BPM")
    print(f"Signal Quality      : {final['signal']:.0f}/100")
    print(f"Temporal Stability  : {final['temporal']:.0f}/100")
    print(f"Method Agreement    : {final['method']:.0f}/100")
    print(f"Region Agreement    : {final['region']:.0f}/100")
    print(f"Motion Stability    : {final['motion']:.0f}/100")
    print(f"Lighting Stability  : {final['lighting']:.0f}/100")
    print(f"TrustScore          : {final['trust']:.0f}/100")
    print(f"Decision            : {'ACCEPT' if final['accept'] else 'RETAKE'}")
    print("=" * 72)

    if final["window_hrs"]:
        print("Window HRs:", ", ".join(f"{x:.1f}" for x in final["window_hrs"]))

    if final.get("global_clusters"):
        print("Global candidate clusters:")
        for c in final["global_clusters"]:
            print(
                f"  {c['hr']:.1f} BPM | score={c['score']:.2f} | "
                f"windows={len(c['windows'])}"
            )

    print("\nInterpretation: TrustScore represents confidence in the camera measurement")
    print("quality, not a diagnosis or a judgement about the user's health.")


if __name__ == "__main__":
    main()
