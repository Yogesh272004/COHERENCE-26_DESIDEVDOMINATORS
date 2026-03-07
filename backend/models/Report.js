const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    researcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trial",
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    status: {
      type: String,
      enum: ["Eligible", "Maybe Eligible", "Not Eligible"]
    },
    score: {
      type: Number
    },
    remarks: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);