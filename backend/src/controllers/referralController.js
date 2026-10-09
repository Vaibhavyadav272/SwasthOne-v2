const Referral = require("../models/Referral");
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const Triage = require("../models/Triage");

const createReferral = async (req, res) => {
  try {
    const { patientId, triageId, triageCategory, facilityId, preferredDate, reason } =
      req.body;

    if (
      !patientId ||
      !triageId ||
      !facilityId ||
      !preferredDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "patientId, triageId, facilityId, preferredDate and reason are required",
      });
    }

    const patient = await Patient.findOne({
      _id: patientId,
      createdBy: req.user.userId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    const triage = await Triage.findOne({
      _id: triageId,
      patient: patientId,
      createdBy: req.user.userId,
    });

    if (!triage) {
      return res.status(404).json({ success: false, message: "Triage not found" });
    }

    const facility = await Facility.findOne({
        facilityId,
        isActive: true,
    });

    if (!facility) {
        return res.status(404).json({
        success: false,
        message: "Facility not found or inactive",
    });
    }
    const referral = await Referral.create({
      patient: patient._id,
      triage: triage._id,
      triageCategory: triage.category,
      facilityId,
      preferredDate,
      reason,
      referredBy: req.user.userId,
    });

    const populatedReferral = await Referral.findById(referral._id)
      .populate("patient", "name age gender phone village district state")
      .populate("triage", "category rationale createdAt")
      .populate("referredBy", "name email role");

    return res.status(201).json({
      success: true,
      message: "Referral created successfully",
      referral: populatedReferral,
    });
  } catch (error) {
    console.error("Create referral error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating referral",
    });
  }
};

const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findOne({
      _id: req.params.id,
      referredBy: req.user.userId,
    })
      .populate("patient", "name age gender phone village district state")
      .populate("triage", "category rationale createdAt")
      .populate("referredBy", "name email role");

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    return res.status(200).json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error("Get referral error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching referral",
    });
  }
};

const getReferralsByPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      createdBy: req.user.userId,
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const referrals = await Referral.find({
      patient: patient._id,
      referredBy: req.user.userId,
    })
      .populate("triage", "category rationale createdAt")
      .populate("patient", "name age gender phone village district state")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error("Get patient referrals error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching referrals",
    });
  }
};

const updateReferralStatus = async (req, res) => {
  try {
    const allowed = ["sent", "accepted", "completed", "cancelled"];
    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${allowed.join(", ")}`,
      });
    }

    const referral = await Referral.findOneAndUpdate(
      { _id: req.params.id, referredBy: req.user.userId },
      { status },
      { new: true, runValidators: true },
    )
      .populate("patient", "name age gender phone village district state")
      .populate("triage", "category rationale createdAt")
      .populate("referredBy", "name email role");

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral status updated successfully",
      referral,
    });
  } catch (error) {
    console.error("Update referral status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating referral",
    });
  }
};

module.exports = {
  createReferral,
  getReferralById,
  getReferralsByPatient,
  updateReferralStatus,
};
