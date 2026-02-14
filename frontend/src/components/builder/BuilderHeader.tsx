import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useBuildStore } from "../../store/Build.store";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Share2,
  RotateCcw,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  History,
  Pencil,
} from "lucide-react";

interface BuilderHeaderProps {
  onExportPDF: () => void;
  onOpenHistory?: () => void;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  onExportPDF,
  onOpenHistory,
}) => {
  const { resetResume } = useBuildStore();
  const {
    resumeTitle,
    setResumeTitle,
    isSaving,
    lastSaved,
    saveError,
    unsavedChanges,
    clearAutosaveState,
  } = useBuildStore();
  const navigate = useNavigate();

  // Editable title state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(resumeTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync edited title with store
  useEffect(() => {
    setEditedTitle(resumeTitle);
  }, [resumeTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim() && editedTitle !== resumeTitle) {
      setResumeTitle(editedTitle.trim());
    } else if (!editedTitle.trim()) {
      setEditedTitle(resumeTitle);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setEditedTitle(resumeTitle);
      setIsEditingTitle(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
    }
  };

  const handleNewResume = () => {
    // Clear autosave state and reset resume
    clearAutosaveState();
    resetResume();
  };

  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render save status
  const renderSaveStatus = () => {
    if (saveError) {
      return (
        <div className="flex items-center gap-1.5 text-destructive text-xs">
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Error saving</span>
        </div>
      );
    }

    if (isSaving) {
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="hidden sm:inline">Saving...</span>
        </div>
      );
    }

    if (unsavedChanges) {
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span className="hidden sm:inline">Unsaved changes</span>
        </div>
      );
    }

    if (lastSaved) {
      return (
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 text-xs">
          <Check className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            Saved {formatLastSaved(lastSaved)}
          </span>
        </div>
      );
    }

    return null;
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

          {/* Editable Title */}
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="h-7 w-40 sm:w-52 text-sm font-medium"
              maxLength={100}
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="group flex items-center gap-1.5 hover:bg-accent/50 rounded px-2 py-1 transition-colors"
            >
              <span className="font-semibold text-foreground max-w-32 sm:max-w-48 truncate">
                {resumeTitle}
              </span>
              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Save Status */}
          <div className="hidden sm:flex">{renderSaveStatus()}</div>
        </div>

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewResume}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>

        {onOpenHistory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHistory}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
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
