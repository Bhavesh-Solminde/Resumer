import React, { useEffect } from "react";
import { useBuildStore } from "@/store/Build.store";
import { usePDFExport } from "@/hooks/usePDFExport";

// Builder Components
import BuilderHeader from "@/components/builder/BuilderHeader";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import ResumeEditor from "@/components/builder/ResumeEditor";
import DesignPanel from "@/components/builder/DesignPanel";

// Modals
import AddSectionModal from "@/components/builder/modals/AddSectionModal";
import RearrangeModal from "@/components/builder/modals/RearrangeModal";
import TemplatesModal from "@/components/builder/modals/TemplatesModal";

const ResumeBuilder = () => {
  const { resumeData, initializeHistory } = useBuildStore();
  const { exportToPDF, isExporting } = usePDFExport();

  // Initialize history on mount
  useEffect(() => {
    initializeHistory();
  }, [initializeHistory]);

  const handleExportPDF = () => {
    exportToPDF(resumeData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <BuilderHeader onExportPDF={handleExportPDF} />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <BuilderSidebar />

        {/* Design Panel (slides out from sidebar) */}
        <DesignPanel />

        {/* Main Editor Canvas */}
        <ResumeEditor />
      </div>

      {/* Modals */}
      <AddSectionModal />
      <RearrangeModal />
      <TemplatesModal />
    </div>
  );
};

export default ResumeBuilder;
