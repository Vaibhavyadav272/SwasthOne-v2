const express = require("express");
const { createFollowUp, getFollowUpById, getFollowUpsByPatient, updateFollowUpStatus } = require("../controllers/followUpController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", protect, createFollowUp);
router.patch("/:id/status", protect, updateFollowUpStatus);
router.get("/id/:id", protect, getFollowUpById);
router.get("/:patientId", protect, getFollowUpsByPatient);

module.exports = router;
