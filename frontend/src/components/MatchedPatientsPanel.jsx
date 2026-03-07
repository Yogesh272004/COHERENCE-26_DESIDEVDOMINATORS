import React from "react";

export default function MatchedPatientsPanel({ reports }) {
  const eligibleReports = reports.filter((r) => r.status === "Eligible");

  return (
    <div className="researcher-panel">
      <h3 className="researcher-panel-title">Matched Patients</h3>

      {eligibleReports.length === 0 ? (
        <p>No matched patients yet.</p>
      ) : (
        <div className="matched-patient-list">
          {eligibleReports.slice(0, 5).map((report) => (
            <div key={report._id} className="matched-patient-card">
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
                ✓ Eligible
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}