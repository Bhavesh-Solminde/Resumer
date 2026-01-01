import React from "react";
import { useBuildStore } from "../store/Build.store";
import { usePDFExport } from "../hooks/usePDFExport";

// Builder Components
import BuilderHeader from "../components/builder/BuilderHeader";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import ResumeEditor from "../components/builder/ResumeEditor";
import DesignPanel from "../components/builder/DesignPanel";
import { ConfirmDialog } from "../components/builder/shared";

// Modals
import AddSectionModal from "../components/builder/modals/AddSectionModal";
import RearrangeModal from "../components/builder/modals/RearrangeModal";
import TemplatesModal from "../components/builder/modals/TemplatesModal";

const ResumeBuilder: React.FC = () => {
  const {
    sections,
    sectionOrder,
    sectionSettings,
    theme,
    confirmDialog,
    setConfirmDialog,
  } = useBuildStore();
  const { exportToPDF, isExporting } = usePDFExport();

  const handleExportPDF = () => {
    // Create resumeData object from store state for PDF export
    const resumeData = { sections, sectionOrder, sectionSettings, theme };
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

      {/* Global Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          onConfirm={() => {
            confirmDialog.onConfirm?.();
            setConfirmDialog(null);
          }}
          onCancel={() => {
            confirmDialog.onCancel?.();
            setConfirmDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
