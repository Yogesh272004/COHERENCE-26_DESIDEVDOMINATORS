import React from "react";

export default function MatchResultCard({ match, onSendReport }) {
  return (
    <div className="match-card">
      <h3>{match.patient.name}</h3>
      <p><strong>Age:</strong> {match.patient.age}</p>
      <p><strong>Disease:</strong> {match.patient.disease}</p>
      <p><strong>Location:</strong> {match.patient.location}</p>
      <p><strong>Status:</strong> {match.status}</p>
      <p><strong>Score:</strong> {match.score}</p>

      <div className="explanation-box">
        <p><strong>Explanation:</strong></p>
        <ul>
          {(match.explanation || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {onSendReport && (
        <button className="primary-btn" onClick={() => onSendReport(match)}>
          Send Report
        </button>
      )}
    </div>
  );
}