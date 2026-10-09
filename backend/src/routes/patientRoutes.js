const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPatient);
router.get("/", protect, getPatients);
router.get("/:id", protect, getPatientById);

module.exports = router;
