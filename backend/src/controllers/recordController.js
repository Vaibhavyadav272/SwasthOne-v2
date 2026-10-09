const Patient = require("../models/Patient");
const Screening = require("../models/Screening");
const Triage = require("../models/Triage");
const Referral = require("../models/Referral");
const FollowUp = require("../models/FollowUp");

const getPatientRecord = async (req, res) => {
  try {
    const canViewAll = req.user.role === "doctor" || req.user.role === "admin";
    const patientFilter = canViewAll
      ? { _id: req.params.patientId }
      : { _id: req.params.patientId, createdBy: req.user.userId };

    const patient = await Patient.findOne(patientFilter);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    const screeningFilter = canViewAll
      ? { patient: patient._id }
      : { patient: patient._id, screenedBy: req.user.userId };
    const triageFilter = canViewAll
      ? { patient: patient._id }
      : { patient: patient._id, createdBy: req.user.userId };
    const referralFilter = canViewAll
      ? { patient: patient._id }
      : { patient: patient._id, referredBy: req.user.userId };
    const followUpFilter = canViewAll
      ? { patient: patient._id }
      : { patient: patient._id, createdBy: req.user.userId };

    const [screenings, triages, referrals, followUps] = await Promise.all([
      Screening.find(screeningFilter).sort({ createdAt: -1 }),
      Triage.find(triageFilter).sort({ createdAt: -1 }),
      Referral.find(referralFilter).populate("triage", "category rationale").sort({ createdAt: -1 }),
      FollowUp.find(followUpFilter).sort({ scheduledDate: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      patient,
      screenings,
      triages,
      referrals,
      followUps,
    });
  } catch (error) {
    console.error("Get patient record error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while fetching patient record" });
  }
};

module.exports = { getPatientRecord };
