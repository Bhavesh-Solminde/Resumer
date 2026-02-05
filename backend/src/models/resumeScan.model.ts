import mongoose, { Document, Schema, Types } from "mongoose";
import type { IOptimizationData } from "@resumer/shared-types";

/**
 * Resume scan analysis result interface
 */
export interface IAnalysisResult {
  [key: string]: unknown;
}

/**
 * Resume scan document interface
 */

export interface IResumeScan {
  originalName: string;
  contentHash?: string | null;
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
    contentHash: {
      type: String, // Hash of uploaded content or extracted text
      default: null,
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
// Content hash lookup for same-resume matching
ResumeScanSchema.index({ owner: 1, contentHash: 1, createdAt: -1 });

const ResumeScan = mongoose.model<IResumeScan>("ResumeScan", ResumeScanSchema);
export default ResumeScan;
