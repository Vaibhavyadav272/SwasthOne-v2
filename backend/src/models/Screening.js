const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    bloodPressure: {
      systolic: {
        type: Number,
        min: 50,
        max: 300,
      },
      diastolic: {
        type: Number,
        min: 30,
        max: 200,
      },
    },

    duration: {
      type: String,
      trim: true,
    },

    severity: {
      type: Number,
      min: 0,
      max: 10,
    },

    hasManualVitals: {
      type: Boolean,
      default: false,
    },

    oxygenSaturation: {
      type: Number,
      min: 50,
      max: 100,
    },

    heartRate: {
      type: Number,
      min: 30,
      max: 220,
    },

    temperature: {
      type: Number,
      min: 25,
      max: 45,
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    notes: {
      type: String,
      trim: true,
    },

    rppg: {
      heartRate: {
        type: Number,
        min: 30,
        max: 220,
      },
      motion: {
        type: Number,
        min: 0,
      },
      trustScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      algorithmAgreement: { type: Number, min: 0, max: 100 },
      signalQuality: { type: Number, min: 0, max: 100 },
      lighting: { type: Number, min: 0, max: 100 },
      temporalStability: { type: Number, min: 0, max: 100 },
      regionAgreement: { type: Number, min: 0, max: 100 },
      accept: { type: Boolean },
      windowHrs: [{ type: Number }],
      globalClusters: [{
        hr: { type: Number },
        score: { type: Number },
        windows: { type: Number },
      }],
      confidence: { type: String, enum: ['high', 'medium', 'low'] },
      methods: [{
        method: { type: String },
        heartRate: { type: Number, min: 30, max: 220 },
        quality: { type: Number, min: 0, max: 100 },
      }],
    },

    triageLevel: {
      type: String,
      enum: ["routine", "consult", "urgent"],
    },

    screenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Screening", screeningSchema);
