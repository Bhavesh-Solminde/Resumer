/**
 * API Response Types
 * Generic wrapper for all API responses
 */

/**
 * Standard API response wrapper
 * @template T - The type of data payload
 */
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * Analysis result from AI resume analysis
 */
export interface IAnalysisResult {
  score: number;
  summary: string;
  key_skills: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  actionable_feedback: string[];
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
export interface IOptimizationResult {
  ats_score_before: number;
  ats_score_after: number;
  optimization_summary: string;
  red_vs_green_comparison: IComparisonItem[];
  missing_keywords_added?: string[];
}

/**
 * Pagination metadata for list endpoints
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 * @template T - The type of items in the list
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: IPaginationMeta;
}

/**
 * Error response structure
 */
export interface IErrorResponse {
  statusCode: number;
  message: string;
  success: false;
  errors?: string[];
  stack?: string;
}
