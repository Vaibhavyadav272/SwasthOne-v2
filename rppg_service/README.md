# SwasthOne V2 rPPG service

This folder contains the V2 analysis engine, the Flask adapter used by the
browser, and the method modules imported at runtime.

## Engine integrity

`Swasthone_rppg_FINAL_V2.py` was not changed by the performance patch in this
archive. Its SHA-256 is recorded in `V2_SHA256.txt`; verify it before deployment
if you maintain a separate approved baseline.

The browser does not reimplement the engine's ROI selection, candidate
extraction, temporal consensus, or TrustScore thresholds.

## Runtime flow

Browser camera -> 30-second MediaRecorder capture -> this service -> exact V2
engine -> JSON result -> SwasthOne frontend -> existing `/api/rppg` persistence.

## Start

From this folder, using the **same `rppg-toolbox` Python environment used to validate V2**:

```powershell
pip install -r requirements.txt
python service.py
```

The service listens on `http://localhost:8000`.

Health check:

```text
http://localhost:8000/health
```

The frontend can override the service URL with:

```text
VITE_RPPG_API_URL=http://localhost:8000
```

## Runtime performance and dependency notes

The shared smoothness-priors detrending helper uses a sparse linear solve rather
than constructing a dense matrix inverse. This preserves the same mathematical
equation while reducing the cost of repeated detrending on 15-second windows.
Face detection also downsizes each frame before grayscale conversion.

FastICA is a supporting method. If it does not converge, that method is rejected
for that window instead of allowing a non-converged component into consensus.
The service logs per-window timing so slow processing can be localized.

The original 311 MB rPPG-Toolbox is **not copied wholesale** into SwasthOne.
Only these runtime files are included:

- POS_WANG.py
- CHROME_DEHAAN.py
- ICA_POH.py
- GREEN.py
- LGI.py
- PBV.py
- OMIT.py
- unsupervised_methods/utils.py

No toolbox trainer, dataset, neural model, CUDA package, or unrelated code is
required by this V2 service.

`requirements.txt` lists the service and numerical-processing dependencies.
For reproducible deployments, pin all unpinned numerical packages to the versions
validated in your own deployment environment before a production release.

## Production

Do not use `python service.py` in production. Use gunicorn (see `Procfile`):

```bash
gunicorn -w 1 --timeout 150 -b 0.0.0.0:${PORT:-8000} service:app
```

Set `RPPG_ALLOWED_ORIGINS` to your frontend origin(s); without it CORS allows every origin.
