import React, { useEffect, useRef, useCallback, useState } from "react";
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
import BuildHistoryDialog from "../components/builder/BuildHistoryDialog";

const ResumeBuilder: React.FC = () => {
  const {
    sections,
    sectionOrder,
    sectionSettings,
    style,
    template,
    confirmDialog,
    setConfirmDialog,
    // Autosave state
    currentBuildId,
    isSaving,
    unsavedChanges,
    resumeTitle,
    // Autosave actions
    createNewBuild,
    triggerAutosave,
    saveImmediately,
    cancelPendingAutosave,
  } = useBuildStore();
  const { exportToPDF, isExporting } = usePDFExport();

  // History dialog state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Track if this is the first mount to avoid initial save
  const isFirstMount = useRef(true);
  const previousStateRef = useRef<string>("");

  // Create new build on first mount if no current build exists
  useEffect(() => {
    if (!currentBuildId) {
      createNewBuild();
    }
  }, []); // Only run once on mount

  // Autosave effect - triggers when resume data changes
  useEffect(() => {
    // Skip first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Store initial state hash
      previousStateRef.current = JSON.stringify({ sections, sectionOrder, style, template, resumeTitle });
      return;
    }

    // Create current state hash
    const currentState = JSON.stringify({ sections, sectionOrder, style, template, resumeTitle });

    // Only trigger autosave if state actually changed
    if (currentState !== previousStateRef.current) {
      previousStateRef.current = currentState;
      triggerAutosave();
    }
  }, [sections, sectionOrder, style, template, resumeTitle, triggerAutosave]);

  // Cleanup on unmount - save any pending changes
  useEffect(() => {
    return () => {
      cancelPendingAutosave();
      // Save immediately if there are unsaved changes
      if (unsavedChanges) {
        saveImmediately();
      }
    };
  }, [unsavedChanges, saveImmediately, cancelPendingAutosave]);

  const handleExportPDF = () => {
    // Create resumeData object from store state for PDF export
    const resumeData = {
      sections,
      sectionOrder,
      sectionSettings,
      style,
      template,
    };
    exportToPDF(resumeData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <BuilderHeader
        onExportPDF={handleExportPDF}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

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
      <BuildHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />

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
