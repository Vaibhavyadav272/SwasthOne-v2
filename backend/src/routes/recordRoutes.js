const express = require("express");
const { getPatientRecord } = require("../controllers/recordController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/:patientId", protect, getPatientRecord);

module.exports = router;
