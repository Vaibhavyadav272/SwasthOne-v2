import math

import cv2
import numpy as np
from scipy import io as scio
from scipy import linalg
from scipy import signal
from scipy import sparse
from skimage.util import img_as_float
from sklearn.metrics import mean_squared_error


def detrend(input_signal, lambda_value):
    """
    Smoothness-priors detrending using a sparse linear solve.

    This is algebraically equivalent to:
        (I - inv(I + lambda_value**2 * D.T @ D)) @ input_signal
    but avoids constructing a dense N x N inverse. It preserves the original
    detrending equation while reducing the cost for long rPPG windows.
    """
    x = np.asarray(input_signal, dtype=np.float64)
    if x.ndim != 1:
        raise ValueError(f"detrend expects a 1-D signal, got shape {x.shape}")
    signal_length = x.shape[0]
    if signal_length < 3:
        return x - np.mean(x) if signal_length else x.copy()
    if not np.all(np.isfinite(x)):
        raise ValueError("detrend input contains NaN or infinite values")

    ones = np.ones(signal_length, dtype=np.float64)
    minus_twos = -2.0 * np.ones(signal_length, dtype=np.float64)
    diags_data = np.array([ones, minus_twos, ones])
    diags_index = np.array([0, 1, 2])

    # Keep the original second-difference matrix construction, but retain it
    # as sparse instead of converting it to a dense N x N operation.
    D = sparse.spdiags(
        diags_data,
        diags_index,
        (signal_length - 2, signal_length),
        format="csc",
    )
    A = sparse.eye(signal_length, format="csc") + (
        float(lambda_value) ** 2
    ) * (D.T @ D)

    # Solve A z = x; x - z equals (I - A^-1) x without forming A^-1.
    smooth_component = sparse.linalg.spsolve(A, x)
    return np.asarray(x - smooth_component, dtype=np.float64)


def process_video(frames):
    RGB = []
    for frame in frames:
        summation = np.sum(np.sum(frame, axis=0), axis=0)
        RGB.append(summation / (frame.shape[0] * frame.shape[1]))
    RGB = np.asarray(RGB)
    RGB = RGB.transpose(1, 0).reshape(1, 3, -1)
    return np.asarray(RGB)
