const Trial = require("../models/Trial");
const Patient = require("../models/Patient");
const matchTrialWithPatient = require("../utils/trialMatcher");

const createTrial = async (req, res) => {
  try {
    const trial = await Trial.create(req.body);
    res.status(201).json(trial);
  } catch (error) {
    console.error("CREATE TRIAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getTrials = async (req, res) => {
  try {
    const trials = await Trial.find().sort({ createdAt: -1 });
    res.json(trials);
  } catch (error) {
    console.error("GET TRIALS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getTrialById = async (req, res) => {
  try {
    const trial = await Trial.findById(req.params.id);

    if (!trial) {
      return res.status(404).json({ message: "Trial not found" });
    }

    res.json(trial);
  } catch (error) {
    console.error("GET TRIAL BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMatchingPatientsForTrial = async (req, res) => {
  try {
    const trial = await Trial.findById(req.params.id);

    if (!trial) {
      return res.status(404).json({ message: "Trial not found" });
    }

    const patients = await Patient.find();
    const results = [];

    for (const patient of patients) {
      const matchResult = matchTrialWithPatient(patient, trial);

      // only include eligible patients
      if (matchResult.status === "Eligible") {
        results.push({
          patient,
          status: matchResult.status,
          score: matchResult.score,
          explanation: matchResult.explanation
        });
      }
    }

    results.sort((a, b) => b.score - a.score);

    res.json(results);
  } catch (error) {
    console.error("MATCHING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrial,
  getTrials,
  getTrialById,
  getMatchingPatientsForTrial
};