const express = require("express");

const {
  createScreening,
  getScreenings,
  getScreeningById,
} = require("../controllers/screeningController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createScreening);
router.get("/", protect, getScreenings);
router.get("/:id", protect, getScreeningById);

module.exports = router;
