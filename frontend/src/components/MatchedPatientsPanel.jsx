import React, { useState } from "react";

export default function MatchedPatientsPanel({ reports }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const eligibleReports = reports.filter((r) => r.status === "Eligible");

  return (
    <>
      <div className="researcher-panel">
        <h3 className="researcher-panel-title">Matched Patients</h3>

        {eligibleReports.length === 0 ? (
          <p>No matched patients yet.</p>
        ) : (
          <div className="matched-patient-list">
            {eligibleReports.slice(0, 6).map((report) => (
              <div
                key={report._id}
                className="matched-patient-card clickable-card"
                onClick={() => setSelectedPatient(report)}
              >
                <div className="matched-patient-avatar">
                  {report.patient?.patientCode?.slice(-2) || "PT"}
                </div>

                <div className="matched-patient-info">
                  <p className="matched-patient-name">
                    {report.patient?.patientCode || "Anonymous Patient"}
                  </p>
                  <p>Age: {report.patient?.age}</p>
                  <p>Match: {report.score}%</p>
                </div>

                <div className="matched-patient-status">
                  View
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <div
          className="patient-modal-overlay"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="patient-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="patient-modal-close"
              onClick={() => setSelectedPatient(null)}
            >
              ×
            </button>

            <div className="patient-modal-header">
              <div className="patient-modal-avatar">
                {selectedPatient.patient?.patientCode?.slice(-2) || "PT"}
              </div>

              <div>
                <h2>{selectedPatient.patient?.patientCode || "Anonymous Patient"}</h2>
                <p className="patient-modal-subtitle">
                  Eligible Candidate Overview
                </p>
              </div>
            </div>

            <div className="patient-modal-score-wrap">
              <div className="patient-modal-score-circle">
                {selectedPatient.score}%
              </div>
              <p>Clinical Match Score</p>
            </div>

            <div className="patient-modal-grid">
              <div className="patient-modal-card">
                <span>Patient ID</span>
                <strong>{selectedPatient.patient?.patientCode || "N/A"}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Age</span>
                <strong>{selectedPatient.patient?.age || "N/A"}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Disease</span>
                <strong>{selectedPatient.patient?.disease || "N/A"}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Location</span>
                <strong>{selectedPatient.patient?.location || "N/A"}</strong>
              </div>
            </div>

            <div className="patient-modal-footer">
              <div className="patient-badge eligible-badge">
                {selectedPatient.status}
              </div>
              <div className="patient-badge trial-badge">
                {selectedPatient.trial?.title || "Trial"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}