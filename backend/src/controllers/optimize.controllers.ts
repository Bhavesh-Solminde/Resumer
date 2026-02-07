import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ResumeScan from "../models/resumeScan.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ENV from "../env.js";
import { calculateATSScore } from "../utils/atsScore.js";
import type { IQualityMetrics } from "../utils/atsScore.js";
import type { IOptimizationData } from "@resumer/shared-types";
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types - Shared interfaces
// ============================================================================

type IOptimizationResult = IOptimizationData;

interface OptimizeJdBody {
  jobDescription?: string;
  scanId?: string; // Optional: optimize a specific historical scan
}

/**
 * Raw response from Gemini AI for general optimization (only AFTER metrics — before comes from stored analysis)
 */
interface IGeminiOptimizeResponse {
  quality_metrics_after: IQualityMetrics;  // Metrics for OPTIMIZED resume
  optimization_summary: string;
  red_vs_green_comparison: Array<{
    section: string;
    original_text: string;
    optimized_text: string;
    explanation: string;
  }>;
  optimizedResume: IOptimizationResult["optimizedResume"];
}

/**
 * Raw response from Gemini AI for JD optimization (only AFTER metrics)
 */
interface IGeminiJdOptimizeResponse {
  quality_metrics_after: IQualityMetrics;
  optimization_summary: string;
  red_vs_green_comparison: Array<{
    section: string;
    original_text: string;
    optimized_text: string;
    explanation: string;
  }>;
  optimizedResume: IOptimizationResult["optimizedResume"];
  critical_missing_skills: string[];
  jd_keywords_found: string[];
}

// ============================================================================
// Setup Google Gemini AI
// ============================================================================

const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

const computeContentHash = (input: Buffer | string): string =>
  createHash("sha256").update(input).digest("hex");

// ============================================================================
// Middleware: Upload to Cloudinary
// ============================================================================

export const uploadToCloudinaryMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.file) return next();

    try {
      const uploadResult = await cloudinaryUpload(req.file.buffer);
      req.cloudinaryResult = uploadResult;
      next();
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      next(error);
    }
  },
);

// ============================================================================
// Helper: Resolve Resume Text and Stored Metrics
// ============================================================================

interface ResumeData {
  resumeText: string;
  contentHash: string | null;
  storedQualityMetrics: IQualityMetrics | null;
  storedAtsScore: number | null;
}

/**
 * Shared logic to resolve resume text and stored quality metrics from three sources:
 * 1. Fresh file upload (req.file)
 * 2. Specific historical scan (scanId)
 * 3. Latest analysis scan fallback
 */
