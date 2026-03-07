import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DoctorDashboard from "./pages/DoctorDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/researcher" element={<ResearcherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}