import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RoleSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>

      <button
        className={`role-btn ${location.pathname === "/dashboard" ? "active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        Doctor
      </button>

      <button
        className={`role-btn ${location.pathname === "/researcher" ? "active" : ""}`}
        onClick={() => navigate("/researcher")}
      >
        Researcher
      </button>
    </div>
  );
}