import { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/Auth.store";
import { FullScreenAuthLoader } from "@/components/ui/auth-loader";

import DashboardLayout from "./layouts/DashboardLayout";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Analyze from "./pages/Analyze.jsx";
import Optimize from "./pages/Optimize.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Recruiter from "./pages/Recruiter.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <FullScreenAuthLoader />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Navigate to="/analyze" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/analyze" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/analyze" />}
        />
        <Route
          element={authUser ? <DashboardLayout /> : <Navigate to="/login" />}
        >
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
