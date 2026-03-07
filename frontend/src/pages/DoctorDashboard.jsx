import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addPatient, getPatients } from "../services/patientService";
import { getTrialMatches, getTrials, deleteTrial } from "../services/trialService";
import { createReport, getReports } from "../services/reportService";
import { getUsers } from "../services/userService";
import RoleSidebar from "../components/RoleSidebar";
import DoctorTopbar from "../components/DoctorTopbar";
import DoctorStatCards from "../components/DoctorStatCards";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [trials, setTrials] = useState([]);
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedTrial, setSelectedTrial] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const [form, setForm] = useState({
    name: "",
    age: "",
    disease: "",
    gender: "other",
    location: "",
    hbA1c: "",
    smoking: false,
    medicalHistory: "",
    notes: ""
  });

  // PDF upload states
  const [pdfFile, setPdfFile] = useState(null);
  const [parsedPatient, setParsedPatient] = useState(null);
  const [autoMatches, setAutoMatches] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, trialsData, usersData, reportsData] = await Promise.all([
        getPatients(),
        getTrials(),
        getUsers(),
        getReports()
      ]);

      setPatients(patientsData);
      setTrials(trialsData);
      setUsers(usersData);
      setReports(reportsData);
    } catch (error) {
      console.error("LOAD DASHBOARD ERROR:", error);
    }
  };

  const handleDeleteTrial = async (trialId) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this trial?");
    if (!confirmDelete) return;

    await deleteTrial(trialId);

    // clear selected trial if deleted
    if (selectedTrial === trialId) {
      setSelectedTrial("");
      setMatches([]);
    }

    await loadData();
    alert("Trial deleted successfully");
  } catch (error) {
    console.error("DELETE TRIAL ERROR:", error);
    alert("Failed to delete trial");
  }
};

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();

    try {
      await addPatient({
        ...form,
        age: Number(form.age),
        hbA1c: form.hbA1c ? Number(form.hbA1c) : null,
        medicalHistory: form.medicalHistory
          ? form.medicalHistory.split(",").map((item) => item.trim())
          : []
      });

      setForm({
        name: "",
        age: "",
        disease: "",
        gender: "other",
        location: "",
        hbA1c: "",
        smoking: false,
        medicalHistory: "",
        notes: ""
      });

      await loadData();
      setActiveTab("patients");
      alert("Patient added successfully");
    } catch (error) {
      console.error("ADD PATIENT ERROR:", error);
      alert("Failed to add patient");
    }
  };

  const handleCheckMatches = async (trialId) => {
    try {
      setSelectedTrial(trialId);
      const data = await getTrialMatches(trialId);
      setMatches(data);
      setActiveTab("trialMatches");
    } catch (error) {
      console.error("MATCH ERROR:", error);
      alert("Failed to fetch matching patients");
    }
  };

  const handleSendReport = async (match) => {
    try {
      const doctor = users.find((u) => u.role === "doctor");
      const researcher = users.find((u) => u.role === "researcher");

      if (!doctor || !researcher) {
        alert("Doctor or Researcher not found");
        return;
      }

      await createReport({
        trialId: selectedTrial,
        patientId: match.patient._id,
        doctorId: doctor._id,
        researcherId: researcher._id,
        remarks: "Patient looks suitable"
      });

      await loadData();
      alert("Report sent successfully");
    } catch (error) {
      console.error("SEND REPORT ERROR:", error);
      alert("Failed to send report");
    }
  };

  const handlePdfUpload = async () => {
    try {
      if (!pdfFile) {
        alert("Please select a PDF file");
        return;
      }

      const formData = new FormData();
      formData.append("report", pdfFile);

      const res = await axios.post(
        "http://localhost:5000/api/pdf-upload/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setParsedPatient(res.data.patient);
      setAutoMatches(res.data.eligibleMatches || []);

      await loadData();
      setActiveTab("patients");
      alert("PDF parsed and patient saved successfully");
    } catch (error) {
      console.error("PDF UPLOAD ERROR:", error);
      alert("Failed to upload PDF");
    }
  };

  const selectedTrialTitle = useMemo(() => {
    return trials.find((trial) => trial._id === selectedTrial)?.title || "";
  }, [selectedTrial, trials]);

  return (
    <div className="doctor-dashboard-layout">
      <RoleSidebar />

      <div className="doctor-main-area">
        <DoctorTopbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="doctor-content">
          <DoctorStatCards
            patientsCount={patients.length}
            eligibleCount={matches.length}
            trialsCount={trials.length}
            reportsCount={reports.length}
          />

          {activeTab === "dashboard" && (
            <div className="doctor-main-grid">
              <div className="doctor-left-column">
                <div className="doctor-panel">
                  <h3 className="panel-title">Add Patient</h3>

                  <form onSubmit={handleAddPatient} className="doctor-form-grid">
                    <div className="doctor-form-row">
                      <input
                        name="name"
                        placeholder="Patient Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                      <input
                        name="age"
                        type="number"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                        required
                      />
                      <input
                        name="disease"
                        placeholder="Condition"
                        value={form.disease}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="doctor-form-row single">
                      <input
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="doctor-form-row">
                      <select name="gender" value={form.gender} onChange={handleChange}>
                        <option value="other">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>

                      <input
                        name="hbA1c"
                        type="number"
                        step="0.1"
                        placeholder="HbA1c"
                        value={form.hbA1c}
                        onChange={handleChange}
                      />

                      <div className="doctor-checkbox-inline">
                        <label>
                          <input
                            type="checkbox"
                            name="smoking"
                            checked={form.smoking}
                            onChange={handleChange}
                          />
                          Smoking
                        </label>
                      </div>
                    </div>

                    <textarea
                      name="medicalHistory"
                      placeholder="Medical History (comma separated)"
                      value={form.medicalHistory}
                      onChange={handleChange}
                    />

                    <textarea
                      name="notes"
                      placeholder="Doctor Notes"
                      value={form.notes}
                      onChange={handleChange}
                    />

                    <button type="submit" className="save-btn">
                      Add Patient
                    </button>
                  </form>
                </div>

                <div className="doctor-panel">
                  <h3 className="panel-title">Upload Patient Report PDF</h3>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #dbe3ef",
                      marginTop: "10px",
                      background: "#fff"
                    }}
                  />

                  <button
                    className="save-btn"
                    style={{ marginTop: "14px" }}
                    onClick={handlePdfUpload}
                  >
                    Upload PDF & Parse
                  </button>

                  {parsedPatient && (
                    <div className="reasons-box" style={{ marginTop: "18px" }}>
                      <p><strong>Parsed Patient Data</strong></p>
                      <p><strong>Name:</strong> {parsedPatient.name}</p>
                      <p><strong>Age:</strong> {parsedPatient.age}</p>
                      <p><strong>Disease:</strong> {parsedPatient.disease}</p>
                      <p><strong>Location:</strong> {parsedPatient.location}</p>
                      <p><strong>Patient ID:</strong> {parsedPatient.patientCode || "Generated"}</p>
                    </div>
                  )}

                  {autoMatches.length > 0 && (
                    <div className="reasons-box" style={{ marginTop: "18px" }}>
                      <p><strong>Eligible Trials Found</strong></p>
                      <ul>
                        {autoMatches.map((m, i) => (
                          <li key={i}>
                            {m.trialTitle} — Score: {m.score}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="doctor-right-column">
                <div className="doctor-panel">
                  <h3 className="panel-title">Available Trials</h3>

                  {trials.length === 0 ? (
                    <p>No trials found.</p>
                  ) : (
                    <div className="trial-list">
                      {trials.map((trial) => (
                        <div
                          key={trial._id}
                          className={`trial-item ${selectedTrial === trial._id ? "selected-trial" : ""}`}
                        >
                          <div>
                            <strong>{trial.title}</strong>
                            <p>Age {trial.minAge} - {trial.maxAge}</p>
                            <p>{trial.requiredLocation}</p>
                          </div>

                         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  <button
    className="mini-action-btn"
    onClick={() => handleCheckMatches(trial._id)}
  >
    Check Eligibility
  </button>

  <button
    onClick={() => handleDeleteTrial(trial._id)}
    style={{
      padding: "10px 14px",
      border: "none",
      borderRadius: "8px",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600"
    }}
  >
    Delete
  </button>
</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="doctor-panel">
              <h3 className="panel-title">Patient List</h3>

              {patients.length === 0 ? (
                <p>No patients found.</p>
              ) : (
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Disease</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient._id}>
                        <td>{patient.patientCode || "N/A"}</td>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.disease}</td>
                        <td>{patient.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "trialMatches" && (
            <div className="doctor-panel">
              <h3 className="panel-title">
                Eligible Patients {selectedTrialTitle ? `for ${selectedTrialTitle}` : ""}
              </h3>

              {matches.length === 0 ? (
                <p>No eligible patient found for selected trial.</p>
              ) : (
                <div className="eligible-cards">
                  {matches.map((match) => (
                    <div key={match.patient._id} className="eligibility-box">
                      <p><strong>Patient:</strong> {match.patient.name}</p>
                      <p><strong>Patient ID:</strong> {match.patient.patientCode || "N/A"}</p>
                      <p><strong>Trial:</strong> {selectedTrialTitle}</p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="status-eligible">{match.status}</span>
                      </p>
                      <p>
                        <strong>Match Score:</strong>{" "}
                        <span className="match-score-badge">{match.score}%</span>
                      </p>

                      <div className="reasons-box">
                        <p><strong>Reasons:</strong></p>
                        <ul>
                          {(match.explanation || []).map((item, index) => (
                            <li key={index}>✔ {item}</li>
                          ))}
                        </ul>
                      </div>

                      <button className="save-btn" onClick={() => handleSendReport(match)}>
                        Send Report
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="doctor-panel">
              <h3 className="panel-title">Pending Reviews / Alerts</h3>

              {reports.length === 0 ? (
                <p>No alerts yet.</p>
              ) : (
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Trial</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.patient?.patientCode || "N/A"}</td>
                        <td>{report.trial?.title}</td>
                        <td>{report.status}</td>
                        <td>{report.score}%</td>
                        <td>{report.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}