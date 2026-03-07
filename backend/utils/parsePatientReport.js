const extractNumber = (text, regex) => {
  const match = text.match(regex);
  return match ? Number(match[1]) : null;
};

const extractText = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

const detectSmoking = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("smoker") || lower.includes("smoking: yes")) return true;
  return false;
};

const detectDisease = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("diabetes")) return "Diabetes";
  if (lower.includes("cancer")) return "Cancer";
  if (lower.includes("hypertension")) return "Hypertension";
  if (lower.includes("asthma")) return "Asthma";
  if (lower.includes("cardiac") || lower.includes("heart")) return "Heart Disease";

  return "Unknown";
};

const detectMedicalHistory = (text) => {
  const lower = text.toLowerCase();
  const history = [];

  if (lower.includes("heart disease")) history.push("heart disease");
  if (lower.includes("cancer")) history.push("cancer");
  if (lower.includes("asthma")) history.push("asthma");
  if (lower.includes("diabetes")) history.push("diabetes");
  if (lower.includes("hypertension")) history.push("hypertension");

  return [...new Set(history)];
};

const parsePatientReport = (reportText) => {
  const age = extractNumber(reportText, /age\s*[:\-]?\s*(\d+)/i);
  const hbA1c = extractNumber(reportText, /hba1c\s*[:\-]?\s*(\d+(\.\d+)?)/i);
  const name = extractText(reportText, /name\s*[:\-]?\s*([A-Za-z\s]+)/i) || "Unknown Patient";
  const gender =
    extractText(reportText, /gender\s*[:\-]?\s*(male|female|other)/i).toLowerCase() || "other";
  const location =
    extractText(reportText, /location\s*[:\-]?\s*([A-Za-z\s]+)/i) || "Unknown";

  const disease = detectDisease(reportText);
  const smoking = detectSmoking(reportText);
  const medicalHistory = detectMedicalHistory(reportText);

  return {
    name,
    age,
    disease,
    gender,
    location,
    hbA1c,
    smoking,
    medicalHistory,
    notes: reportText
  };
};

module.exports = parsePatientReport;