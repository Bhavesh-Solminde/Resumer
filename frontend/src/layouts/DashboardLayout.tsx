import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FloatingDock } from "../components/ui/floating-dock";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import StarterOfferModal from "../components/StarterOfferModal";
import { useSubscriptionStore } from "../store/Subscription.store";
import { FileText, Zap, PenTool, Users, User } from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();
  const { starterOfferClaimed, fetchStatus } = useSubscriptionStore();
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Show the starter offer modal once if user hasn't claimed it
  useEffect(() => {
    const dismissed = sessionStorage.getItem("resumer_starter_modal_dismissed");
    if (!starterOfferClaimed && !dismissed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setShowOfferModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [starterOfferClaimed]);

  const handleCloseModal = () => {
    setShowOfferModal(false);
    sessionStorage.setItem("resumer_starter_modal_dismissed", "true");
  };
  
  // Hide footer on specific routes
  const hideFooterRoutes = ["/resume/analyze", "/resume/optimize", "/recruiter"];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);
  const navItems = [
    {
      title: "Analyze",
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/resume/analyze",
    },
    {
      title: "Optimize",
      icon: (
        <Zap className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/resume/optimize",
    },
    {
      title: "Build",
      icon: (
        <PenTool className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/resume/build",
    },
    {
      title: "Recruiter",
      icon: (
        <Users className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/recruiter",
    },
    {
      title: "Profile",
      icon: (
        <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="min-h-[calc(100vh-16rem)]">
        <Outlet />
      </main>

      {shouldShowFooter && <Footer />}

      {/* Starter Offer Modal */}
      <StarterOfferModal open={showOfferModal} onClose={handleCloseModal} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex fixed bottom-8 left-0 right-0 justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock items={navItems} />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
