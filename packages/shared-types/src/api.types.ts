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
 * Optimization result from AI resume optimization (for display/comparison)
 */
export interface IOptimizationResult {
  ats_score_before: number;
  ats_score_after: number;
  optimization_summary: string;
  red_vs_green_comparison: IComparisonItem[];
  missing_keywords_added?: string[];
}

/**
 * Full optimization data stored in DB (includes optimizedResume)
 */
export interface IOptimizationData {
  ats_score_before: number;
  ats_score_after: number;
  optimization_summary: string;
  red_vs_green_comparison: IComparisonItem[];
  missing_keywords_added?: string[];
  optimizedResume: IOptimizedResume;
}

/**
 * TODO: Implement pagination for list endpoints (GET /api/resumes, GET /api/scans)
 * Uncomment when pagination is added to API controllers
 */
// export interface IPaginationMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// export interface PaginatedResponse<T> {
//   items: T[];
//   pagination: IPaginationMeta;
// }

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
