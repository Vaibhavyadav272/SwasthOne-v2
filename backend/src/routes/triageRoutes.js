const express = require("express");

const { createTriage } = require("../controllers/triageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTriage);

module.exports = router;
