const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const Patient = require("./models/Patient");

const results = [];

const importCSV = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "data", "synthetic_clinical_patients_dataset.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          patientCode: row.patientCode,
          name: row.name,
          age: Number(row.age),
          disease: row.disease,
          gender: row.gender || "other",
          location: row.location,
          hbA1c: row.hbA1c ? Number(row.hbA1c) : null,
          smoking: String(row.smoking).toLowerCase() === "true",
          medicalHistory: row.medicalHistory
            ? row.medicalHistory.split(";").map((item) => item.trim()).filter(Boolean)
            : [],
          notes: row.notes || ""
        });
      })
      .on("end", async () => {
        try {
          await Patient.deleteMany({});
          await Patient.insertMany(results);
          console.log(`Imported ${results.length} patients successfully`);
          process.exit();
        } catch (err) {
          console.error("Insert error:", err);
          process.exit(1);
        }
      });
  } catch (error) {
    console.error("Import error:", error);
    process.exit(1);
  }
};

importCSV();