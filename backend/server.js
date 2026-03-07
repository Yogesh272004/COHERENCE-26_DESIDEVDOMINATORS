const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Clinical Trial Backend Running 🚀");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/trials", require("./routes/trialRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/pdf-upload", require("./routes/pdfUploadRoutes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});