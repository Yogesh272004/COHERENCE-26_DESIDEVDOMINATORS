const express = require("express");
const router = express.Router();
const {
  createTrial,
  getTrials,
  getTrialById,
  getMatchingPatientsForTrial
} = require("../controllers/trialController");

router.post("/", createTrial);
router.get("/", getTrials);
router.get("/:id", getTrialById);
router.get("/:id/matches", getMatchingPatientsForTrial);

module.exports = router;