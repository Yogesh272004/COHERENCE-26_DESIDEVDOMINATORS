import React from "react";

export default function ResearcherStats({
  totalTrials,
  activeTrials,
  matchedPatients,
  pendingRecruitment
}) {
  return (
    <div className="researcher-stats-grid">
      <div className="researcher-stat-card">
        <p>Total Trials:</p>
        <h2>{totalTrials}</h2>
      </div>

      <div className="researcher-stat-card">
        <p>Active Trials:</p>
        <h2 className="stat-blue">{activeTrials}</h2>
      </div>

      <div className="researcher-stat-card">
        <p>Matched Patients:</p>
        <h2 className="stat-green">{matchedPatients}</h2>
      </div>

      <div className="researcher-stat-card">
        <p>Pending Recruitment:</p>
        <h2 className="stat-orange">{pendingRecruitment}</h2>
      </div>
    </div>
  );
}