import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { toast } from "react-hot-toast";
import type {
  IAnalysisResult,
  IOptimizationData,
  ApiResponse,
} from "@resumer/shared-types";

/**
 * Resume store state interface
 */
interface ResumeState {
  isAnalyzing: boolean;
  analysisResult: ApiResponse<{ analysisResult: IAnalysisResult }> | null;
  resumePdf: FormData | null;

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
  loadFakeData: () => void;
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
  resumePdf: null,
  isOptimizing: false,
  optimizationResult: null,
  optimizationResultGeneral: null,
  optimizationResultJD: null,
};

/**
 * Demo data for testing optimization UI
 */
const DEMO_OPTIMIZATION_RESULT: IOptimizationData = {
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
  optimizedResume: {
    header: {
      fullName: "Aarav Patel",
      title: "Software Engineer",
      email: "aarav.patel@email.com",
      phone: "+1 555 123 4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/aaravpatel",
      website: "aaravpatel.dev",
    },
    summary: {
      content:
        "Ambitious Computer Science graduate with a strong foundation in Java and Python, seeking a Software Engineer role to leverage problem-solving skills. Proven ability to collaborate in agile teams and deliver high-quality code.",
    },
    experience: [
      {
        id: "exp-1",
        title: "Software Engineering Intern",
        company: "TechSolutions Inc.",
        location: "San Francisco, CA",
        startDate: "06/2024",
        endDate: "08/2024",
        description: "Full-stack development internship",
        bullets: [
          "Collaborated with a team of 5 developers to build and maintain web applications using JavaScript and HTML/CSS",
          "Resolved 20+ critical UI bugs, improving application stability by 15%",
          "Gained hands-on experience with modern web frameworks and version control (Git)",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "08/2020",
        endDate: "05/2024",
        gpa: "3.7/4.0",
        description:
          "Relevant coursework: Data Structures, Algorithms, Database Systems",
      },
    ],
    projects: [
      {
        id: "proj-1",
        name: "Library Management System",
        subtitle: "Java, SQL, Spring Boot",
        date: "03/2024",
        description: "Full-stack library management application",
        bullets: [
          "Designed and implemented a comprehensive Library Management System allowing 500+ users to track book inventory in real-time",
          "Architected a normalized SQL database schema to ensure data integrity and optimize query performance by 30%",
        ],
        link: "github.com/aarav/library-system",
      },
    ],
    skills: {
      title: "Technical Skills",
      items: [
        "Java",
        "Python",
        "JavaScript",
        "React",
        "Node.js",
        "SQL",
        "Git",
        "Spring Boot",
      ],
    },
    certifications: [],
    achievements: [],
    extracurricular: [],
  },
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

    // Save pdf for later optimizing
    set({ resumePdf: formData });

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
    } catch (error) {
      console.error("Error optimizing resume for JD:", error);
      toast.error(getApiErrorMessage(error, "Failed to optimize resume."));
    } finally {
      set({ isOptimizing: false });
    }
  },

  loadFakeData: () => {
    set({ 
      optimizationResult: DEMO_OPTIMIZATION_RESULT,
      optimizationResultGeneral: DEMO_OPTIMIZATION_RESULT, 
      optimizationResultJD: DEMO_OPTIMIZATION_RESULT
    });
    toast.success("Demo data loaded for Aarav Patel!");
  },

  // Set optimization result directly (used when loading from history)
  setOptimizationResult: (result: IOptimizationData) => {
    set({
      optimizationResult: result,
      optimizationResultGeneral: result,
    });
  },
}));
