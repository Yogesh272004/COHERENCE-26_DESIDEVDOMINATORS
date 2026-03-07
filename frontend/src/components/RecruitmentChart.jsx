import React from "react";

export default function RecruitmentChart({ reports }) {
  const bars = [8, 14, 10, 22, 12, 9, 18, 15, 24, 30];

  return (
    <div className="researcher-panel">
      <h3 className="researcher-panel-title">Recruitment Chart</h3>

      <div className="chart-box">
        <div className="chart-y-axis">
          <span>50%</span>
          <span>30%</span>
          <span>20%</span>
          <span>10%</span>
        </div>

        <div className="chart-bars">
          {bars.map((value, index) => (
            <div key={index} className="chart-bar-group">
              <div
                className="chart-bar"
                style={{ height: `${value * 4}px` }}
              />
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}