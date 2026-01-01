import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useResumeStore = create((set) => ({
  isAnalyzing: false,
  analysisResult: null,
  resumePdf: null,

  handleResumeAnalysis: async (selectedFile) => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    set({ isAnalyzing: true });
    const formData = new FormData();
    formData.append("resume", selectedFile);

    //saving pdf for later optimizing
    set({ resumePdf: formData });

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

  isOptimizing: false,
  optimizationResult: null,

  optimizeGeneral: async () => {
    set({ isOptimizing: true });
    try {
      const response = await axiosInstance.post("/resume/optimize/general");
      set({ optimizationResult: response.data?.data?.analysisResult });
      toast.success("Resume optimized successfully!");
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast.error(
        error.response?.data?.message || "Failed to optimize resume."
      );
    } finally {
      set({ isOptimizing: false });
    }
  },

  optimizeJD: async (jobDescription) => {
    if (!jobDescription) {
      toast.error("Please enter a job description.");
      return;
    }
    set({ isOptimizing: true });
    try {
      const response = await axiosInstance.post("/resume/optimize/jd", {
        jobDescription,
      });
      set({ optimizationResult: response.data?.data?.analysisResult });
      toast.success("Resume optimized for JD successfully!");
    } catch (error) {
      console.error("Error optimizing resume for JD:", error);
      toast.error(
        error.response?.data?.message || "Failed to optimize resume."
      );
    } finally {
      set({ isOptimizing: false });
    }
  },

  loadFakeData: () => {
    set({
      optimizationResult: {
        ats_score_before: 52,
        ats_score_after: 94,
        optimization_summary:
          "Optimized the resume for Aarav Patel by transforming passive descriptions into impact-driven statements. Added specific technical keywords (React, Node.js, MongoDB) and quantified achievements to improve ATS ranking and readability.",
        red_vs_green_comparison: [
          {
            section: "Professional Summary",
            original_text:
              "I am a fresh graduate looking for a software engineer role. I know Java and Python and want to learn more. I am hard working and a good team player.",
            optimized_text:
              "Ambitious Computer Science graduate with a strong foundation in Java and Python, seeking a Software Engineer role to leverage problem-solving skills. Proven ability to collaborate in agile teams and deliver high-quality code. Committed to continuous learning and contributing to scalable software solutions.",
            explanation:
              "Replaced generic traits with professional attributes and specific career goals. Highlighted 'Agile' and 'Scalable solutions' as key industry terms.",
          },
          {
            section: "Experience - Intern at TechSolutions",
            original_text:
              "Worked as an intern. Helped the team with coding tasks. Fixed some bugs in the app. Learned about web development.",
            optimized_text:
              "Collaborated with a team of 5 developers to build and maintain web applications using JavaScript and HTML/CSS. Resolved 20+ critical UI bugs, improving application stability by 15%. Gained hands-on experience with modern web frameworks and version control (Git).",
            explanation:
              "Quantified the impact (20+ bugs, 15% stability) and specified the technologies used. Changed 'Helped' to 'Collaborated' and 'Resolved'.",
          },
          {
            section: "Project - Library Management System",
            original_text:
              "Created a system to manage books in a library. Users can borrow and return books. Used SQL database.",
            optimized_text:
              "Designed and implemented a comprehensive Library Management System allowing 500+ users to track book inventory in real-time. Architected a normalized SQL database schema to ensure data integrity and optimize query performance by 30%.",
            explanation:
              "Added scale (500+ users) and technical details (Normalized schema, Query performance). Transformed a simple description into an engineering achievement.",
          },
        ],
      },
    });
    toast.success("Demo data loaded for Aarav Patel!");
  },
}));
