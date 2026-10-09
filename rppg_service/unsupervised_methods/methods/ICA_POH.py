"""
ICA-based remote photoplethysmography (rPPG).

This implementation accepts real-valued RGB ROI frames, normalizes their
per-frame channel means, separates the channels using real-valued FastICA,
selects the component with the strongest normalized power in the expected
cardiac band, and band-pass filters the selected component.

Based on the ICA approach described in:
Poh, M. Z., McDuff, D. J., & Picard, R. W. (2010).
Non-contact, automated cardiac pulse measurements using video imaging
and blind source separation. Optics Express, 18(10), 10762-10774.

Note:
- FastICA is used here instead of the custom complex-valued JADE code.
- This removes the complex-to-real cast that generated ComplexWarning.
- This is an algorithmic change; validate heart-rate estimates against a
  reference device before relying on the results.
"""

import warnings

import numpy as np
from scipy import signal
from sklearn.decomposition import FastICA
from sklearn.exceptions import ConvergenceWarning
from unsupervised_methods import utils


def ICA_POH(frames, FS):
    """
    Estimate a blood-volume-pulse (BVP) signal from ROI video frames.

    Parameters
    ----------
    frames : sequence of np.ndarray
        Video frames containing the selected ROI. Each valid frame must have
        shape (height, width, 3), with channel order consistent across frames.
    FS : float
        Effective sampling frequency in frames per second.

    Returns
    -------
    np.ndarray
        One-dimensional, real-valued, band-pass-filtered BVP signal.

    Raises
    ------
    ValueError
        If frames, sampling frequency, channel variation, or output signal
        are invalid or insufficient for processing.
    """
    if frames is None or len(frames) < 10:
        raise ValueError("Not enough frames for ICA")

    if FS is None or not np.isfinite(FS) or FS <= 0:
        raise ValueError("Invalid sampling frequency")

    # Expected cardiac frequency band in Hz.
    LPF = 0.7
    HPF = 2.5

    RGB = process_video(frames)

    if RGB.ndim != 2 or RGB.shape[1] != 3:
        raise ValueError(
            f"Expected RGB signal with shape (N, 3), got {RGB.shape}"
        )

    NyquistF = FS / 2.0
    if HPF >= NyquistF:
        raise ValueError(
            f"Sampling frequency {FS:.2f} FPS is too low for "
            f"{HPF} Hz upper cutoff"
        )

    # Normalize each real-valued RGB channel after detrending.
    BGRNorm = np.zeros_like(RGB, dtype=np.float64)
    Lambda = 100

    for c in range(3):
        channel = RGB[:, c].astype(np.float64, copy=False)
        BGRDetrend = np.asarray(utils.detrend(channel, Lambda), dtype=np.float64)

        if not np.all(np.isfinite(BGRDetrend)):
            raise ValueError(f"RGB channel {c} contains non-finite values")

        std = np.std(BGRDetrend)
        if std < 1e-12:
            raise ValueError(
                f"RGB channel {c} has insufficient variation"
            )

        BGRNorm[:, c] = (
            BGRDetrend - np.mean(BGRDetrend)
        ) / std

    if not np.all(np.isfinite(BGRNorm)):
        raise ValueError("Normalized RGB signal contains non-finite values")

    # FastICA expects rows=observations and columns=features.
    # Input and output remain real-valued.
    ica_model = FastICA(
        n_components=3,
        algorithm="parallel",
        whiten="unit-variance",
        fun="logcosh",
        max_iter=300,
        tol=1e-3,
        random_state=42,
    )

    # A non-converged decomposition is not reliable evidence. Let the caller
    # skip this supporting method and retain consensus from the other methods.
    try:
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always", ConvergenceWarning)
            sources = ica_model.fit_transform(BGRNorm)
        if any(issubclass(w.category, ConvergenceWarning) for w in caught):
            raise ValueError(
                "FastICA did not converge; ICA component rejected for this window"
            )
    except Exception as exc:
        raise ValueError(f"FastICA source separation failed: {exc}") from exc

    if sources.ndim != 2 or sources.shape != (len(BGRNorm), 3):
        raise ValueError(
            f"Unexpected FastICA output shape: {sources.shape}"
        )

    if not np.all(np.isfinite(sources)):
        raise ValueError("FastICA produced non-finite source components")

    # Keep the (3, N) orientation used by the existing component-selection
    # and filtering stages.
    S = sources.T.astype(np.float64, copy=False)

    # Select the component with the strongest normalized cardiac-band power.
    component_scores = np.zeros(3, dtype=np.float64)
    for c in range(3):
        component = S[c].ravel()

        if component.size < 10:
            continue

        # FFT-based power spectrum.
        spectrum = np.fft.rfft(component)
        freqs = np.fft.rfftfreq(component.size, d=1.0 / FS)
        power = np.abs(spectrum) ** 2

        valid = (freqs >= LPF) & (freqs <= HPF)
        if not np.any(valid):
            continue

        cardiac_power = power[valid]
        total_power = np.sum(cardiac_power)

        if not np.isfinite(total_power) or total_power <= 1e-12:
            continue

        component_scores[c] = np.max(cardiac_power / total_power)

    if not np.any(component_scores > 0):
        raise ValueError(
            "No ICA component has usable power in the cardiac frequency band"
        )

    selected_component = int(np.argmax(component_scores))
    BVP_I = S[selected_component].astype(np.float64, copy=False).ravel()

    # Butterworth band-pass filter.
    low = LPF / NyquistF
    high = HPF / NyquistF

    B, A = signal.butter(3, [low, high], btype="bandpass")

    # scipy.signal.filtfilt requires enough samples for padding.
    min_required = 3 * max(len(A), len(B)) + 1
    if len(BVP_I) <= min_required:
        raise ValueError(
            f"Not enough samples for filtering: "
            f"{len(BVP_I)} samples; need more than {min_required}"
        )

    BVP_F = signal.filtfilt(B, A, BVP_I)

    if not np.all(np.isfinite(BVP_F)):
        raise ValueError("Filtered BVP contains non-finite values")

    return np.asarray(BVP_F, dtype=np.float64).ravel()


def process_video(frames):
    """
    Calculate mean channel values for every valid ROI frame.

    Returns
    -------
    np.ndarray
        Real-valued array with shape (N, 3).
    """
    RGB = []

    for frame in frames:
        if frame is None:
            continue

        frame = np.asarray(frame)
        if frame.ndim != 3 or frame.shape[2] != 3:
            continue

        if frame.size == 0:
            continue

        mean_value = np.mean(frame, axis=(0, 1), dtype=np.float64)
        if not np.all(np.isfinite(mean_value)):
            continue

        RGB.append(mean_value)

    if len(RGB) == 0:
        raise ValueError("No valid frames")

    RGB = np.asarray(RGB, dtype=np.float64)

    if RGB.ndim != 2 or RGB.shape[1] != 3:
        raise ValueError(f"Invalid RGB signal shape: {RGB.shape}")

    return RGB
