/**
 * Autosave Slice - Handles autosave, build history, and persistence
 *
 * Features:
 * - Debounced autosave (2s delay)
 * - Build history management
 * - Source scan ID tracking for optimization → build linking
 * - localStorage backup for unsaved changes
 * - Error handling with retry
 */

import React from "react";
import type { StateCreator } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../../lib/axios";
import { toast } from "react-hot-toast";
import type { ApiResponse } from "@resumer/shared-types";

// ============================================================================
// Types
// ============================================================================

export interface BuildHistoryItem {
  _id: string;
  title: string;
  thumbnail: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
}

export interface AutosaveState {
  // Current build tracking
  currentBuildId: string | null;
  sourceScanId: string | null;
  resumeTitle: string;

  // Save status
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  unsavedChanges: boolean;

  // Build history
  buildHistory: BuildHistoryItem[] | null;
  isLoadingBuildHistory: boolean;
}

export interface AutosaveActions {
  // Source tracking
  setSourceScanId: (id: string | null) => void;
  setResumeTitle: (title: string) => void;

  // Build CRUD
  createNewBuild: () => Promise<string | null>;
  updateBuild: () => Promise<boolean>;
  saveImmediately: () => Promise<boolean>;
  fetchBuildHistory: () => Promise<boolean>;
  loadBuildById: (id: string) => Promise<boolean>;
  deleteBuild: (id: string) => Promise<boolean>;

  // Autosave control
  triggerAutosave: () => void;
  cancelPendingAutosave: () => void;
  retryFailedSave: () => Promise<boolean>;

