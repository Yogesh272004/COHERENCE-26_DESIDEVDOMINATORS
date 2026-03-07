import React from "react";

export default function AvailableTrialsPanel({
  trials,
  selectedTrial,
  setSelectedTrial,
  onCheckMatches
}) {
  return (
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
                <p>
                  Age {trial.minAge} - {trial.maxAge}
                </p>
              </div>

              <button
                className="mini-action-btn"
                onClick={() => {
                  setSelectedTrial(trial._id);
                  onCheckMatches(trial._id);
                }}
              >
                Check Eligibility
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}