async function resolveResumeTextAndMetrics(
  req: Request<any, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  scanId?: string,
): Promise<ResumeData> {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  let resumeText = "";
  let contentHash: string | null = null;
  let storedQualityMetrics: IQualityMetrics | null = null;
  let storedAtsScore: number | null = null;

  if (req.file) {
    // Priority 1: Fresh file upload
    try {
      const pdfData = await pdf(req.file.buffer);
      resumeText = pdfData.text;
    } catch {
      throw new ApiError(400, "Failed to parse PDF file");
    }
    contentHash = computeContentHash(req.file.buffer);
    // Find the corresponding analysis scan to get stored quality_metrics
    const analysisScan = await ResumeScan.findOne({
      owner: userId,
      contentHash,
      type: "analysis",
    }).sort({ createdAt: -1 });
    if (analysisScan?.analysisResult) {
      const result = analysisScan.analysisResult as Record<string, unknown>;
      if (result.quality_metrics) {
        storedQualityMetrics = result.quality_metrics as IQualityMetrics;
        storedAtsScore = analysisScan.atsScore;
      }
    }
  } else if (scanId) {
    // Priority 2: Optimize a specific historical scan by ID
    const targetScan = await ResumeScan.findOne({
      _id: scanId,
      owner: userId,
    });
    if (!targetScan) {
      throw new ApiError(404, "Scan not found or does not belong to you.");
    }
    if (!targetScan.resumeText) {
      throw new ApiError(
        400,
        "Resume text not found in this scan. Please re-upload your resume.",
      );
    }
    resumeText = targetScan.resumeText;
    contentHash =
      targetScan.contentHash ||
      (targetScan.resumeText ? computeContentHash(targetScan.resumeText) : null);
    // If the scan itself is an analysis, use its stored metrics directly
    if (targetScan.type === "analysis" && targetScan.analysisResult) {
      const result = targetScan.analysisResult as Record<string, unknown>;
      if (result.quality_metrics) {
        storedQualityMetrics = result.quality_metrics as IQualityMetrics;
        storedAtsScore = targetScan.atsScore;
      }
    } else {
      // Find the analysis scan for the same content
      if (contentHash) {
        const analysisScan = await ResumeScan.findOne({
          owner: userId,
          contentHash,
          type: "analysis",
        }).sort({ createdAt: -1 });
        if (analysisScan?.analysisResult) {
          const result = analysisScan.analysisResult as Record<string, unknown>;
          if (result.quality_metrics) {
            storedQualityMetrics = result.quality_metrics as IQualityMetrics;
            storedAtsScore = analysisScan.atsScore;
          }
        }
      }
    }
  } else {
    // Priority 3: Fall back to latest ANALYSIS scan (not optimization)
    const lastScan = await ResumeScan.findOne({
      owner: userId,
      type: "analysis",
    }).sort({
      createdAt: -1,
    });

    if (!lastScan) {
      throw new ApiError(
        400,
        "No resume found. Please analyze a resume first.",
      );
    }

    if (lastScan.resumeText) {
      resumeText = lastScan.resumeText;
    } else {
      throw new ApiError(
        400,
        "Resume text not found in history. Please re-analyze your resume.",
      );
    }
    contentHash =
      lastScan.contentHash ||
      (lastScan.resumeText ? computeContentHash(lastScan.resumeText) : null);
    // Use quality_metrics from the analysis scan directly
    if (lastScan.analysisResult) {
      const result = lastScan.analysisResult as Record<string, unknown>;
      if (result.quality_metrics) {
        storedQualityMetrics = result.quality_metrics as IQualityMetrics;
        storedAtsScore = lastScan.atsScore;
      }
    }
  }

  if (!resumeText || resumeText.trim().length === 0) {
    throw new ApiError(400, "Could not extract text from resume");
  }

  return { resumeText, contentHash, storedQualityMetrics, storedAtsScore };
}

// ============================================================================
// Controller: Optimize Resume (General)
// ============================================================================

