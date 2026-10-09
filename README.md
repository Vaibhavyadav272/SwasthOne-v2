# SwasthOne

### A Rural Healthcare Access, Screening & Continuity Platform

SwasthOne is an integrated rural healthcare platform connecting patients, ASHA/ANM frontline workers, doctors, and healthcare facilities across the complete care journey.

> **ACCESS → SCREEN → TRIAGE → CONSULT → REFER → FOLLOW-UP → CONTINUITY**

---

## 🚀 Key Features

- 👤 Patient & ASHA-assisted registration
- 🩺 Symptom and medical-history capture
- ❤️ Smartphone-based rPPG screening
- 🛡️ TrustScore for measurement confidence
- 🧠 Digital triage — Routine / Consult / Urgent
- 🔄 Referral creation and tracking
- 📋 Longitudinal patient records
- 👨‍⚕️ Doctor workflow
- 🏥 Facility information
- 📱 Responsive PWA
- 🌐 Multilingual-ready interface

---

## ❤️ rPPG + TrustScore

SwasthOne uses a short smartphone camera recording to estimate heart rate through facial rPPG signals.

### Pipeline

```text
Browser Camera
      ↓
30-sec Video
      ↓
Face Detection
      ↓
 Facial ROIs
      ↓
 rPPG Methods
      ↓
Temporal & Cross-Method Consensus
      ↓
TrustScore
      ↓
ACCEPT / RETAKE
```

### rPPG Methods

- POS
- CHROME
- GREEN
- ICA
- LGI
- PBV
- OMIT

TrustScore evaluates signal quality, temporal stability, algorithm agreement, region agreement, motion, and lighting.

> **Note:** rPPG and TrustScore are screening/support features and are not a substitute for clinically validated medical equipment or professional medical advice.

---

## 🔄 Core Workflow

```text
Registration
     ↓
Symptoms / History
     ↓
rPPG Screening
     ↓
TrustScore
     ↓
Digital Triage
     ↓
Doctor Review
     ↓
Referral
     ↓
Follow-up
     ↓
Longitudinal Record
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| PWA | Vite PWA |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| rPPG Service | Python + Flask |
| Computer Vision | OpenCV |
| Signal Processing | NumPy + SciPy |

---

## 🏛️ Architecture

```text
             React / TypeScript PWA
                       │
              ┌────────┴────────┐
              ↓                 ↓
       Node.js / Express    Python / Flask
          Backend API        rPPG V2 Service
              │
              ↓
          MongoDB
```

The rPPG engine runs as a separate Python service so the tested V2 pipeline remains independent from the Node.js backend.

---


## ⚙️ Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

### rPPG Service

```bash
cd rppg_service
pip install -r requirements.txt
python service.py
```

---

## ☁️ Deployment

The application is designed for separate deployment of:

- React frontend
- Node.js backend
- Python rPPG service
- MongoDB Atlas
  
---

SwasthOne is a hackathon prototype for healthcare screening and workflow support. rPPG measurements may be affected by motion, lighting, camera quality, and other factors. Clinical decisions should be made by qualified healthcare professionals.
