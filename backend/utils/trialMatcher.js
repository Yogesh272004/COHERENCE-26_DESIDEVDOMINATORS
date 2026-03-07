const normalize = (value) => String(value || "").trim().toLowerCase();

const matchTrialWithPatient = (patient, trial) => {
  let score = 0;
  let explanation = [];
  let failed = false;

  // Disease check
  if (normalize(patient.disease) === normalize(trial.disease)) {
    score += 30;
    explanation.push("Patient disease matches trial condition");
  } else {
    failed = true;
    explanation.push("Disease does not match trial requirement");
  }

  // Age check
  if (patient.age >= trial.minAge && patient.age <= trial.maxAge) {
    score += 20;
    explanation.push("Patient age is within allowed range");
  } else {
    failed = true;
    explanation.push("Patient age is outside allowed range");
  }

  // Location check
  if (normalize(patient.location) === normalize(trial.requiredLocation)) {
    score += 20;
    explanation.push("Patient location matches trial location");
  } else {
    explanation.push("Patient location is different from trial location");
  }

  // HbA1c check
  if (trial.hbA1cMax !== null && patient.hbA1c !== null) {
    if (patient.hbA1c <= trial.hbA1cMax) {
      score += 10;
      explanation.push("HbA1c level acceptable");
    } else {
      failed = true;
      explanation.push("HbA1c level too high for trial");
    }
  }

  // Smoking check
  if (!trial.smokerAllowed && patient.smoking) {
    failed = true;
    explanation.push("Trial does not allow smokers");
  } else {
    score += 10;
    explanation.push("Smoking status allowed");
  }

  // Final decision
  let status = "Eligible";

  if (failed) {
    status = "Not Eligible";
  } else if (score < 70) {
    status = "Maybe Eligible";
  }

  return {
    status,
    score,
    explanation
  };
};

module.exports = matchTrialWithPatient;