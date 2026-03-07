const Patient = require("../models/Patient");
const parsePatientReport = require("../utils/parsePatientReport");
const Trial = require("../models/Trial");
const matchTrialWithPatient = require("../utils/trialMatcher");

const generatePatientCode = () => {
  return "PAT-" + Math.floor(1000 + Math.random() * 9000);
};

const uploadPatientReport = async (req, res) => {
  try {
    const { reportText } = req.body;

    if (!reportText || !reportText.trim()) {
      return res.status(400).json({ message: "Report text is required" });
    }

    const parsedData = parsePatientReport(reportText);

    const patient = await Patient.create({
      ...parsedData,
      patientCode: generatePatientCode()
    });

    const trials = await Trial.find();
    const eligibleMatches = [];

    for (const trial of trials) {
      const result = matchTrialWithPatient(patient, trial);

      if (result.status === "Eligible") {
        eligibleMatches.push({
          trialId: trial._id,
          trialTitle: trial.title,
          score: result.score,
          explanation: result.explanation
        });
      }
    }

    res.status(201).json({
      message: "Patient report parsed and saved successfully",
      patient,
      eligibleMatches
    });
  } catch (error) {
    console.error("UPLOAD PATIENT REPORT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadPatientReport };