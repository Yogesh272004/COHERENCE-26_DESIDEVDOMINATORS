import React from "react";

export default function ReportCard({ report }) {
  return (
    <div className="match-card">
      <h3>Patient ID: {report.patient?.patientCode || "Not Assigned"}</h3>
      <p><strong>Age:</strong> {report.patient?.age}</p>
      <p><strong>Disease:</strong> {report.patient?.disease}</p>
      <p><strong>Location:</strong> {report.patient?.location}</p>
      <p><strong>Trial:</strong> {report.trial?.title}</p>
      <p><strong>Status:</strong> {report.status}</p>
      <p><strong>Score:</strong> {report.score}</p>
      <p><strong>Doctor:</strong> {report.doctor?.name}</p>
      <p><strong>Researcher:</strong> {report.researcher?.name}</p>
      <p><strong>Remarks:</strong> {report.remarks}</p>
    </div>
  );
}