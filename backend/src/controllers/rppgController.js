const Screening = require("../models/Screening");

const saveRppgResult = async (req, res) => {
  try {
    const {
      screeningId,
      hr,
      heartRate,
      motion,
      motionStability,
      trustScore,
      algorithmAgreement,
      signalQuality,
      lighting,
      confidence,
      methods,
      temporalStability,
      regionAgreement,
      accept,
      windowHrs,
      globalClusters,
    } = req.body;

    const resolvedHr = hr ?? heartRate;
    const resolvedMotion = motionStability ?? motion;

    if (
      !screeningId ||
      resolvedHr === undefined ||
      resolvedMotion === undefined ||
      trustScore === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "screeningId, hr, motion and trustScore are required",
      });
    }

    if (trustScore < 0 || trustScore > 100) {
      return res.status(400).json({
        success: false,
        message: "trustScore must be between 0 and 100",
      });
    }

    const screening = await Screening.findOne({
      _id: screeningId,
      screenedBy: req.user.userId,
    });

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: "Screening not found",
      });
    }

    if (resolvedHr < 30 || resolvedHr > 220) {
      return res.status(400).json({ success: false, message: 'heart rate must be between 30 and 220' });
    }

    screening.rppg = {
      heartRate: resolvedHr,
      motion: resolvedMotion,
      trustScore,
      algorithmAgreement,
      signalQuality,
      lighting,
      confidence,
      methods,
      temporalStability,
      regionAgreement,
      accept,
      windowHrs,
      globalClusters,
    };

    await screening.save();

    res.status(200).json({
      success: true,
      message: "rPPG result saved successfully",
      rppg: screening.rppg,
      screeningId: screening._id,
    });
  } catch (error) {
    console.error("Save rPPG error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while saving rPPG result",
    });
  }
};

module.exports = {
  saveRppgResult,
};
