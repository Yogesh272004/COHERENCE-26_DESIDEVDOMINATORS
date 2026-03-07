function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function matchTrialWithPatient(patient, trial) {
  let score = 0;
  const explanation = [];
  const hardFails = [];

  const patientDisease = normalize(patient.disease);
  const trialDisease = normalize(trial.disease);

  const patientLocation = normalize(patient.location);
  const trialLocation = normalize(trial.requiredLocation);

  const patientHistory = Array.isArray(patient.medicalHistory)
    ? patient.medicalHistory.map((item) => normalize(item))
    : [];

  const exclusionConditions = Array.isArray(trial.exclusionConditions)
    ? trial.exclusionConditions.map((item) => normalize(item))
    : [];

  // 1. Disease match (main criteria)
  if (patientDisease && trialDisease && patientDisease === trialDisease) {
    score += 40;
    explanation.push("Patient disease matches trial condition");
  } else {
    hardFails.push("Disease does not match");
  }

  // 2. Age match
  if (
    typeof patient.age === "number" &&
    typeof trial.minAge === "number" &&
    typeof trial.maxAge === "number"
  ) {
    if (patient.age >= trial.minAge && patient.age <= trial.maxAge) {
      score += 25;
      explanation.push("Patient age is within allowed range");
    } else {
      hardFails.push("Patient age is outside allowed range");
    }
  }

  // 3. Location match (soft check)
  if (trialLocation) {
    if (patientLocation && patientLocation === trialLocation) {
      score += 15;
      explanation.push("Patient location matches trial location");
    } else {
      explanation.push("Patient location does not match exactly");
    }
  }

  // 4. HbA1c check (soft check if patient value missing)
  if (trial.hbA1cMax !== null && trial.hbA1cMax !== undefined) {
    if (patient.hbA1c === null || patient.hbA1c === undefined || patient.hbA1c === "") {
      explanation.push("HbA1c not available, skipped");
    } else if (Number(patient.hbA1c) <= Number(trial.hbA1cMax)) {
      score += 10;
      explanation.push("HbA1c is within allowed range");
    } else {
      explanation.push("HbA1c is above preferred range");
    }
  }

  // 5. Smoking check
  if (typeof trial.smokerAllowed === "boolean") {
    if (trial.smokerAllowed === true) {
      score += 5;
      explanation.push("Smoking status allowed");
    } else if (patient.smoking === false) {
      score += 5;
      explanation.push("Non-smoker fits trial requirement");
    } else {
      explanation.push("Smoking status does not match preferred criteria");
    }
  }

  // 6. Exclusion conditions (hard fail)
  const matchedExclusions = exclusionConditions.filter((condition) =>
    patientHistory.includes(condition)
  );

  if (matchedExclusions.length > 0) {
    hardFails.push(`Matched exclusion conditions: ${matchedExclusions.join(", ")}`);
  }

  // Final decision
  let status = "Not Eligible";

  if (hardFails.length === 0 && score >= 60) {
    status = "Eligible";
  } else if (hardFails.length <= 1 && score >= 40) {
    status = "Maybe Eligible";
  } else {
    status = "Not Eligible";
  }

  return {
    status,
    score,
    explanation: [...explanation, ...hardFails]
  };
}

module.exports = matchTrialWithPatient;