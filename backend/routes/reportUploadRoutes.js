const express = require("express");
const router = express.Router();
const { uploadPatientReport } = require("../controllers/reportUploadController");

router.post("/upload-report", uploadPatientReport);

module.exports = router;
