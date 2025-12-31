import { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/Auth.store";
import { FullScreenAuthLoader } from "@/components/ui/auth-loader";
import ErrorBoundary from "@/components/ErrorBoundary";

import DashboardLayout from "./layouts/DashboardLayout";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Analyze = lazy(() => import("./pages/Analyze.jsx"));
const Optimize = lazy(() => import("./pages/Optimize.jsx"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder.jsx"));
const Recruiter = lazy(() => import("./pages/Recruiter.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const ProtectedRoute = () => {
  const { authUser } = useAuthStore();
  if (!authUser) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <FullScreenAuthLoader />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<FullScreenAuthLoader />}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route
            path="/"
            element={
              authUser ? (
                <Navigate to="/resume/analyze" replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              !authUser ? <Login /> : <Navigate to="/resume/analyze" replace />
            }
          />
          <Route
            path="/auth/signup"
            element={
              !authUser ? <Signup /> : <Navigate to="/resume/analyze" replace />
            }
          />
          {/* --- DASHBOARD ROUTES (Sidebar + Navbar) --- */}
          <Route
            element={
              authUser ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          >
            <Route path="/resume/analyze" element={<Analyze />} />
            <Route path="/resume/optimize" element={<Optimize />} />
            <Route path="/recruiter" element={<Recruiter />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* --- BUILDER ROUTES --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/resume/build" element={<ResumeBuilder />} />
            <Route path="/resume/build/:id" element={<ResumeBuilder />} />
          </Route>
          {/* --- 404 --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
