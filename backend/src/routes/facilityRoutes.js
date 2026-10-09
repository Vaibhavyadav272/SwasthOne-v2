const express = require("express");

const { getFacilities } = require("../controllers/facilityController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getFacilities);

module.exports = router;
