import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { toast } from "react-hot-toast";
import type {
  IResumeScan,
  IResumeScanSummary,
  ApiResponse,
} from "@resumer/shared-types";

/**
 * History store state interface
 */
interface HistoryState {
  // Analysis history (lightweight)
  isLoadingAnalysis: boolean;
  analysisHistory: IResumeScanSummary[] | null;

  // Optimization history (lightweight)
  isLoadingOptimization: boolean;
  optimizationHistory: IResumeScanSummary[] | null;

  // Legacy: Combined history (for backward compatibility)
  isLoadingHistory: boolean;
  userResumeHistory: IResumeScanSummary[] | null;

  // Details state (heavy - for modal viewing)
  isLoadingDetails: boolean;
  selectedScan: IResumeScan | null;

  // Delete state
  isDeleting: boolean;
}

/**
 * History store actions interface
 */
interface HistoryActions {
  // Fetch actions
  resumeScanHistory: () => Promise<boolean>;
  fetchAnalysisHistory: () => Promise<boolean>;
  fetchOptimizationHistory: () => Promise<boolean>;
  fetchScanDetails: (id: string) => Promise<boolean>;

  // Mutation actions
  deleteScan: (id: string, type: "analysis" | "optimization") => Promise<boolean>;
  addToHistoryList: (scan: IResumeScanSummary, type: "analysis" | "optimization") => void;

  // Cleanup
  clearSelectedScan: () => void;
}

/**
 * Combined History store type
 */
export type HistoryStore = HistoryState & HistoryActions;

/**
 * Initial state for history store
 */
const initialState: HistoryState = {
  isLoadingAnalysis: false,
  analysisHistory: null,
  isLoadingOptimization: false,
  optimizationHistory: null,
  isLoadingHistory: false,
  userResumeHistory: null,
  isLoadingDetails: false,
  selectedScan: null,
  isDeleting: false,
};

/**
 * History store with typed state and actions
 */
export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...initialState,

  // Legacy: Fetch all history (backward compatibility)
  resumeScanHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const res = await axiosInstance.get<ApiResponse<IResumeScanSummary[]>>(
        "/profile/history"
      );
      set({ userResumeHistory: res.data.data });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch scan history"));
      return false;
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  // Fetch analysis history only
  fetchAnalysisHistory: async () => {
    set({ isLoadingAnalysis: true });
    try {
      const res = await axiosInstance.get<ApiResponse<IResumeScanSummary[]>>(
        "/profile/history?type=analysis"
      );
      set({ analysisHistory: res.data.data });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch analysis history"));
      return false;
    } finally {
      set({ isLoadingAnalysis: false });
    }
  },

  // Fetch optimization history only
  fetchOptimizationHistory: async () => {
    set({ isLoadingOptimization: true });
    try {
      const res = await axiosInstance.get<ApiResponse<IResumeScanSummary[]>>(
        "/profile/history?type=optimization"
      );
      set({ optimizationHistory: res.data.data });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch optimization history"));
      return false;
    } finally {
      set({ isLoadingOptimization: false });
    }
  },

  // Fetch single scan details (heavy) - triggered on click
  fetchScanDetails: async (id: string) => {
    // If we already have this scan loaded, don't re-fetch (cache optimization)
    const currentScan = get().selectedScan;
    if (currentScan && currentScan._id === id) return true;

    set({ isLoadingDetails: true, selectedScan: null });
    try {
      const res = await axiosInstance.get<ApiResponse<IResumeScan>>(
        `/profile/${id}`
      );
      set({ selectedScan: res.data.data });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch scan details"));
      return false;
    } finally {
      set({ isLoadingDetails: false });
    }
  },

  // Delete a scan with optimistic UI update
  deleteScan: async (id: string, type: "analysis" | "optimization") => {
    set({ isDeleting: true });

    // Optimistic: Remove from local state immediately
    const { analysisHistory, optimizationHistory, userResumeHistory } = get();

    if (type === "analysis" && analysisHistory) {
      set({ analysisHistory: analysisHistory.filter((s) => s._id !== id) });
    } else if (type === "optimization" && optimizationHistory) {
      set({ optimizationHistory: optimizationHistory.filter((s) => s._id !== id) });
    }

    // Also update legacy userResumeHistory
    if (userResumeHistory) {
      set({ userResumeHistory: userResumeHistory.filter((s) => s._id !== id) });
    }

    try {
      await axiosInstance.delete(`/profile/${id}`);
      toast.success("Scan deleted successfully");
      return true;
    } catch (error) {
      // Rollback on error
      set({
        analysisHistory: type === "analysis" ? analysisHistory : get().analysisHistory,
        optimizationHistory: type === "optimization" ? optimizationHistory : get().optimizationHistory,
        userResumeHistory,
      });
      toast.error(getApiErrorMessage(error, "Failed to delete scan"));
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Optimistic add to history list (called after new analysis/optimization)
  addToHistoryList: (scan: IResumeScanSummary, type: "analysis" | "optimization") => {
    const { analysisHistory, optimizationHistory, userResumeHistory } = get();

    if (type === "analysis") {
      set({
        analysisHistory: analysisHistory ? [scan, ...analysisHistory] : [scan],
      });
    } else {
      set({
        optimizationHistory: optimizationHistory ? [scan, ...optimizationHistory] : [scan],
      });
    }

    // Also update legacy userResumeHistory
    set({
      userResumeHistory: userResumeHistory ? [scan, ...userResumeHistory] : [scan],
    });
  },

  // Clear details (cleanup)
  clearSelectedScan: () => {
    set({ selectedScan: null });
  },
}));
