const fs = require("fs");
const path = require("path");
const Patient = require("../models/Patient");
const Trial = require("../models/Trial");
const parsePatientReport = require("../utils/parsePatientReport");
const matchTrialWithPatient = require("../utils/trialMatcher");

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

const generatePatientCode = () => {
  return "PAT-" + Math.floor(1000 + Math.random() * 9000);
};

const uploadPatientPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const filePath = req.file.path;
    const data = new Uint8Array(fs.readFileSync(filePath));

    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      extractedText += pageText + "\n";
    }

    if (!extractedText.trim()) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "No readable text found in PDF" });
    }

    const parsedData = parsePatientReport(extractedText);

    const patient = await Patient.create({
      ...parsedData,
      patientCode: generatePatientCode(),
      notes: extractedText
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

    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "PDF parsed and patient saved successfully",
      patient,
      eligibleMatches,
      extractedText
    });
  } catch (error) {
    console.error("PDF UPLOAD ERROR:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadPatientPdf };