const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    disease: {
      type: String,
      required: true
    },
    minAge: {
      type: Number,
      required: true
    },
    maxAge: {
      type: Number,
      required: true
    },
    requiredLocation: {
      type: String,
      required: true
    },
    hbA1cMax: {
      type: Number,
      default: null
    },
    smokerAllowed: {
      type: Boolean,
      default: false
    },
    exclusionConditions: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trial", trialSchema);