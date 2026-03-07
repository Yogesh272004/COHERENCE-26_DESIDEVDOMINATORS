import React, { useEffect, useMemo, useState } from "react";
import RoleSidebar from "../components/RoleSidebar";
import { createTrial, getTrials } from "../services/trialService";
import { getReports } from "../services/reportService";
import ResearcherStats from "../components/ResearcherStats";
import MyTrialsTable from "../components/MyTrialsTable";
import MatchedPatientsPanel from "../components/MatchedPatientsPanel";
import RecruitmentChart from "../components/RecruitmentChart";

export default function ResearcherDashboard() {
  const [trials, setTrials] = useState([]);
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState({
    title: "",
    disease: "",
    minAge: "",
    maxAge: "",
    requiredLocation: "",
    hbA1cMax: "",
    smokerAllowed: false,
    exclusionConditions: "",
    description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [trialData, reportData] = await Promise.all([
        getTrials(),
        getReports()
      ]);

      setTrials(trialData);
      setReports(reportData);
    } catch (error) {
      console.error("LOAD RESEARCHER DASHBOARD ERROR:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCreateTrial = async (e) => {
    e.preventDefault();

    try {
      await createTrial({
        ...form,
        minAge: Number(form.minAge),
        maxAge: Number(form.maxAge),
        hbA1cMax: form.hbA1cMax ? Number(form.hbA1cMax) : null,
        exclusionConditions: form.exclusionConditions
          ? form.exclusionConditions.split(",").map((item) => item.trim())
          : []
      });

      setForm({
        title: "",
        disease: "",
        minAge: "",
        maxAge: "",
        requiredLocation: "",
        hbA1cMax: "",
        smokerAllowed: false,
        exclusionConditions: "",
        description: ""
      });

      await loadData();
      alert("Trial created successfully");
    } catch (error) {
      console.error("CREATE TRIAL ERROR:", error);
      alert("Failed to create trial");
    }
  };

  const activeTrials = useMemo(() => trials.length, [trials]);
  const matchedPatients = useMemo(
    () => reports.filter((r) => r.status === "Eligible").length,
    [reports]
  );
  const pendingRecruitment = useMemo(
    () => reports.filter((r) => r.status !== "Eligible").length,
    [reports]
  );

  return (
    <div className="layout">
      <RoleSidebar />

      <div className="main researcher-main">
        <div className="researcher-page">
          <ResearcherStats
            totalTrials={trials.length}
            activeTrials={activeTrials}
            matchedPatients={matchedPatients}
            pendingRecruitment={pendingRecruitment}
          />

          <div className="researcher-grid">
            <div className="researcher-left">
              <div className="researcher-panel">
                <h3 className="researcher-panel-title">Create New Trial</h3>

                <form onSubmit={handleCreateTrial} className="researcher-form">
                  <label>Trial Name:</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter trial name"
                    required
                  />

                  <div className="researcher-form-row">
                    <div>
                      <label>Disease:</label>
                      <input
                        name="disease"
                        value={form.disease}
                        onChange={handleChange}
                        placeholder="Enter disease"
                        required
                      />
                    </div>

                    <div>
                      <label>Age Range:</label>
                      <div className="dual-inputs">
                        <input
                          name="minAge"
                          type="number"
                          value={form.minAge}
                          onChange={handleChange}
                          placeholder="Min"
                          required
                        />
                        <input
                          name="maxAge"
                          type="number"
                          value={form.maxAge}
                          onChange={handleChange}
                          placeholder="Max"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <label>Lab Requirements:</label>
                  <input
                    name="hbA1cMax"
                    type="number"
                    step="0.1"
                    value={form.hbA1cMax}
                    onChange={handleChange}
                    placeholder="HbA1c max"
                  />

                  <label>Required Location:</label>
                  <input
                    name="requiredLocation"
                    value={form.requiredLocation}
                    onChange={handleChange}
                    placeholder="Enter location"
                    required
                  />

                  <label>Exclusion Criteria:</label>
                  <textarea
                    name="exclusionConditions"
                    value={form.exclusionConditions}
                    onChange={handleChange}
                    placeholder="Exclusion criteria"
                  />

                  <button type="submit" className="extract-btn">
                    Create Trial
                  </button>
                </form>
              </div>

              <MatchedPatientsPanel reports={reports} />
            </div>

            <div className="researcher-right">
              <MyTrialsTable trials={trials} reports={reports} />
              <RecruitmentChart reports={reports} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}