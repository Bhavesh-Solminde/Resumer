import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useResumeStore = create((set) => ({
  isAnalyzing: false,
  analysisResult: null,

  handleResumeAnalysis: async (selectedFile) => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    set({ isAnalyzing: true });
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axiosInstance.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ analysisResult: response?.data });
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      set({ analysisResult: null });
      toast.error(
        error.response?.data?.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      // Keep loader for a moment to show 100%
      setTimeout(() => set({ isAnalyzing: false }), 500);
    }
  },

  /*It appears that resetAnalysis is currently not used anywhere in your project other than where it is defined in Resume.store.js.
It seems to be a helper action intended for clearing the analysis results (perhaps when starting a new scan or leaving the page), but it hasn't been implemented in any components yet.
If you intended to use it, a common place would be in Analyze.jsx or UploadResumeCard.jsx to
clear the previous results when the user clicks a "Start Over" or "Upload New" button.*/
  resetAnalysis: () => set({ analysisResult: null }),
}));
