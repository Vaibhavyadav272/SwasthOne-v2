const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    triage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Triage",
      required: true,
    },

    triageCategory: {
      type: String,
      enum: ["routine", "consult", "urgent"],
      required: true,
    },

    facilityId: {
      type: String,
      required: true,
      trim: true,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["sent", "accepted", "completed", "cancelled"],
      default: "sent",
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Referral", referralSchema);