export const optimizeResume = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    console.log("[Optimize] Starting general optimization...");
    
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const scanId = req.body?.scanId || (req.body as { scanId?: string } | undefined)?.scanId;

    console.log("[Optimize] User ID:", req.user._id);
    console.log("[Optimize] Scan ID from body:", scanId);
    console.log("[Optimize] req.body keys:", Object.keys(req.body || {}));

    // Use shared helper to resolve resume text and stored metrics
    const { resumeText, contentHash, storedQualityMetrics, storedAtsScore } =
      await resolveResumeTextAndMetrics(req, scanId);

    // Log whether we have stored metrics (if not, the "before" score will still be consistent
    // because we'll recalculate from analysis-stored data)
    console.log("[Optimize] Stored quality_metrics available:", !!storedQualityMetrics);
    console.log("[Optimize] Stored ATS score:", storedAtsScore);

    const prompt = `
You are an expert Resume Writer.
I will provide you with a resume text.
Your task is to OPTIMIZE the content for impact, clarity, and ATS readability.

CRITICAL INSTRUCTIONS:
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field.
2. Use EXACT field names as specified below.
3. Dates should be in "MM/YYYY" format or "Present".
4. **NO HALLUCINATED METRICS:** Do not invent numbers. If a bullet point is strong but lacks a number, you may add a placeholder like "[X]%" or "[Amount]" for the user to fill in, but DO NOT make up a specific value.
5. **STRONG VERBS:** Replace all weak verbs (e.g., "Helped", "Worked on", "Responsible for") with strong, unique action verbs (e.g., "Engineered", "Spearheaded", "Optimized").
6. **CONCISENESS IS KEY:** Bullet points (especially in Projects and Experience) MUST be concise and punchy. Avoid long paragraphs. Recruiters prefer 1-page resumes, so keep descriptions tight, impactful and professional.
7. **MAINTAIN QUANTITY:** While being concise, DO NOT significantly reduce the total number of bullet points if the previous count was high (15-30 is optimal). Merging too many bullets will lower the score.
8. **FIX ALL ISSUES:** Eliminate weak words, fix spelling errors, add missing sections from the ORIGINAL to improve the score.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "optimization_summary": "Brief summary of improvements (e.g., 'Replaced passive voice with active verbs, standardized date formats').",
  
  "red_vs_green_comparison": [
    {
      "section": "Experience / Projects",
      "original_text": "Weak original bullet (Red)",
      "optimized_text": "Strong rewritten bullet (Green)",
      "explanation": "Why this change improves impact (e.g., 'Changed passive voice to active')."
    }
  ],

  "quality_metrics_after": {
    "is_contact_info_complete": boolean,
    "bullet_points_count": integer,
    "quantified_bullet_points_count": integer,
    "action_verbs_used": ["List", "of", "unique", "strong", "verbs", "in", "OPTIMIZED", "resume"],
    "weak_words_found": [],
    "spelling_errors": [],
    "missing_sections": ["List", "of", "missing", "sections"]
  },

  "optimizedResume": {
    "header": {
      "fullName": "John Doe",
      "title": "Software Engineer",
      "email": "john@example.com",
      "phone": "+1 234 567 890",
      "location": "City, Country",
      "linkedin": "linkedin.com/in/johndoe",
      "website": "johndoe.com"
    },
    "summary": {
      "content": "Optimized professional summary"
    },
    "experience": [
      {
        "id": "uuid-here",
        "title": "Job Title",
        "company": "Company Name",
        "location": "City, Country",
        "startDate": "MM/YYYY",
        "endDate": "Present or MM/YYYY",
        "description": "Brief role description",
        "bullets": ["Optimized bullet 1", "Optimized bullet 2"]
      }
    ],
    "education": [
      {
        "id": "uuid-here",
        "degree": "Degree Name",
        "institution": "University Name",
        "location": "City, Country",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "gpa": "3.8/4.0",
        "description": "Relevant coursework"
      }
    ],
    "projects": [
      {
        "id": "uuid-here",
        "name": "Project Name",
        "subtitle": "Tech Stack",
        "date": "MM/YYYY",
        "description": "Description",
        "bullets": ["Optimized bullet 1", "Optimized bullet 2"],
        "link": "github.com/project"
      }
    ],
    "skills": {
      "title": "Skills",
      "items": ["Skill 1", "Skill 2"]
    },
    "certifications": [
      {
        "id": "uuid-here",
        "name": "Cert Name",
        "issuer": "Issuer",
        "date": "MM/YYYY",
        "expiryDate": "",
        "credentialId": "ABC123"
      }
    ],
    "achievements": [
      {
        "id": "uuid-here",
        "title": "Achievement",
        "description": "Description",
        "date": "MM/YYYY"
      }
    ],
    "extracurricular": [
      {
        "id": "uuid-here",
        "title": "Role",
        "organization": "Org",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "description": "Description",
        "bullets": ["Activity"]
      }
    ]
  }
}

QUALITY METRICS EXTRACTION RULES (Analyze the OPTIMIZED version only):
- quality_metrics_after: Extract from OPTIMIZED resume
- is_contact_info_complete: true if Email, Phone, AND Location are ALL present in optimized header
- bullet_points_count: Total bullet points in Experience AND Projects sections
- quantified_bullet_points_count: Count of bullets with metrics (%, $, numbers) OR placeholders like [X]%, [Amount]
- action_verbs_used: List of unique strong verbs used
- weak_words_found: Should be ZERO or minimal after optimization
- spelling_errors: Should be ZERO after optimization
- missing_sections: List of standard sections still missing

OPTIMIZATION RULES:
- Replace passive voice with active voice
- Maximize the use of strong action verbs to improve the score
- Fix ALL spelling errors found in the original text
- Standardize formatting and date formats
- Add metric placeholders like [X]% where numbers would strengthen the bullet
- ADD missing sections if possible (e.g., Skills, Summary)
- ELIMINATE all weak words

FIELD NAME RULES (CRITICAL):
- Experience: use "title", NOT "role"
- Projects: use "name", NOT "title"
- Education: use "gpa"
- Skills: use flat "items" array

RESUME TEXT:
${resumeText}
    `;

    try {
      console.log("[Optimize] Sending request to Gemini AI...");
      const geminiResult = await model.generateContent(prompt);
      console.log("[Optimize] Gemini AI responded successfully");

      let responseText = "";
      if (typeof geminiResult?.response?.text === "function") {
        responseText = geminiResult.response.text();
      } else if (
        geminiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        responseText =
          geminiResult.response.candidates[0].content.parts[0].text;
      } else {
        console.error("[Optimize] Unexpected Gemini response format:", JSON.stringify(geminiResult, null, 2));
        throw new Error("Unexpected response format from Gemini AI");
      }

      console.log("[Optimize] Response text length:", responseText.length);
      const cleanJson = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("[Optimize] Parsing JSON response...");
      const geminiResponse: IGeminiOptimizeResponse = JSON.parse(cleanJson);
      console.log("[Optimize] JSON parsed successfully");

      // ===================================================================
      // SCORE CALCULATION: Use stored analysis metrics for "before" score
      // This guarantees the "before" score EXACTLY matches the analysis score
      // ===================================================================
      let atsScoreBefore: number;
      let qualityMetricsBefore: IQualityMetrics;

      if (storedQualityMetrics && storedAtsScore !== null) {
        // IDEAL PATH: Use the exact same metrics from the analysis scan
        atsScoreBefore = storedAtsScore;
        qualityMetricsBefore = storedQualityMetrics;
        console.log("[Optimize] Using stored analysis score:", atsScoreBefore);
      } else {
        // FALLBACK: No stored metrics (e.g., old scans before this update)
        // Re-calculate would be non-deterministic, so use a conservative default
        console.warn("[Optimize] No stored quality_metrics found — using Gemini response fallback");
        // If Gemini still returned quality_metrics_before (shouldn't), use it; otherwise estimate
        const fallbackMetrics = (geminiResponse as unknown as { quality_metrics_before?: IQualityMetrics }).quality_metrics_before;
        if (fallbackMetrics) {
          qualityMetricsBefore = fallbackMetrics;
          atsScoreBefore = calculateATSScore(fallbackMetrics);
        } else {
          // Last resort: look up the latest analysis scan's atsScore
          const latestAnalysis = await ResumeScan.findOne({
            owner: req.user!._id,
            type: "analysis",
          }).sort({ createdAt: -1 });
          atsScoreBefore = latestAnalysis?.atsScore ?? 0;
          qualityMetricsBefore = {
            is_contact_info_complete: false,
            bullet_points_count: 0,
            quantified_bullet_points_count: 0,
            action_verbs_used: [],
            weak_words_found: [],
            spelling_errors: [],
            missing_sections: [],
          };
        }
      }

      const atsScoreAfter = calculateATSScore(geminiResponse.quality_metrics_after);

      console.log("[Optimize] General Optimization Scores:");
      console.log("  - Before (from analysis):", atsScoreBefore);
      console.log("  - After (optimized):", atsScoreAfter);
      console.log("  - Improvement:", atsScoreAfter - atsScoreBefore);

      // VALIDATION: Fail only if score strictly decreased
      if (atsScoreAfter < atsScoreBefore) {
        console.error("[Optimize] FAILED: Optimization decreased the score!");
        console.error("  - Before metrics:", JSON.stringify(qualityMetricsBefore, null, 2));
        console.error("  - After metrics:", JSON.stringify(geminiResponse.quality_metrics_after, null, 2));
        throw new ApiError(
          500,
          `Optimization failed to improve resume. Score decreased from ${atsScoreBefore} to ${atsScoreAfter}. Please try again or contact support.`
        );
      }

      // Transform to final optimization result
      const analysisData: IOptimizationResult = {
        ats_score_before: atsScoreBefore,
        ats_score_after: atsScoreAfter,
        optimization_summary: geminiResponse.optimization_summary,
        red_vs_green_comparison: geminiResponse.red_vs_green_comparison,
        optimizedResume: geminiResponse.optimizedResume,
      };

      req.aiAnalysisResult = {
        ...analysisData,
        quality_metrics_before: qualityMetricsBefore,
        quality_metrics_after: geminiResponse.quality_metrics_after,
      } as unknown as Record<string, unknown>;
      req.resumeText = resumeText;
      next();
    } catch (error: unknown) {
      const err = error as { message?: string; stack?: string };
      console.error("[Optimize General] ERROR Details:", {
        message: err.message,
        name: (error as Error).name,
        stack: err.stack,
        fullError: error
      });
      throw new ApiError(
        500,
        err.message || "An error occurred while optimizing the resume",
      );
    }
  },
);

// ============================================================================
// Controller: Optimize Resume for Job Description
// ============================================================================

export const optimizeJd = asyncHandler(
  async (
    req: Request<object, object, OptimizeJdBody>,
    _res: Response,
    next: NextFunction,
  ) => {
    const { jobDescription } = req.body || {};
    const scanId = req.body?.scanId;
    if (!jobDescription) {
      throw new ApiError(400, "Job Description is required");
    }

    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    // Use shared helper to resolve resume text and stored metrics
    const { resumeText, contentHash, storedQualityMetrics, storedAtsScore } =
      await resolveResumeTextAndMetrics(req, scanId);

    console.log("[Optimize JD] Stored quality_metrics available:", !!storedQualityMetrics);
    console.log("[Optimize JD] Stored ATS score:", storedAtsScore);

    const prompt = `
You are an expert Resume Writer and ATS Optimization Specialist.
I will provide you with a resume text AND a Job Description (JD).

Your Goal: Optimize the phrasing of EXISTING experience to match the JD keywords, but DO NOT invent new skills.

CRITICAL TRUTH CONSTRAINTS:
1. **NO LYING:** Do NOT add hard skills (languages, tools, frameworks, certifications) to the optimizedResume if they are not in the original resume
2. **MISSING SKILLS HANDLING:** If the JD requires a skill the user lacks, add it ONLY to critical_missing_skills array, NOT to the resume
3. **PHRASING:** You MAY rewrite existing bullet points to use JD-specific terminology (e.g., changing "Used JS" to "Leveraged JavaScript (ES6+)") as long as facts remain true
4. **DO NOT output ATS scores.** Instead, extract the raw quality metrics for the OPTIMIZED version only
5. **PLACEHOLDERS:** If a bullet point is strong but lacks a number, you may add a placeholder like "[X]%" or "[Amount]".
6. **CONCISENESS IS KEY:** Bullet points (especially in Projects and Experience) MUST be concise and punchy. Avoid long paragraphs. Recruiters prefer 1-page resumes, so keep descriptions tight and impactful.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "quality_metrics_after": {
    "is_contact_info_complete": boolean,
    "bullet_points_count": integer,
    "quantified_bullet_points_count": integer,
    "action_verbs_used": ["strong", "JD-aligned", "verbs"],
    "weak_words_found": [],
    "spelling_errors": [],
    "missing_sections": []
  },
  "jd_keywords_found": ["List", "of", "matched", "keywords", "from", "JD"],
  "optimization_summary": "Brief summary of how the resume was tailored (e.g., 'Aligned terminology with JD, flagged missing AWS skill')",
  "critical_missing_skills": ["List", "of", "skills", "in", "JD", "but", "missing", "in", "resume"],
  "red_vs_green_comparison": [
    {
      "section": "Experience / Projects / Summary",
      "original_text": "The original weak text (Red)",
      "optimized_text": "The JD-aligned version (Green)",
      "explanation": "Why this change improves the match (e.g., 'Renamed React to React.js to match JD keyword')"
    }
  ],
  "optimizedResume": {
    "header": {
      "fullName": "John Doe",
      "title": "JD-aligned title (if honest)",
      "email": "john@example.com",
      "phone": "+1 234 567 890",
      "location": "City, Country",
      "linkedin": "linkedin.com/in/johndoe",
      "website": "johndoe.com"
    },
    "summary": {
      "content": "JD-tailored professional summary"
    },
    "experience": [
      {
        "id": "uuid-here",
        "title": "Job Title",
        "company": "Company Name",
        "location": "City, Country",
        "startDate": "MM/YYYY",
        "endDate": "Present or MM/YYYY",
        "description": "Brief role description",
        "bullets": ["JD-aligned achievement 1", "JD-aligned achievement 2"]
      }
    ],
    "education": [
      {
        "id": "uuid-here",
        "degree": "Degree Name",
        "institution": "University Name",
        "location": "City, Country",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "gpa": "3.8/4.0",
        "description": "Relevant coursework"
      }
    ],
    "projects": [
      {
        "id": "uuid-here",
        "name": "Project Name",
        "subtitle": "Tech Stack",
        "date": "MM/YYYY",
        "description": "Description",
        "bullets": ["JD-aligned feature 1"],
        "link": "github.com/project"
      }
    ],
    "skills": {
      "title": "Skills",
      "items": ["Skill 1", "Skill 2"]
    },
    "certifications": [
      {
        "id": "uuid-here",
        "name": "Cert Name",
        "issuer": "Issuer",
        "date": "MM/YYYY",
        "expiryDate": "",
        "credentialId": "ABC123"
      }
    ],
    "achievements": [
      {
        "id": "uuid-here",
        "title": "Achievement",
        "description": "Description",
        "date": "MM/YYYY"
      }
    ],
    "extracurricular": [
      {
        "id": "uuid-here",
        "title": "Role",
        "organization": "Org",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "description": "Description",
        "bullets": ["Activity"]
      }
    ]
  }
}

QUALITY METRICS EXTRACTION RULES (OPTIMIZED version only):
- quality_metrics_after: Extract from the OPTIMIZED resume you generate
- is_contact_info_complete: true if Email, Phone, AND Location are ALL present
- bullet_points_count: Total bullet points in Experience AND Projects sections
- quantified_bullet_points_count: Bullets with metrics (%, $, numbers) OR placeholders like [X]%, [Amount]
- action_verbs_used: Extract unique strong verbs starting bullets
- weak_words_found: Should be ZERO or minimal after optimization
- spelling_errors: Should be ZERO after optimization
- missing_sections: Check for missing standard sections

JD-TAILORING RULES:
- Extract keywords from JD and incorporate into existing bullets (truthfully)
- If user has the skill, rewrite bullets to emphasize it using JD terminology
- If user LACKS the skill, add to critical_missing_skills ONLY - DO NOT FAKE IT
- Match job title in header.title if the candidate's experience supports it
- Reorder skills to prioritize JD-relevant ones first

FIELD NAME RULES (CRITICAL):
- Experience: use "title", NOT "role"
- Projects: use "name", NOT "title"
- Education: use "gpa"
- Skills: use flat "items" array

JOB DESCRIPTION:
${jobDescription}

RESUME TEXT:
${resumeText}
    `;

    try {
      const geminiResult = await model.generateContent(prompt);

      let responseText = "";
      if (typeof geminiResult?.response?.text === "function") {
        responseText = geminiResult.response.text();
      } else if (
        geminiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        responseText =
          geminiResult.response.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini AI");
      }

      const cleanJson = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const geminiResponse: IGeminiJdOptimizeResponse = JSON.parse(cleanJson);

      // ===================================================================
      // SCORE CALCULATION: Use stored analysis metrics for "before" score
      // This guarantees the "before" score EXACTLY matches the analysis score
      // ===================================================================
      let atsScoreBefore: number;
      let qualityMetricsBefore: IQualityMetrics;

      if (storedQualityMetrics && storedAtsScore !== null) {
        atsScoreBefore = storedAtsScore;
        qualityMetricsBefore = storedQualityMetrics;
        console.log("[Optimize JD] Using stored analysis score:", atsScoreBefore);
      } else {
        console.warn("[Optimize JD] No stored quality_metrics found — using fallback");
        const fallbackMetrics = (geminiResponse as unknown as { quality_metrics_before?: IQualityMetrics }).quality_metrics_before;
        if (fallbackMetrics) {
          qualityMetricsBefore = fallbackMetrics;
          atsScoreBefore = calculateATSScore(fallbackMetrics);
        } else {
          const latestAnalysis = await ResumeScan.findOne({
            owner: req.user!._id,
            type: "analysis",
          }).sort({ createdAt: -1 });
          atsScoreBefore = latestAnalysis?.atsScore ?? 0;
          qualityMetricsBefore = {
            is_contact_info_complete: false,
            bullet_points_count: 0,
            quantified_bullet_points_count: 0,
            action_verbs_used: [],
            weak_words_found: [],
            spelling_errors: [],
            missing_sections: [],
          };
        }
      }

      const atsScoreAfter = calculateATSScore(geminiResponse.quality_metrics_after);

      console.log("[Optimize JD] JD Optimization Scores:");
      console.log("  - Before (from analysis):", atsScoreBefore);
      console.log("  - After (optimized):", atsScoreAfter);
      console.log("  - Improvement:", atsScoreAfter - atsScoreBefore);

      // VALIDATION: Fail only if score strictly decreased
      if (atsScoreAfter < atsScoreBefore) {
        console.error("[Optimize JD] FAILED: Optimization decreased the score!");
        console.error("  - Before metrics:", JSON.stringify(qualityMetricsBefore, null, 2));
        console.error("  - After metrics:", JSON.stringify(geminiResponse.quality_metrics_after, null, 2));
        throw new ApiError(
          500,
          `JD Optimization failed to improve resume. Score decreased from ${atsScoreBefore} to ${atsScoreAfter}. The resume may already be well-optimized for this job description.`
        );
      }

      // Calculate Potential Score Increase
      const potentialScoreIncrease = 
        (geminiResponse.critical_missing_skills?.length || 0) * 5;

      // Transform to final optimization result
      const analysisData: IOptimizationResult = {
        ats_score_before: atsScoreBefore,
        ats_score_after: atsScoreAfter,
        optimization_summary: geminiResponse.optimization_summary,
        red_vs_green_comparison: geminiResponse.red_vs_green_comparison,
        optimizedResume: geminiResponse.optimizedResume,
      };

      console.log("JD Optimization complete. Potential missing skills:", geminiResponse.critical_missing_skills?.length || 0);

      req.aiAnalysisResult = {
        ...analysisData,
        quality_metrics_before: qualityMetricsBefore,
        quality_metrics_after: geminiResponse.quality_metrics_after,
        critical_missing_skills: geminiResponse.critical_missing_skills,
        jd_keywords_found: geminiResponse.jd_keywords_found,
        potential_score_increase: potentialScoreIncrease,
      } as unknown as Record<string, unknown>;
      req.resumeText = resumeText;
      next();
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Request to AI failed:", error);
      throw new ApiError(
        500,
        err.message || "An error occurred while optimizing the resume",
      );
    }
  },
);

