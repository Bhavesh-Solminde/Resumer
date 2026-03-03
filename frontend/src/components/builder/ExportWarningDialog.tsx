/**
 * ExportWarningDialog — shown once before the first PDF export.
 *
 * Warns the user not to edit the exported PDF in external editors
 * because it will break ATS parsing / formatting.
 *
 * Persists a localStorage flag so it only shows once.
 */

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const STORAGE_KEY = "resumer_export_warning_seen";

export function hasSeenExportWarning(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function markExportWarningSeen(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}

interface ExportWarningDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExportWarningDialog: React.FC<ExportWarningDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            PDF Export Warning
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong className="block text-amber-800 dark:text-amber-300 mb-1">
                 Do NOT edit this PDF in external tools
              </strong>
              Editing in Acrobat, Word, or Google Docs will{" "}
              <strong>break ATS parsing</strong>. Make all changes here and
              re-export.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              markExportWarningSeen();
              onConfirm();
            }}
            className="bg-primary"
          >
            I Understand — Export PDF
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExportWarningDialog;
