const express = require("express");
const router = express.Router();
const {
  createTrial,
  getTrials,
  getTrialById,
  getMatchingPatientsForTrial,
  deleteTrial
} = require("../controllers/trialController");

router.post("/", createTrial);
router.get("/", getTrials);
router.get("/:id", getTrialById);
router.get("/:id/matches", getMatchingPatientsForTrial);
router.delete("/:id", deleteTrial);

module.exports = router;