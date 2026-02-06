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
 * Base resume scan interface (frontend-safe version with string IDs)
 */
export interface IResumeScan {
  _id: string;
  originalName: string;
  contentHash?: string | null;
  pdfUrl: string;
  thumbnail: string | null;
  owner: string;
  atsScore: number;
  resumeText: string;
  analysisResult: IAnalysisResult | IOptimizationResult;
  type: ResumeScanType;
  gOptimized: IOptimizationResult | null;
  jdOptimized: IOptimizationResult | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Analysis scan (discriminated)
 *
 * ⚠️ ISSUE: Extends IResumeScan which is commented out; also never imported
 * TODO: Uncomment when IResumeScan is fixed
 */
// export interface IAnalysisScan
//   extends Omit<IResumeScan, "type" | "analysisResult"> {
//   type: "analysis";
//   analysisResult: IAnalysisResult;
// }

/**
 * Optimization scan (discriminated)
 *
 * ⚠️ ISSUE: Extends IResumeScan which is commented out; also never imported
 * TODO: Uncomment when IResumeScan is fixed
 */
// export interface IOptimizationScan
//   extends Omit<IResumeScan, "type" | "analysisResult"> {
//   type: "optimization";
//   analysisResult: IOptimizationResult;
// }

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
