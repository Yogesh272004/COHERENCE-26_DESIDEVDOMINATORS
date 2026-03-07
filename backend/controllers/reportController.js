const Report = require("../models/Report");
const Trial = require("../models/Trial");
const Patient = require("../models/Patient");
const User = require("../models/User");
const matchTrialWithPatient = require("../utils/trialMatcher");

const createReport = async (req, res) => {
  try {
    const { trialId, patientId, doctorId, researcherId, remarks } = req.body;

    const trial = await Trial.findById(trialId);
    const patient = await Patient.findById(patientId);
    const doctor = await User.findById(doctorId);
    const researcher = await User.findById(researcherId);

    if (!trial || !patient || !doctor || !researcher) {
      return res.status(404).json({
        message: "Trial, patient, doctor, or researcher not found"
      });
    }

    const result = matchTrialWithPatient(patient, trial);

    const report = await Report.create({
      doctor: doctor._id,
      researcher: researcher._id,
      trial: trial._id,
      patient: patient._id,
      status: result.status,
      score: result.score,
      remarks: remarks || ""
    });

    const populatedReport = await Report.findById(report._id)
      .populate("doctor", "name email role")
      .populate("researcher", "name email role")
      .populate("trial")
      .populate("patient");

    res.status(201).json(populatedReport);
  } catch (error) {
    console.error("REPORT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("doctor", "name email role")
      .populate("researcher", "name email role")
      .populate("trial")
      .populate("patient")
      .sort({ createdAt: -1 });

    const anonymizedReports = reports.map((report) => ({
      _id: report._id,
      doctor: report.doctor,
      researcher: report.researcher,
      trial: report.trial,
      patient: {
        _id: report.patient?._id,
        patientCode: report.patient?.patientCode,
        age: report.patient?.age,
        disease: report.patient?.disease,
        gender: report.patient?.gender,
        location: report.patient?.location,
        hbA1c: report.patient?.hbA1c,
        smoking: report.patient?.smoking,
        medicalHistory: report.patient?.medicalHistory
      },
      status: report.status,
      score: report.score,
      remarks: report.remarks,
      createdAt: report.createdAt
    }));

    res.json(anonymizedReports);
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getReports };