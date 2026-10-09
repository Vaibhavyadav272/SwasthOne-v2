const Screening = require("../models/Screening");
const Patient = require("../models/Patient");

const createScreening = async (req, res) => {
  try {
    const {
      patientId,
      bloodPressure,
      heartRate,
      temperature,
      oxygenSaturation,
      duration,
      severity,
      hasManualVitals,
      symptoms,
      notes,
      rppg,
      triageLevel,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
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

    const screening = await Screening.create({
      patient: patient._id,
      bloodPressure,
      heartRate,
      temperature,
      oxygenSaturation,
      duration,
      severity,
      hasManualVitals,
      symptoms,
      notes,
      rppg,
      triageLevel,
      screenedBy: req.user.userId,
    });

    const populatedScreening = await Screening.findById(screening._id)
      .populate("patient", "name age gender")
      .populate("screenedBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Screening created successfully",
      screening: populatedScreening,
    });
  } catch (error) {
    console.error("Create screening error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating screening",
    });
  }
};

const getScreenings = async (req, res) => {
  try {
    const screenings = await Screening.find({
      screenedBy: req.user.userId,
    })
      .populate("patient", "name age gender")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: screenings.length,
      screenings,
    });
  } catch (error) {
    console.error("Get screenings error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching screenings",
    });
  }
};

const getScreeningById = async (req, res) => {
  try {
    const screening = await Screening.findOne({
      _id: req.params.id,
      screenedBy: req.user.userId,
    })
      .populate("patient", "name age gender phone village district state")
      .populate("screenedBy", "name email role");

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: "Screening not found",
      });
    }

    res.status(200).json({
      success: true,
      screening,
    });
  } catch (error) {
    console.error("Get screening error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching screening",
    });
  }
};

module.exports = {
  createScreening,
  getScreenings,
  getScreeningById,
};
