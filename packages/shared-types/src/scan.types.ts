/**
 * Resume Scan Types
 * Types for analyzed/optimized resume scans
 */

import type { IAnalysisResult, IOptimizationResult } from "./api.types.js";

/**
 * Resume scan type discriminant
 */
export type ResumeScanType = "analysis" | "optimization";

/**
 * Base resume scan interface
 */
export interface IResumeScan {
  _id: string;
  originalName: string;
  pdfUrl: string;
  thumbnail: string | null;
  owner: string;
  atsScore: number;
  resumeText: string;
  analysisResult: IAnalysisResult | IOptimizationResult;
  type: ResumeScanType;
  gOptimized: string;
  jdOptimized: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Analysis scan (discriminated)
 */
export interface IAnalysisScan
  extends Omit<IResumeScan, "type" | "analysisResult"> {
  type: "analysis";
  analysisResult: IAnalysisResult;
}

/**
 * Optimization scan (discriminated)
 */
export interface IOptimizationScan
  extends Omit<IResumeScan, "type" | "analysisResult"> {
  type: "optimization";
  analysisResult: IOptimizationResult;
}

/**
 * Resume scan for history list (lightweight)
 */
export interface IResumeScanSummary {
  _id: string;
  originalName: string;
  thumbnail: string | null;
  atsScore: number;
  type: ResumeScanType;
  createdAt: string;
}

/**
 * Create scan request (for analyze endpoint)
 * Note: File type is browser-specific, use FormData in actual implementation
 */
export interface ICreateScanRequest {
  file: Blob;
}

/**
 * Optimize request with job description
 * Note: File type is browser-specific, use FormData in actual implementation
 */
export interface IOptimizeRequest {
  file: Blob;
  jobDescription: string;
}
