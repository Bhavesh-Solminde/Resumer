import React from "react";
import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/store/Build.store";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  Share2,
  RotateCcw,
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";

const BuilderHeader = ({ onExportPDF }) => {
  const { resetResume } = useBuildStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleShare = () => {
    // Future: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            R
          </div>
          <span className="font-semibold text-foreground hidden sm:block">
            Resume Builder
          </span>
        </div>

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          onClick={resetResume}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <Button
          size="sm"
          onClick={onExportPDF}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </header>
  );
};

export default BuilderHeader;
