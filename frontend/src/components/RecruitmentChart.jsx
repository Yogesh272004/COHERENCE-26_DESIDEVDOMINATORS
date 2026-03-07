import React, { useMemo, useState } from "react";

export default function RecruitmentChart({ reports, trials }) {
  const [selectedTrial, setSelectedTrial] = useState(null);

  const trialInsights = useMemo(() => {
    return trials.map((trial) => {
      const relatedReports = reports.filter((r) => r.trial?._id === trial._id);

      const eligible = relatedReports.filter((r) => r.status === "Eligible");
      const maybe = relatedReports.filter((r) => r.status === "Maybe Eligible");
      const rejected = relatedReports.filter(
        (r) => r.status !== "Eligible" && r.status !== "Maybe Eligible"
      );

      const total = relatedReports.length;
      const efficiency = total > 0 ? Math.round((eligible.length / total) * 100) : 0;

      const locations = {};
      relatedReports.forEach((r) => {
        const loc = r.patient?.location || "Unknown";
        locations[loc] = (locations[loc] || 0) + 1;
      });

      const locationBreakdown = Object.entries(locations)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);

      const topPatients = [...eligible]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      let insight = "This trial needs more screening data.";
      if (efficiency >= 70) insight = "Strong recruitment potential with high conversion.";
      else if (efficiency >= 40) insight = "Moderate matching performance with room for optimization.";
      else if (total > 0) insight = "Low conversion. Trial criteria may be too restrictive.";

      return {
        ...trial,
        total,
        eligible: eligible.length,
        maybe: maybe.length,
        rejected: rejected.length,
        efficiency,
        topPatients,
        locationBreakdown,
        insight
      };
    });
  }, [reports, trials]);

  return (
    <>
      <div className="researcher-panel insight-panel">
        <div className="insight-header">
          <div>
            <h3 className="researcher-panel-title">Recruitment Insights</h3>
            <p className="insight-subtitle">
              Click a trial to view detailed recruitment analytics
            </p>
          </div>

          <div className="insight-live-pill">
            <span className="live-dot"></span>
            Smart Insights
          </div>
        </div>

        {trialInsights.length === 0 ? (
          <p>No trial analytics available.</p>
        ) : (
          <div className="insight-cards-grid">
            {trialInsights.map((trial) => (
              <div
                key={trial._id}
                className="insight-trial-card"
                onClick={() => setSelectedTrial(trial)}
              >
                <div className="insight-trial-top">
                  <div>
                    <h4>{trial.title}</h4>
                    <p>{trial.disease}</p>
                  </div>

                  <div className="insight-score-badge">
                    {trial.efficiency}%
                  </div>
                </div>

                <div className="insight-metrics-row">
                  <div>
                    <span>Total</span>
                    <strong>{trial.total}</strong>
                  </div>
                  <div>
                    <span>Eligible</span>
                    <strong className="green-text">{trial.eligible}</strong>
                  </div>
                  <div>
                    <span>Maybe</span>
                    <strong className="orange-text">{trial.maybe}</strong>
                  </div>
                </div>

                <div className="insight-progress-track">
                  <div
                    className="insight-progress-fill"
                    style={{ width: `${trial.efficiency}%` }}
                  ></div>
                </div>

                <p className="insight-summary">{trial.insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTrial && (
        <div
          className="patient-modal-overlay"
          onClick={() => setSelectedTrial(null)}
        >
          <div
            className="patient-modal-box insight-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="patient-modal-close"
              onClick={() => setSelectedTrial(null)}
            >
              ×
            </button>

            <div className="patient-modal-header">
              <div className="patient-modal-avatar">
                {selectedTrial.title?.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <h2>{selectedTrial.title}</h2>
                <p className="patient-modal-subtitle">
                  Detailed recruitment insight for this trial
                </p>
              </div>
            </div>

            <div className="patient-modal-grid">
              <div className="patient-modal-card">
                <span>Total Reports</span>
                <strong>{selectedTrial.total}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Eligible</span>
                <strong className="green-text">{selectedTrial.eligible}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Maybe Eligible</span>
                <strong className="orange-text">{selectedTrial.maybe}</strong>
              </div>

              <div className="patient-modal-card">
                <span>Rejected / Other</span>
                <strong className="red-text">{selectedTrial.rejected}</strong>
              </div>
            </div>

            <div className="reasons-box" style={{ marginTop: "20px" }}>
              <p><strong>Recruitment Efficiency</strong></p>
              <div className="insight-progress-track" style={{ marginTop: "10px" }}>
                <div
                  className="insight-progress-fill"
                  style={{ width: `${selectedTrial.efficiency}%` }}
                ></div>
              </div>
              <p style={{ marginTop: "10px" }}>
                {selectedTrial.efficiency}% conversion from screened reports to eligible candidates
              </p>
            </div>

            <div className="reasons-box" style={{ marginTop: "20px" }}>
              <p><strong>Top Matched Patients</strong></p>
              {selectedTrial.topPatients.length === 0 ? (
                <p>No strong matches yet.</p>
              ) : (
                <ul>
                  {selectedTrial.topPatients.map((p, i) => (
                    <li key={i}>
                      {p.patient?.patientCode || "Anonymous"} — {p.score}% match — {p.patient?.location}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="reasons-box" style={{ marginTop: "20px" }}>
              <p><strong>Location Breakdown</strong></p>
              {selectedTrial.locationBreakdown.length === 0 ? (
                <p>No location data available.</p>
              ) : (
                <ul>
                  {selectedTrial.locationBreakdown.map((loc, i) => (
                    <li key={i}>
                      {loc.location}: {loc.count} patient(s)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="reasons-box" style={{ marginTop: "20px" }}>
              <p><strong>System Insight</strong></p>
              <p>{selectedTrial.insight}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}