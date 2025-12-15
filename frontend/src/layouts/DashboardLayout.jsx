import React from "react";
import { Outlet } from "react-router-dom";
import { FloatingDock } from "@/components/ui/floating-dock";
import Header from "../components/Header";
import { FileText, Zap, PenTool, Users, User } from "lucide-react";

const DashboardLayout = () => {
  const navItems = [
    {
      title: "Analyze",
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/analyze",
    },
    {
      title: "Optimize",
      icon: (
        <Zap className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/optimize",
    },
    {
      title: "Build",
      icon: (
        <PenTool className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/build",
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
      <main>
        <Outlet />
      </main>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock items={navItems} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
