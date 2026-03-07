import React from "react";

export default function TrialTable({ trials }) {
  return (
    <div className="card">
      <h2>Existing Trials</h2>

      {trials.length === 0 ? (
        <p>No trials found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Disease</th>
              <th>Age Range</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {trials.map((trial) => (
              <tr key={trial._id}>
                <td>{trial.title}</td>
                <td>{trial.disease}</td>
                <td>
                  {trial.minAge} - {trial.maxAge}
                </td>
                <td>{trial.requiredLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}   