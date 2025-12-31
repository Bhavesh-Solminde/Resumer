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
  // List state (lightweight)
  isLoadingHistory: boolean;
  userResumeHistory: IResumeScanSummary[] | null;

  // Details state (heavy)
  isLoadingDetails: boolean;
  selectedScan: IResumeScan | null;
}

/**
 * History store actions interface
 */
interface HistoryActions {
  resumeScanHistory: () => Promise<boolean>;
  fetchScanDetails: (id: string) => Promise<boolean>;
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
  isLoadingHistory: false,
  userResumeHistory: null,
  isLoadingDetails: false,
  selectedScan: null,
};

/**
 * History store with typed state and actions
 */
export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...initialState,

  // Fetch the list (lightweight)
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

  // Clear details (cleanup)
  clearSelectedScan: () => {
    set({ selectedScan: null });
  },
}));
