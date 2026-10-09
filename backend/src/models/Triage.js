const mongoose = require("mongoose");

const triageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    screening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screening",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["routine", "consult", "urgent"],
      required: true,
    },
    rationale: {
      type: String,
      trim: true,
    },
    measurementAction: {
      type: String,
      enum: ["none", "retake-rppg", "manual-verify"],
      default: "none",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Triage", triageSchema);
