const express = require("express");
const router = express.Router();
const {
  addPatient,
  getPatients,
  getPatientById
} = require("../controllers/patientController");

router.post("/", addPatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);

module.exports = router;