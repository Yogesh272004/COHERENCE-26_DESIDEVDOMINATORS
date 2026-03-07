import React from "react";

export default function DoctorStatCards({ patientsCount, eligibleCount, trialsCount, reportsCount }) {
  return (
    <div className="doctor-stat-grid">
      <div className="doctor-stat-card">
        <p>Total Patients:</p>
        <h2>{patientsCount}</h2>
      </div>

      <div className="doctor-stat-card">
        <p>Eligible Patients:</p>
        <h2 className="eligible-text">{eligibleCount}</h2>
      </div>

      <div className="doctor-stat-card">
        <p>Available Trials:</p>
        <h2 className="trial-text">{trialsCount}</h2>
      </div>

      <div className="doctor-stat-card">
        <p>Pending Reviews:</p>
        <h2 className="pending-text">{reportsCount}</h2>
      </div>
    </div>
  );
}