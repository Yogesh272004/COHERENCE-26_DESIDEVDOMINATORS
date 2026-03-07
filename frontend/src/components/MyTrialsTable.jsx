import React from "react";

export default function MyTrialsTable({ trials, reports }) {
  const getMatchCount = (trialId) => {
    return reports.filter((r) => r.trial?._id === trialId).length;
  };

  const getStatusClass = (count) => {
    if (count >= 3) return "status-match";
    if (count >= 1) return "status-active";
    return "status-pending";
  };

  const getStatusText = (count) => {
    if (count >= 3) return "Match";
    if (count >= 1) return "Active";
    return "Pending";
  };

  return (
    <div className="researcher-panel">
      <h3 className="researcher-panel-title">My Trials</h3>

      {trials.length === 0 ? (
        <p>No trials available.</p>
      ) : (
        <table className="researcher-table">
          <thead>
            <tr>
              <th>Trial Name</th>
              <th>Disease</th>
              <th>Status</th>
              <th>Matches</th>
            </tr>
          </thead>
          <tbody>
            {trials.map((trial) => {
              const matchCount = getMatchCount(trial._id);
              return (
                <tr key={trial._id}>
                  <td>{trial.title}</td>
                  <td>{trial.disease}</td>
                  <td>
                    <span className={`trial-status-badge ${getStatusClass(matchCount)}`}>
                      {getStatusText(matchCount)}
                    </span>
                  </td>
                  <td>{matchCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}