const express = require("express");

const { saveRppgResult } = require("../controllers/rppgController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, saveRppgResult);

module.exports = router;
