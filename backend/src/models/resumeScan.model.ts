import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Resume scan analysis result interface
 */
export interface IAnalysisResult {
  [key: string]: unknown;
}

/**
 * Resume scan document interface
 */
/**
 * Optimized resume section structure (from AI optimization)
 */
export interface IOptimizedResume {
  header: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: { content: string };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    subtitle: string;
    date: string;
    description: string;
    bullets: string[];
    link: string;
  }>;
  skills: { title: string; items: string[] };
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }>;
  extracurricular: Array<{
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: string[];
  }>;
}

/**
 * Comparison item for before/after optimization
 */
export interface IComparisonItem {
  section: string;
  original_text: string;
  optimized_text: string;
  explanation: string;
}

/**
 * Optimization result from AI resume optimization
 */
export interface IOptimizationData {
  ats_score_before: number;
  ats_score_after: number;
  optimization_summary: string;
  red_vs_green_comparison: IComparisonItem[];
  missing_keywords_added?: string[];
  optimizedResume: IOptimizedResume;
}

export interface IResumeScan {
  originalName: string;
  pdfUrl: string;
  thumbnail: string | null;
  owner: Types.ObjectId;
  atsScore: number;
  resumeText: string;
  analysisResult: IAnalysisResult;
  type: "analysis" | "optimization";
  gOptimized: IOptimizationData | null;
  jdOptimized: IOptimizationData | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resume scan document type
 */
export type ResumeScanDocument = Document<Types.ObjectId> & IResumeScan;

const ResumeScanSchema = new Schema<IResumeScan>(
  {
    originalName: {
      type: String, // e.g., "Bhavesh_Resume_Final.pdf"
      required: true,
    },
    pdfUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Links back to your User model
      required: true,
    },
    atsScore: {
      type: Number, // e.g., 85
      required: true,
    },
    resumeText: {
      type: String, // Extracted text from PDF
    },
    // We store the full AI JSON response here
    analysisResult: {
      type: Object, // This allows flexibility for the JSON structure
      required: true,
    },
    type: {
      type: String,
      enum: ["analysis", "optimization"],
      default: "analysis",
    },
    gOptimized: {
      type: Object,
      default: null,
    },
    jdOptimized: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true },
);

// Compound index for faster history queries (filtering by owner, sorting by date)
ResumeScanSchema.index({ owner: 1, createdAt: -1 });

const ResumeScan = mongoose.model<IResumeScan>("ResumeScan", ResumeScanSchema);
export default ResumeScan;
