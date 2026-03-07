import React from "react";

export default function DoctorTopbar({ activeTab, setActiveTab }) {
  return (
    <div className="doctor-topbar">
      <div className="doctor-brand">
        <span className="doctor-brand-icon">✚</span>
        <span>Clinical Trial Matching</span>
      </div>

      <div className="doctor-top-links">
        <button
          className={`top-link-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`top-link-btn ${activeTab === "patients" ? "active" : ""}`}
          onClick={() => setActiveTab("patients")}
        >
          Patients
        </button>

        <button
          className={`top-link-btn ${activeTab === "trialMatches" ? "active" : ""}`}
          onClick={() => setActiveTab("trialMatches")}
        >
          Trial Matches
        </button>

        <button
          className={`top-link-btn ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>
      </div>

      <div className="doctor-profile">
        <span>👤</span>
        <span>Doctor</span>
        <span>🔔</span>
      </div>
    </div>
  );
}