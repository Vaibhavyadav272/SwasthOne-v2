"""Regression tests for the optimized smoothness-priors detrending helper."""
import sys
import unittest
from pathlib import Path

import numpy as np

# The deployed service adds rppg_service/ to PYTHONPATH so toolbox imports work.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "rppg_service"))
from unsupervised_methods import utils


class DetrendTests(unittest.TestCase):
    def test_output_is_finite_and_same_shape(self):
        rng = np.random.default_rng(42)
        x = rng.normal(size=450)
        y = utils.detrend(x, 100)
        self.assertEqual(y.shape, x.shape)
        self.assertTrue(np.isfinite(y).all())


    def test_matches_original_dense_equation(self):
        from scipy import sparse

        rng = np.random.default_rng(7)
        x = rng.normal(size=24)
        n = len(x)
        identity = np.identity(n)
        ones = np.ones(n)
        minus_twos = -2.0 * np.ones(n)
        diagonals = np.array([ones, minus_twos, ones])
        offsets = np.array([0, 1, 2])
        d = sparse.spdiags(diagonals, offsets, (n - 2, n)).toarray()
        reference = (identity - np.linalg.inv(
            identity + (10.0 ** 2) * (d.T @ d)
        )) @ x

        actual = utils.detrend(x, 10.0)
        np.testing.assert_allclose(actual, reference, rtol=1e-9, atol=1e-9)

    def test_short_input_is_handled(self):
        np.testing.assert_allclose(utils.detrend(np.array([2.0, 4.0]), 100), [-1.0, 1.0])

    def test_non_finite_input_is_rejected(self):
        with self.assertRaises(ValueError):
            utils.detrend(np.array([1.0, np.nan, 3.0]), 100)


if __name__ == "__main__":
    unittest.main()
