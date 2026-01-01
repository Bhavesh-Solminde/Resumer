import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useHistoryStore = create((set, get) => ({
  // --- LIST STATE (Lightweight) ---
  isLoadingHistory: false,
  userResumeHistory: null, // Only contains: _id, thumbnail, score, originalName, createdAt

  // --- DETAILS STATE (Heavy) ---
  isLoadingDetails: false,
  selectedScan: null, // Will contain: resumeText, analysisResult, etc.

  // 1. Fetch the List (Lightweight)
  resumeScanHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const res = await axiosInstance.get(`/profile/history`);

      set({ userResumeHistory: res.data.data });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch scan history"
      );
      return false;
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  // 2. Fetch Single Scan Details (Heavy) - triggered on click
  fetchScanDetails: async (id) => {
    // If we already have this scan loaded, don't re-fetch (Optional cache optimization)
    const currentScan = get().selectedScan;
    if (currentScan && currentScan._id === id) return true;

    set({ isLoadingDetails: true, selectedScan: null }); // Clear previous details while loading
    try {
      const res = await axiosInstance.get(`/profile/${id}`);
      set({ selectedScan: res.data.data });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch scan details"
      );
      return false;
    } finally {
      set({ isLoadingDetails: false });
    }
  },

  // 3. Clear Details (Cleanup)
  clearSelectedScan: () => {
    set({ selectedScan: null });
  },
}));
