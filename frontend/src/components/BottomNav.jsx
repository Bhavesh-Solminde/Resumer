import React from "react";
import { NavLink } from "react-router-dom";
import { FileText, Zap, PenTool, Users, User } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/analyze", icon: FileText, label: "Analyze" },
    { to: "/optimize", icon: Zap, label: "Optimize" },
    { to: "/build", icon: PenTool, label: "Build" },
    { to: "/recruiter", icon: Users, label: "Recruiter" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around px-4 z-50">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
