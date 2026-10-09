const Screening = require("../models/Screening");
const Triage = require("../models/Triage");

const createTriage = async (req, res) => {
  try {
    const { patientId, screeningId, historyScore } = req.body;

    if (!patientId || !screeningId) {
      return res.status(400).json({
        success: false,
        message: "patientId and screeningId are required",
      });
    }

    const screening = await Screening.findOne({
      _id: screeningId,
      patient: patientId,
      screenedBy: req.user.userId,
    }).populate("patient", "name age gender");

    if (!screening) {
      return res.status(404).json({ success: false, message: "Screening not found" });
    }

    const systolic = screening.bloodPressure?.systolic;
    const diastolic = screening.bloodPressure?.diastolic;
    const trustScore = screening.rppg?.trustScore;
    const rppgIsUsable =
      typeof trustScore !== "number" || trustScore >= 70;
    const heartRate =
      screening.heartRate ??
      (rppgIsUsable ? screening.rppg?.heartRate : undefined);
    const temperature = screening.temperature;
    const spo2 = screening.oxygenSaturation;
    const symptoms = (screening.symptoms || []).map((s) => s.toLowerCase());

    let category = "routine";
    let measurementAction = "none";
    const reasons = [];
    const setConsult = () => { if (category === "routine") category = "consult"; };
    const setUrgent = () => { category = "urgent"; };

    const redSymptoms = ["chest pain", "severe breathlessness", "difficulty breathing", "unconscious", "seizure", "heavy bleeding"];
    const matchedRed = symptoms.filter((s) => redSymptoms.includes(s));
    if (matchedRed.length) {
      setUrgent();
      reasons.push(`Red-flag symptom: ${matchedRed[0]}`);
    }

    if (systolic != null && diastolic != null) {
      if (systolic >= 180 || diastolic >= 120 || systolic < 80 || diastolic < 50) {
        setUrgent(); reasons.push("Abnormal blood pressure");
      } else if (systolic >= 140 || diastolic >= 90) {
        setConsult(); reasons.push("Elevated blood pressure");
      }
    }

    if (heartRate != null) {
      if (heartRate < 40 || heartRate > 150) {
        setUrgent(); reasons.push("Abnormal heart rate");
      } else if (heartRate < 50 || heartRate > 120) {
        setConsult(); reasons.push("Elevated or low heart rate");
      }
    }

    if (temperature != null) {
      if (temperature >= 40 || temperature < 35) {
        setUrgent(); reasons.push("Abnormal temperature");
      } else if (temperature >= 38 || temperature < 36) {
        setConsult(); reasons.push("Abnormal temperature");
      }
    }

    if (spo2 != null) {
      if (spo2 < 90) {
        setUrgent(); reasons.push("Low oxygen saturation");
      } else if (spo2 < 94) {
        setConsult(); reasons.push("Reduced oxygen saturation");
      }
    }

    if (trustScore != null && trustScore < 70) {
      measurementAction = "retake-rppg";
      reasons.push("Low rPPG confidence; retake measurement before relying on the camera reading");
    }

    const effectiveHistoryScore =
      historyScore === undefined ? patient.historyScore : historyScore;

    if (Number(effectiveHistoryScore) >= 80) {
      setUrgent(); reasons.push("High history risk score");
    } else if (Number(effectiveHistoryScore) >= 50) {
      setConsult(); reasons.push("Elevated history risk score");
    }

    const rationale = reasons.length ? reasons.join("; ") : "No urgent findings detected.";

    const triage = await Triage.create({
      patient: patientId,
      screening: screeningId,
      category,
      rationale,
      measurementAction,
      createdBy: req.user.userId,
    });

    screening.triageLevel = category;
    await screening.save();

    return res.status(200).json({
      success: true,
      category,
      message: rationale,
      measurementAction,
      triageId: triage._id,
    });
  } catch (error) {
    console.error("Triage error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while processing triage" });
  }
};

module.exports = { createTriage };
