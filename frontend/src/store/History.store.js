import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
export const useHistoryStore = create((set, get) => ({
  isLoadingHistory: false,
  userResumeHistory: null,
  resumeScanHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const res = await axiosInstance.get(`/profile/history`);
      if (!res) {
        toast.error("Backend not responding");
      }
      set({ userResumeHistory: res.data.data });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "failed to fetch the resume history"
      );
    } finally {
      set({ isLoadingHistory: false });
    }
  },
}));
