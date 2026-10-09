const express = require("express");

const {
  createReferral,
  getReferralById,
  getReferralsByPatient,
  updateReferralStatus,
} = require("../controllers/referralController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReferral);
router.get("/patient/:patientId", protect, getReferralsByPatient);
router.patch("/:id/status", protect, updateReferralStatus);
router.get("/:id", protect, getReferralById);

module.exports = router;
