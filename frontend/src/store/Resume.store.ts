import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { toast } from "react-hot-toast";
import type {
  IAnalysisResult,
  IOptimizationData,
  ApiResponse,
} from "@resumer/shared-types";
import { useSubscriptionStore } from "./Subscription.store";

/**
 * Resume store state interface
 */
interface ResumeState {
  isAnalyzing: boolean;
  analysisResult: ApiResponse<{ analysisResult: IAnalysisResult }> | null;

  isOptimizing: boolean;
  optimizationResult: IOptimizationData | null; // Deprecated, kept for interface compat if needed
  optimizationResultGeneral: IOptimizationData | null;
  optimizationResultJD: IOptimizationData | null;
}

/**
 * Resume store actions interface
 */
interface ResumeActions {
  handleResumeAnalysis: (selectedFile: File | null) => Promise<void>;
  resetAnalysis: () => void;
  optimizeGeneral: () => Promise<void>;
  optimizeJD: (jobDescription: string) => Promise<void>;
  setOptimizationResult: (result: IOptimizationData) => void;
}

/**
 * Combined Resume store type
 */
export type ResumeStore = ResumeState & ResumeActions;

/**
 * Initial state for resume store
 */
const initialState: ResumeState = {
  isAnalyzing: false,
  analysisResult: null,
  isOptimizing: false,
  optimizationResult: null,
  optimizationResultGeneral: null,
  optimizationResultJD: null,
};

/**
 * Resume store with typed state and actions
 */
export const useResumeStore = create<ResumeStore>((set) => ({
  ...initialState,

  handleResumeAnalysis: async (selectedFile: File | null) => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    set({ isAnalyzing: true });
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axiosInstance.post<
        ApiResponse<{ analysisResult: IAnalysisResult }>
      >("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ analysisResult: response.data });
      toast.success("Resume analyzed successfully!");
      // Refresh credit count after successful analysis
      useSubscriptionStore.getState().fetchStatus();
    } catch (error) {
      console.error("Error analyzing resume:", error);
      set({ analysisResult: null });
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to analyze resume. Please try again.",
        ),
      );
    } finally {
      // Keep loader for a moment to show 100%
      setTimeout(() => set({ isAnalyzing: false }), 500);
    }
  },

  resetAnalysis: () => set({ analysisResult: null }),

  optimizeGeneral: async () => {
    set({ isOptimizing: true });
    try {
      const response = await axiosInstance.post<
        ApiResponse<{ analysisResult: IOptimizationData }>
      >("/resume/optimize/general");
      const result = response.data.data.analysisResult;
      set({ 
        optimizationResult: result,
        optimizationResultGeneral: result
      });
      toast.success("Resume optimized successfully!");
      // Refresh credit count after successful optimization
      useSubscriptionStore.getState().fetchStatus();
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast.error(getApiErrorMessage(error, "Failed to optimize resume."));
    } finally {
      set({ isOptimizing: false });
    }
  },

  optimizeJD: async (jobDescription: string) => {
    if (!jobDescription) {
      toast.error("Please enter a job description.");
      return;
    }

    set({ isOptimizing: true });
    try {
      const response = await axiosInstance.post<
        ApiResponse<{ analysisResult: IOptimizationData }>
      >("/resume/optimize/jd", { jobDescription });
      const result = response.data.data.analysisResult;
      set({ 
        optimizationResult: result,
        optimizationResultJD: result
      });
      toast.success("Resume optimized for JD successfully!");
      // Refresh credit count after successful JD optimization
      useSubscriptionStore.getState().fetchStatus();
    } catch (error) {
      console.error("Error optimizing resume for JD:", error);
      toast.error(getApiErrorMessage(error, "Failed to optimize resume."));
    } finally {
      set({ isOptimizing: false });
    }
  },

  // Set optimization result directly (used when loading from history)
  setOptimizationResult: (result: IOptimizationData) => {
    set({
      optimizationResult: result,
      optimizationResultGeneral: result,
    });
  },
}));