// ============================================================================
// Controller: Save Resume Scan
// ============================================================================

export const saveResumeScan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "User not authenticated");

    const aiResult = req.aiAnalysisResult;
    if (!aiResult) throw new ApiError(400, "AI Analysis result is missing");

    let pdfUrl: string | undefined;
    let originalName: string | undefined;
    let thumbnail: string | null = null;
    let contentHash: string | null = null;

    if (req.file && req.cloudinaryResult) {
      pdfUrl = req.cloudinaryResult.secure_url;
      originalName = req.file.originalname;
      thumbnail = pdfUrl ? pdfUrl.replace(/\.pdf$/i, ".jpg") : null;
      contentHash = computeContentHash(req.file.buffer);
    } else {
      const lastScan = await ResumeScan.findOne({ 
        owner: userId,
        type: "analysis", // Only reference analysis scans for PDF/metadata
      }).sort({
        createdAt: -1,
      });
      if (!lastScan) {
        throw new ApiError(
          404,
          "No existing resume found. Please upload a resume first.",
        );
      }
      pdfUrl = lastScan.pdfUrl;
      originalName = lastScan.originalName;
      thumbnail = lastScan.thumbnail;
      contentHash =
        lastScan.contentHash ||
        (req.resumeText ? computeContentHash(req.resumeText) : null);
    }

    const newScan = await ResumeScan.create({
      owner: userId,
      originalName,
      contentHash,
      pdfUrl,
      thumbnail,
      atsScore:
        (aiResult as unknown as { ats_score_after?: number }).ats_score_after ||
        0,
      analysisResult: aiResult as unknown as Record<string, unknown>,
      resumeText: req.resumeText || "",
      type: "optimization",
    });

    console.log("[SaveResumeScan] Scan saved successfully. Returning analysisResult.");

    // Return the analysisResult directly (matching frontend expectation)
    return res
      .status(201)
      .json(
        new ApiResponse(201, "Resume optimized successfully", {
          analysisResult: aiResult,
          scanId: newScan._id.toString(),
        })
      );
  },
);
