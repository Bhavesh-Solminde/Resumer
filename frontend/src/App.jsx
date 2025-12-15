import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/LandingPage.jsx";
import Analyze from "./pages/Analyze.jsx";
import Optimize from "./pages/Optimize.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Recruiter from "./pages/Recruiter.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/build" element={<ResumeBuilder />} />
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
