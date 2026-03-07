const Patient = require("../models/Patient");

const generatePatientCode = () => {
  return "PAT-" + Math.floor(1000 + Math.random() * 9000);
};

const addPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      patientCode: generatePatientCode()
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error("ADD PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error("GET PATIENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("GET PATIENT BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addPatient, getPatients, getPatientById };