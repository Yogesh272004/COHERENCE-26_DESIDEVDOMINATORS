import React from "react";

export default function ExtractedCriteriaPanel({ form }) {
  return (
    <div className="researcher-panel">
      <h3 className="researcher-panel-title">AI Extracted Criteria</h3>

      <div className="criteria-box">
        <p>
          <strong>Age:</strong>{" "}
          {form.minAge && form.maxAge ? `${form.minAge}-${form.maxAge}` : "Not specified"}
        </p>
        <p>
          <strong>Disease:</strong>{" "}
          {form.disease || "Not specified"}
        </p>
        <p>
          <strong>HbA1c:</strong>{" "}
          {form.hbA1cMax ? `< ${form.hbA1cMax}` : "Not specified"}
        </p>
        <p>
          <strong>Exclude:</strong>{" "}
          {form.exclusionConditions
            ? form.exclusionConditions
            : "None"}
        </p>
      </div>
    </div>
  );
}