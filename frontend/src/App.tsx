import { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/Auth.store";
import { useSubscriptionStore } from "./store/Subscription.store";
import { FullScreenAuthLoader } from "./components/ui/auth-loader";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react"
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Analyze = lazy(() => import("./pages/Analyze"));
const Optimize = lazy(() => import("./pages/Optimize"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const Recruiter = lazy(() => import("./pages/Recruiter"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const Disclaimer = lazy(() => import("./pages/legal/Disclaimer"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

const ProtectedRoute = () => {
  const { authUser } = useAuthStore();
  if (!authUser) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { fetchStatus } = useSubscriptionStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch subscription status when user is authenticated
  useEffect(() => {
    if (authUser) {
      fetchStatus();
    }
  }, [authUser, fetchStatus]);

  if (isCheckingAuth) {
    return <FullScreenAuthLoader />;
  }

  return (
    <ErrorBoundary>
      <Analytics/>
      <Suspense fallback={<FullScreenAuthLoader />}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route
            path="/"
            element={
              !authUser ? (
                <Navigate to="/resume/analyze" replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              authUser ? <Login /> : <Navigate to="/resume/analyze" replace />
            }
          />
          <Route
            path="/auth/signup"
            element={
              authUser ? <Signup /> : <Navigate to="/resume/analyze" replace />
            }
          />
          {/* --- DASHBOARD ROUTES (Sidebar + Navbar) --- */}
          <Route
            element={
              !authUser ? (
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
          <Route >
            <Route path="/resume/build" element={<ResumeBuilder />} />
            <Route path="/resume/build/:id" element={<ResumeBuilder />} />
          </Route>
          {/* --- PUBLIC PAGES (also accessible when logged in) --- */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/* --- PAYMENT STATUS PAGES --- */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          {/* --- LEGAL PAGES --- */}
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms" element={<TermsOfService />} />
          <Route path="/legal/refund" element={<RefundPolicy />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />
          {/* --- 404 --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
