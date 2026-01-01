/**
 * UI Slice
 * Handles UI state (panels, selection, dialogs, loading)
 * This slice is NOT tracked by temporal middleware
 */

import type { StateCreator } from "zustand";
import type {
  IConfirmDialog,
  PanelId,
  IActivePanels,
} from "@resumer/shared-types";
import type { BuildState, BuildActions } from "../Build.store";

// ============================================================================
// State Interface
// ============================================================================

export interface UIState {
  activePanel: PanelId | null;
  selectedSectionId: string | null;
  isLoading: boolean;
  isExporting: boolean;
  confirmDialog: IConfirmDialog | null;
}

// ============================================================================
// Actions Interface
// ============================================================================

export interface UIActions {
  setActivePanel: (panel: PanelId | null) => void;
  setSelectedSection: (sectionId: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  setConfirmDialog: (dialog: Partial<IConfirmDialog> | null) => void;
  closeConfirmDialog: () => void;
}

// ============================================================================
// Default State
// ============================================================================

const defaultConfirmDialog: IConfirmDialog | null = null;

// ============================================================================
// Slice Creator
// ============================================================================

export const createUISlice: StateCreator<
  BuildState & BuildActions,
  [],
  [],
  UIActions
> = (set, get) => ({
  // Initial state removed to prevent overriding Build.store.ts defaults
  // activePanel: null,
  // selectedSectionId: null,
  // isLoading: false,
  // isExporting: false,
  // confirmDialog: defaultConfirmDialog,

  // Set active panel
  setActivePanel: (panel) => {
    set({ activePanel: panel });
  },

  // Set selected section
  setSelectedSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },

  // Set loading state
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Set exporting state
  setIsExporting: (exporting) => {
    set({ isExporting: exporting });
  },

  // Set confirmation dialog
  setConfirmDialog: (dialog) => {
    if (dialog === null) {
      set({ confirmDialog: null });
    } else {
      const currentDialog = get().confirmDialog;
      set({
        confirmDialog: {
          title: dialog.title ?? currentDialog?.title ?? "",
          message: dialog.message ?? currentDialog?.message ?? "",
          confirmText: dialog.confirmText ?? currentDialog?.confirmText,
          cancelText: dialog.cancelText ?? currentDialog?.cancelText,
          onConfirm: dialog.onConfirm ?? currentDialog?.onConfirm ?? (() => {}),
          onCancel: dialog.onCancel ?? currentDialog?.onCancel,
          variant: dialog.variant ?? currentDialog?.variant,
        },
      });
    }
  },

  // Close confirmation dialog
  closeConfirmDialog: () => {
    set({ confirmDialog: null });
  },
});
