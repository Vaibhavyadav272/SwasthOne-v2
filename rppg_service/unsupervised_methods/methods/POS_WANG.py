"""
POS
Wang, W., den Brinker, A. C., Stuijk, S., & de Haan, G. (2017).
Algorithmic principles of remote PPG.
IEEE Transactions on Biomedical Engineering, 64(7), 1479-1491.
"""

import math

import numpy as np
from scipy import signal

from unsupervised_methods import utils


def _process_video(frames):
    """
    Convert video frames into an N x 3 RGB signal.

    Input:
        frames -> N x H x W x 3

    Output:
        RGB -> N x 3
    """

    rgb_values = []

    for frame in frames:

        frame = np.asarray(frame)

        if frame.ndim != 3 or frame.shape[2] != 3:
            continue

        mean_rgb = np.mean(
            frame.astype(np.float64),
            axis=(0, 1)
        )

        rgb_values.append(mean_rgb)

    if len(rgb_values) < 10:
        raise ValueError("Not enough valid RGB frames for POS")

    RGB = np.asarray(
        rgb_values,
        dtype=np.float64
    )

    if RGB.ndim != 2 or RGB.shape[1] != 3:
        raise ValueError(
            f"POS expected RGB shape (N, 3), got {RGB.shape}"
        )

    return RGB


def POS_WANG(frames, fs):
    """
    Plane-Orthogonal-to-Skin (POS) rPPG algorithm.

    Parameters
    ----------
    frames : sequence
        RGB video frames.
    fs : float
        Sampling frequency / FPS.

    Returns
    -------
    np.ndarray
        BVP signal.
    """

    if fs is None or fs <= 0:
        raise ValueError("Invalid sampling frequency for POS")

    RGB = _process_video(frames)

    N = RGB.shape[0]

    if N < int(fs * 10):
        raise ValueError(
            f"POS requires at least {int(fs * 10)} frames, got {N}"
        )

    WinSec = 1.6

    H = np.zeros(
        N,
        dtype=np.float64
    )

    L = max(
        2,
        int(math.ceil(WinSec * fs))
    )

    for n in range(N):

        m = n - L

        if m < 0:
            continue

        window = RGB[m:n]

        channel_mean = np.mean(
            window,
            axis=0
        )

        channel_mean = np.where(
            np.abs(channel_mean) < 1e-12,
            1e-12,
            channel_mean
        )

        # Temporal normalization
        Cn = (
            window /
            channel_mean
        )

        # Cn shape:
        # observations x RGB
        #
        # POS requires:
        # RGB x observations
        Cn = Cn.T

        projection = np.array(
            [
                [0.0, 1.0, -1.0],
                [-2.0, 1.0, 1.0],
            ],
            dtype=np.float64
        )

        S = projection @ Cn

        std0 = np.std(S[0])
        std1 = np.std(S[1])

        if std1 < 1e-12:
            continue

        h = (
            S[0] +
            (std0 / std1) * S[1]
        )

        h = h - np.mean(h)

        H[m:n] += h

    BVP = H

    # Detrending
    try:
        BVP = utils.detrend(
            BVP,
            100
        )
    except Exception:
        # Safe fallback if toolbox detrend expects matrix input
        BVP = signal.detrend(BVP)

    BVP = np.asarray(
        BVP,
        dtype=np.float64
    ).flatten()

    # Final POS bandpass
    low = 0.75
    high = 3.0

    nyquist = fs / 2.0

    high = min(
        high,
        nyquist * 0.90
    )

    if low >= high:
        raise ValueError(
            f"Invalid POS bandpass for fs={fs}"
        )

    b, a = signal.butter(
        1,
        [
            low / nyquist,
            high / nyquist
        ],
        btype="bandpass"
    )

    min_length = 3 * max(
        len(a),
        len(b)
    ) + 1

    if len(BVP) <= min_length:
        raise ValueError(
            "Not enough samples for POS filtering"
        )

    BVP = signal.filtfilt(
        b,
        a,
        BVP
    )

    return np.asarray(
        BVP,
        dtype=np.float64
    ).flatten()
