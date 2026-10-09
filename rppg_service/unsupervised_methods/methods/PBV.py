"""
PBV
Improved motion robustness of remote-ppg by using
the blood volume pulse signature.

De Haan, G. & Van Leest, A.
Physiological Measurement 35, 1913 (2014)
"""

import numpy as np


def _extract_rgb_pixels(frames):
    """
    Convert ROI frames into:

        N x 3 x P

    where:

        N = number of frames
        3 = RGB channels
        P = spatial pixels
    """

    processed = []

    for frame in frames:

        if frame is None:
            continue

        frame = np.asarray(frame)

        if frame.ndim != 3:
            continue

        if frame.shape[2] != 3:
            continue

        frame = frame.astype(
            np.float64
        )

        # H x W x 3
        height, width, channels = frame.shape

        # P x 3
        pixels = frame.reshape(
            height * width,
            3
        )

        # 3 x P
        rgb = pixels.T

        processed.append(rgb)

    if len(processed) < 10:
        raise ValueError(
            "Not enough valid frames for PBV"
        )

    data = np.asarray(
        processed,
        dtype=np.float64
    )

    # N x 3 x P
    if data.ndim != 3 or data.shape[1] != 3:
        raise ValueError(
            f"PBV expected (N, 3, P), got {data.shape}"
        )

    return data


def PBV(frames):
    """
    Blood Volume Pulse (PBV) algorithm.

    Input:
        frames: N x H x W x 3

    Output:
        1-D BVP signal of length N.
    """

    data = _extract_rgb_pixels(frames)

    N, channels, P = data.shape

    if channels != 3:
        raise ValueError(
            "PBV requires exactly 3 RGB channels"
        )

    if P < 2:
        raise ValueError(
            "PBV requires at least two spatial pixels"
        )

    # ---------------------------------------------------------
    # Spatial mean for every frame/channel
    # ---------------------------------------------------------

    mean_rgb = np.mean(
        data,
        axis=2
    )

    mean_rgb = np.where(
        np.abs(mean_rgb) < 1e-12,
        1e-12,
        mean_rgb
    )

    # ---------------------------------------------------------
    # Normalize every pixel by its frame/channel mean
    #
    # Result:
    # N x 3 x P
    # ---------------------------------------------------------

    normalized = (
        data /
        mean_rgb[:, :, None]
    )

    # ---------------------------------------------------------
    # PBV signature
    # ---------------------------------------------------------

    std_rgb = np.std(
        normalized,
        axis=2
    )

    variance_rgb = np.var(
        normalized,
        axis=2
    )

    denominator = np.sqrt(
        np.sum(
            variance_rgb,
            axis=1
        )
    )

    denominator = np.where(
        denominator < 1e-12,
        1e-12,
        denominator
    )

    # N x 3
    pbv = (
        std_rgb /
        denominator[:, None]
    )

    # ---------------------------------------------------------
    # C:
    #
    # N x 3 x P
    #
    # Ct:
    #
    # N x P x 3
    # ---------------------------------------------------------

    C = normalized

    Ct = np.transpose(
        C,
        (0, 2, 1)
    )

    # ---------------------------------------------------------
    # Q:
    #
    # N x 3 x 3
    # ---------------------------------------------------------

    Q = np.matmul(
        C,
        Ct
    )

    # ---------------------------------------------------------
    # Solve:
    #
    # Q W = PBV
    #
    # RHS must be:
    # N x 3 x 1
    # ---------------------------------------------------------

    rhs = pbv[:, :, None]

    # Add small regularization to avoid singular matrices
    regularization = (
        np.eye(3)[None, :, :] *
        1e-8
    )

    Q_regularized = (
        Q +
        regularization
    )

    try:

        W = np.linalg.solve(
            Q_regularized,
            rhs
        )

    except np.linalg.LinAlgError:

        # Robust fallback for singular matrices
        W = np.matmul(
            np.linalg.pinv(
                Q_regularized
            ),
            rhs
        )

    # ---------------------------------------------------------
    # Numerator
    #
    # Ct: N x P x 3
    # W : N x 3 x 1
    #
    # Result:
    # N x P x 1
    # ---------------------------------------------------------

    numerator = np.matmul(
        Ct,
        W
    )

    # ---------------------------------------------------------
    # Denominator
    # ---------------------------------------------------------

    pbv_row = (
        pbv[:, None, :]
    )

    denominator_bvp = np.matmul(
        pbv_row,
        W
    )

    denominator_bvp = np.where(
        np.abs(denominator_bvp) < 1e-12,
        1e-12,
        denominator_bvp
    )

    # ---------------------------------------------------------
    # BVP
    # ---------------------------------------------------------

    bvp_pixels = (
        numerator /
        denominator_bvp
    )

    # Average all spatial pixels
    bvp = np.mean(
        bvp_pixels[:, :, 0],
        axis=1
    )

    # Remove mean
    bvp = (
        bvp -
        np.mean(bvp)
    )

    return np.asarray(
        bvp,
        dtype=np.float64
    ).flatten()


def PBV2(frames):
    """
    Compatibility wrapper.

    PBV2 uses the same corrected PBV implementation.
    """

    return PBV(frames)
