import React from "react";

export default function EligibilityResultPanel({ matches, selectedTrialTitle, onSendReport }) {
  const topMatch = matches && matches.length > 0 ? matches[0] : null;

  return (
    <div className="doctor-panel">
      <h3 className="panel-title">Eligibility Results</h3>

      {!topMatch ? (
        <p>No eligible patient found.</p>
      ) : (
        <div className="eligibility-box">
          <p><strong>Patient:</strong> {topMatch.patient.name}</p>
          <p><strong>Trial:</strong> {selectedTrialTitle || "Selected Trial"}</p>
          <p><strong>Status:</strong> <span className="status-eligible">Eligible</span></p>
          <p>
            <strong>Match Score:</strong>{" "}
            <span className="match-score-badge">{topMatch.score}%</span>
          </p>

          <div className="reasons-box">
            <p><strong>Reasons:</strong></p>
            <ul>
              {(topMatch.explanation || []).map((item, index) => (
                <li key={index}>✔ {item}</li>
              ))}
            </ul>
          </div>

          <button className="save-btn" onClick={() => onSendReport(topMatch)}>
            Send Report
          </button>
        </div>
      )}
    </div>
  );
}