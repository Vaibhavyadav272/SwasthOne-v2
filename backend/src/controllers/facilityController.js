const Facility = require("../models/Facility");

const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ isActive: true }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: facilities.length,
      facilities,
    });
  } catch (error) {
    console.error("Get facilities error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching facilities",
    });
  }
};

module.exports = {
  getFacilities,
};