  // State management
  markAsUnsaved: () => void;
  clearAutosaveState: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const AUTOSAVE_DELAY = 2000; // 2 seconds
const UNSAVED_CHANGES_KEY = "resumer_unsaved_changes";
const AUTOSAVE_DATA_KEY = "resumer_autosave_backup";

// ============================================================================
// Autosave timeout tracking (module level to persist across re-renders)
// ============================================================================

let autosaveTimeoutId: ReturnType<typeof setTimeout> | null = null;

// ============================================================================
// Initial State
// ============================================================================

export const autosaveInitialState: AutosaveState = {
  currentBuildId: null,
  sourceScanId: null,
  resumeTitle: "Untitled Resume",
  isSaving: false,
  lastSaved: null,
  saveError: null,
  unsavedChanges: false,
  buildHistory: null,
  isLoadingBuildHistory: false,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createAutosaveSlice: StateCreator<
  AutosaveState & AutosaveActions & { sections: unknown; sectionOrder: unknown; style: unknown; template: unknown },
  [],
  [],
  AutosaveState & AutosaveActions
> = (set, get) => ({
  ...autosaveInitialState,

  // Set source scan ID (called before loading optimized resume)
  setSourceScanId: (id: string | null) => {
    set({ sourceScanId: id });
  },

  // Set resume title
  setResumeTitle: (title: string) => {
    set({ resumeTitle: title, unsavedChanges: true });
    // Save to localStorage as backup
    localStorage.setItem(UNSAVED_CHANGES_KEY, "true");
    // Trigger autosave
    get().triggerAutosave();
  },

  // Create a new build in the database
  createNewBuild: async () => {
    const { sourceScanId, resumeTitle } = get();

    set({ isSaving: true, saveError: null });

    try {
      const response = await axiosInstance.post<
        ApiResponse<{ _id: string; title: string }>
      >("/resume/build", {
        title: resumeTitle,
        sourceScanId: sourceScanId || undefined,
      });

      const newBuild = response.data.data;
      set({
        currentBuildId: newBuild._id,
        isSaving: false,
        lastSaved: new Date(),
        unsavedChanges: false,
      });

      // Clear localStorage backup
      localStorage.removeItem(UNSAVED_CHANGES_KEY);
      localStorage.removeItem(AUTOSAVE_DATA_KEY);

      return newBuild._id;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, "Failed to create resume");
      set({ isSaving: false, saveError: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  },

  // Update existing build
  updateBuild: async () => {
    const { currentBuildId, resumeTitle, sections, sectionOrder, style, template } = get();

    if (!currentBuildId) {
      // No existing build, create one first
      const newId = await get().createNewBuild();
      if (!newId) return false;
    }

    set({ isSaving: true, saveError: null });

    try {
      // Transform store state to API payload
      const payload = {
        title: resumeTitle,
        templateId: template,
        content: transformSectionsToContent(sections, sectionOrder),
        layout: { sectionOrder },
      };

      await axiosInstance.put(`/resume/build/${get().currentBuildId}`, payload);

      set({
        isSaving: false,
        lastSaved: new Date(),
        unsavedChanges: false,
        saveError: null,
      });

      // Clear localStorage backup
      localStorage.removeItem(UNSAVED_CHANGES_KEY);
      localStorage.removeItem(AUTOSAVE_DATA_KEY);

      return true;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, "Failed to save resume");
      set({ isSaving: false, saveError: errorMessage });

      // Store backup in localStorage
      localStorage.setItem(UNSAVED_CHANGES_KEY, "true");
      localStorage.setItem(
        AUTOSAVE_DATA_KEY,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          buildId: get().currentBuildId,
        })
      );

      // Show error toast with custom element for retry functionality
      toast.custom((t) =>
        React.createElement(
          'div',
          {
            className: 'flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer',
            onClick: () => {
              get().retryFailedSave();
              toast.dismiss(t.id);
            },
          },
          React.createElement('span', null, `${errorMessage}. Click to retry.`)
        ),
        {
          duration: 10000,
        }
      );

      return false;
    }
  },

  // Save immediately (for unmount cleanup)
  saveImmediately: async () => {
    // Cancel any pending autosave
    get().cancelPendingAutosave();

    const { unsavedChanges, currentBuildId } = get();

    // Only save if there are unsaved changes
    if (!unsavedChanges) return true;

    // If no build exists yet, create one
    if (!currentBuildId) {
      const newId = await get().createNewBuild();
      if (!newId) return false;
    }

    return await get().updateBuild();
  },

  // Fetch build history
  fetchBuildHistory: async () => {
    set({ isLoadingBuildHistory: true });

    try {
      const response = await axiosInstance.get<ApiResponse<BuildHistoryItem[]>>(
        "/resume/build/history"
      );
      set({ buildHistory: response.data.data, isLoadingBuildHistory: false });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch build history"));
      set({ isLoadingBuildHistory: false });
      return false;
    }
  },

  // Load a specific build by ID
  loadBuildById: async (id: string) => {
    set({ isSaving: true }); // Use isSaving as loading indicator

    try {
      const response = await axiosInstance.get<
        ApiResponse<{
          _id: string;
          title: string;
          templateId: string;
          content: Record<string, unknown>;
          layout: { sectionOrder: string[] };
          sourceScanId?: string;
        }>
      >(`/resume/build/${id}`);

      const build = response.data.data;

      // Transform API content back to store format
      // This will be called from the component that has access to full store
      set({
        currentBuildId: build._id,
        resumeTitle: build.title,
        sourceScanId: build.sourceScanId || null,
        isSaving: false,
        lastSaved: new Date(),
        unsavedChanges: false,
      });

      // Return true - the component will handle transforming content to sections
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load resume"));
      set({ isSaving: false });
      return false;
    }
  },

  // Delete a build
  deleteBuild: async (id: string) => {
    const { buildHistory } = get();

    // Optimistic update
    if (buildHistory) {
      set({ buildHistory: buildHistory.filter((b) => b._id !== id) });
    }

    try {
      await axiosInstance.delete(`/resume/build/${id}`);
      toast.success("Resume deleted successfully");

      // If deleted the current build, clear the ID
      if (get().currentBuildId === id) {
        set({ currentBuildId: null });
      }

      return true;
    } catch (error) {
      // Rollback on error
      set({ buildHistory });
      toast.error(getApiErrorMessage(error, "Failed to delete resume"));
      return false;
    }
  },

  // Trigger debounced autosave
  triggerAutosave: () => {
    // Cancel any existing timeout
    if (autosaveTimeoutId) {
      clearTimeout(autosaveTimeoutId);
    }

    // Set unsaved flag
    set({ unsavedChanges: true });
    localStorage.setItem(UNSAVED_CHANGES_KEY, "true");

    // Schedule new autosave
    autosaveTimeoutId = setTimeout(async () => {
      autosaveTimeoutId = null;
      await get().updateBuild();
    }, AUTOSAVE_DELAY);
  },

  // Cancel pending autosave
  cancelPendingAutosave: () => {
    if (autosaveTimeoutId) {
      clearTimeout(autosaveTimeoutId);
      autosaveTimeoutId = null;
    }
  },

  // Retry failed save
  retryFailedSave: async () => {
    set({ saveError: null });
    return await get().updateBuild();
  },

  // Mark state as unsaved (called when content changes)
  markAsUnsaved: () => {
    set({ unsavedChanges: true });
    localStorage.setItem(UNSAVED_CHANGES_KEY, "true");
  },

  // Clear autosave state (for reset/new resume)
  clearAutosaveState: () => {
    get().cancelPendingAutosave();
    set({
      currentBuildId: null,
      sourceScanId: null,
      resumeTitle: "Untitled Resume",
      isSaving: false,
      lastSaved: null,
      saveError: null,
      unsavedChanges: false,
    });
    localStorage.removeItem(UNSAVED_CHANGES_KEY);
    localStorage.removeItem(AUTOSAVE_DATA_KEY);
  },
});

// ============================================================================
// Helper: Transform store sections to API content format
// ============================================================================

function transformSectionsToContent(
  sections: unknown,
  sectionOrder: unknown
): Record<string, unknown> {
  // Type guard for sections array
  if (!Array.isArray(sections)) return {};

  const content: Record<string, unknown> = {};

  for (const section of sections) {
    if (!section || typeof section !== "object") continue;

    const { type, data } = section as { type?: string; data?: unknown };
    if (!type || !data) continue;

    switch (type) {
      case "header":
        content.personalInfo = data;
        break;
      case "summary":
        content.summary = data;
        break;
      case "education":
        content.education = (data as { items?: unknown[] })?.items || [];
        break;
      case "experience":
        content.experience = (data as { items?: unknown[] })?.items || [];
        break;
      case "projects":
        content.projects = (data as { items?: unknown[] })?.items || [];
        break;
      case "skills":
        content.skills = data;
        break;
      case "certifications":
        content.certifications = (data as { items?: unknown[] })?.items || [];
        break;
      case "achievements":
        content.achievements = (data as { items?: unknown[] })?.items || [];
        break;
      case "extracurricular":
        content.extracurricular = (data as { items?: unknown[] })?.items || [];
        break;
    }
  }

  return content;
}
