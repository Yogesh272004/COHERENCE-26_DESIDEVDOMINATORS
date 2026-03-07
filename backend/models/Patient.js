const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientCode: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    disease: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other"
    },
    location: {
      type: String,
      required: true
    },
    hbA1c: {
      type: Number,
      default: null
    },
    smoking: {
      type: Boolean,
      default: false
    },
    medicalHistory: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);