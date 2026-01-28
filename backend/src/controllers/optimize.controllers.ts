import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ResumeScan from "../models/resumeScan.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ENV from "../env.js";
import type { IOptimizationData } from "@resumer/shared-types";
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types - Shared interfaces
// ============================================================================

type IOptimizationResult = IOptimizationData;

interface OptimizeJdBody {
  jobDescription?: string;
}

/**
 * Quality metrics extracted by Gemini (used for internal score calculation)
 */
interface IQualityMetrics {
  is_contact_info_complete: boolean;
  bullet_points_count: number;
  quantified_bullet_points_count: number;
  action_verbs_used: string[];
  weak_words_found: string[];
  spelling_errors: string[];
  missing_sections: string[];
}

/**
 * Raw response from Gemini AI for general optimization (single quality_metrics for optimized resume)
 */
interface IGeminiOptimizeResponse {
  quality_metrics: IQualityMetrics; // Metrics for OPTIMIZED resume only
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
 * Raw response from Gemini AI for JD optimization
 */
interface IGeminiJdOptimizeResponse {
  quality_metrics_before: IQualityMetrics;
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

// ============================================================================
// ATS Score Calculation (shared with analyze.controllers.ts)
// ============================================================================

/** Strong action verbs that improve ATS scores */
const STRONG_ACTION_VERBS = new Set([
  "achieved", "accelerated", "accomplished", "administered", "analyzed",
  "architected", "automated", "boosted", "built", "collaborated",
  "consolidated", "created", "decreased", "delivered", "designed",
  "developed", "devised", "directed", "drove", "eliminated",
  "engineered", "enhanced", "established", "exceeded", "executed",
  "expanded", "expedited", "facilitated", "formulated", "generated",
  "grew", "headed", "implemented", "improved", "increased",
  "initiated", "innovated", "integrated", "introduced", "launched",
  "led", "leveraged", "maintained", "managed", "maximized",
  "mentored", "migrated", "minimized", "modernized", "negotiated",
  "optimized", "orchestrated", "organized", "overhauled", "oversaw",
  "pioneered", "planned", "produced", "programmed", "proposed",
  "redesigned", "reduced", "refactored", "reformed", "remodeled",
  "replaced", "resolved", "restructured", "revamped", "saved",
  "scaled", "secured", "simplified", "spearheaded", "standardized",
  "streamlined", "strengthened", "supervised", "surpassed", "trained",
  "transformed", "upgraded", "utilized",
]);

/**
 * Calculate ATS score based on quality metrics
 * @param metrics - Quality metrics from Gemini analysis
 * @returns Calculated ATS score (0-100)
 */
function calculateATSScore(metrics: IQualityMetrics): number {
  let score = 0;

  // 1. Contact Information (15 points)
  if (metrics.is_contact_info_complete) {
    score += 15;
  } else {
    score += 5;
  }

  // 2. Bullet Points Quantity (15 points)
  const bulletCount = metrics.bullet_points_count;
  if (bulletCount >= 15 && bulletCount <= 30) {
    score += 15;
  } else if (bulletCount >= 10 && bulletCount < 15) {
    score += 12;
  } else if (bulletCount >= 5 && bulletCount < 10) {
    score += 8;
  } else if (bulletCount > 0) {
    score += 4;
  }

  // 3. Quantified Achievements (20 points)
  const quantifiedCount = metrics.quantified_bullet_points_count;
  const quantifiedRatio = bulletCount > 0 ? quantifiedCount / bulletCount : 0;
  if (quantifiedRatio >= 0.5) {
    score += 20;
  } else if (quantifiedRatio >= 0.3) {
    score += 15;
  } else if (quantifiedRatio >= 0.15) {
    score += 10;
  } else if (quantifiedCount > 0) {
    score += 5;
  }

  // 4. Action Verbs Usage (15 points)
  const actionVerbCount = metrics.action_verbs_used.filter((verb) =>
    STRONG_ACTION_VERBS.has(verb.toLowerCase())
  ).length;
  if (actionVerbCount >= 10) {
    score += 15;
  } else if (actionVerbCount >= 6) {
    score += 12;
  } else if (actionVerbCount >= 3) {
    score += 8;
  } else if (actionVerbCount > 0) {
    score += 4;
  }

  // 5. Weak Words Penalty (10 points max)
  const weakWordsCount = metrics.weak_words_found.length;
  if (weakWordsCount === 0) {
    score += 10;
  } else if (weakWordsCount <= 2) {
    score += 6;
  } else if (weakWordsCount <= 5) {
    score += 2;
  }

  // 6. Spelling/Grammar (10 points)
  const spellingErrors = metrics.spelling_errors.length;
  if (spellingErrors === 0) {
    score += 10;
  } else if (spellingErrors <= 2) {
    score += 6;
  } else if (spellingErrors <= 5) {
    score += 3;
  }

  // 7. Section Completeness (15 points)
  const missingSections = metrics.missing_sections.length;
  if (missingSections === 0) {
    score += 15;
  } else if (missingSections === 1) {
    score += 10;
  } else if (missingSections === 2) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

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
// Controller: Optimize Resume (General)
// ============================================================================

export const optimizeResume = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    let resumeText = "";
    let atsScoreBefore = 0; // Will be fetched from last analysis

    if (req.file) {
      try {
        const pdfData = await pdf(req.file.buffer);
        resumeText = pdfData.text;
      } catch {
        throw new ApiError(400, "Failed to parse PDF file");
      }
      // If uploading new file, try to get score from last scan anyway
      const lastScan = await ResumeScan.findOne({ owner: req.user._id }).sort({
        createdAt: -1,
      });
      if (lastScan?.atsScore) {
        atsScoreBefore = lastScan.atsScore;
      }
    } else {
      const lastScan = await ResumeScan.findOne({ owner: req.user._id }).sort({
        createdAt: -1,
      });
      if (!lastScan) {
        throw new ApiError(
          400,
          "No resume found. Please upload a resume first.",
        );
      }
      if (lastScan.resumeText) {
        resumeText = lastScan.resumeText;
      } else {
        throw new ApiError(
          400,
          "Resume text not found in history. Please re-upload your resume.",
        );
      }
      // Get the "before" score from the last analysis
      atsScoreBefore = lastScan.atsScore || 0;
    }

    if (!resumeText || resumeText.trim().length === 0) {
      throw new ApiError(400, "Could not extract text from PDF");
    }

    const prompt = `
You are an expert Resume Writer.
I will provide you with a resume text.
Your task is to OPTIMIZE the content for impact, clarity, and ATS readability.

PREVIOUS ATS SCORE: ${atsScoreBefore}
GOAL: The optimized resume MUST score HIGHER than ${atsScoreBefore}. Use the rules below to achieve this.

CRITICAL INSTRUCTIONS:
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field.
2. Use EXACT field names as specified below.
3. Dates should be in "MM/YYYY" format or "Present".
4. **NO HALLUCINATED METRICS:** Do not invent numbers. If a bullet point is strong but lacks a number, you may add a placeholder like "[X]%" or "[Amount]" for the user to fill in, but DO NOT make up a specific value.
5. **STRONG VERBS:** Replace all weak verbs (e.g., "Helped", "Worked on", "Responsible for") with strong, unique action verbs (e.g., "Engineered", "Spearheaded", "Optimized").
6. **CONCISENESS IS KEY:** Bullet points (especially in Projects and Experience) MUST be concise and punchy. Avoid long paragraphs. Recruiters prefer 1-page resumes, so keep descriptions tight, impactful and professional.
7. **MAINTAIN QUANTITY:** While being concise, DO NOT significantly reduce the total number of bullet points if the previous count was high (15-30 is optimal). Merging too many bullets will lower the score.

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

  "quality_metrics": {
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

QUALITY METRICS RULES (Analyze the OPTIMIZED resume):
- is_contact_info_complete: true if Email, Phone, AND Location are ALL present in optimized header
- bullet_points_count: Total bullet points in OPTIMIZED Experience AND Projects sections
- quantified_bullet_points_count: Count of bullets with metrics (%, $, numbers) OR placeholders like [X]%, [Amount] in OPTIMIZED text
- action_verbs_used: List of unique strong verbs used in OPTIMIZED resume
- weak_words_found: Should be empty or minimal after optimization
- spelling_errors: Should be empty after optimization (you fix all errors)
- missing_sections: List of standard sections still missing after optimization

OPTIMIZATION RULES:
- Replace passive voice with active voice
- Maximize the use of strong action verbs to improve the score
- Fix any spelling errors found in the original text
- Standardize formatting and date formats
- Add metric placeholders like [X]% where numbers would strengthen the bullet

FIELD NAME RULES (CRITICAL):
- Experience: use "title", NOT "role"
- Projects: use "name", NOT "title"
- Education: use "gpa"
- Skills: use flat "items" array

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

      const geminiResponse: IGeminiOptimizeResponse = JSON.parse(cleanJson);

      // Calculate ATS score for OPTIMIZED resume using quality metrics
      // "Before" score comes from the last analysis (fetched from DB above)
      const atsScoreAfter = calculateATSScore(geminiResponse.quality_metrics);

      // Transform to final optimization result
      const analysisData: IOptimizationResult = {
        ats_score_before: atsScoreBefore, // From last analysis in DB
        ats_score_after: atsScoreAfter,   // Calculated from optimized quality_metrics
        optimization_summary: geminiResponse.optimization_summary,
        red_vs_green_comparison: geminiResponse.red_vs_green_comparison,
        optimizedResume: geminiResponse.optimizedResume,
      };

      console.log("General Optimization - Before (from DB):", atsScoreBefore, "After:", atsScoreAfter);

      req.aiAnalysisResult = {
        ...analysisData,
        quality_metrics: geminiResponse.quality_metrics, // Only optimized metrics
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
// Controller: Optimize Resume for Job Description
// ============================================================================

export const optimizeJd = asyncHandler(
  async (
    req: Request<object, object, OptimizeJdBody>,
    _res: Response,
    next: NextFunction,
  ) => {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      throw new ApiError(400, "Job Description is required");
    }

    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    let resumeText = "";

    if (req.file) {
      try {
        const pdfData = await pdf(req.file.buffer);
        resumeText = pdfData.text;
      } catch {
        throw new ApiError(400, "Failed to parse PDF file");
      }
    } else {
      const lastScan = await ResumeScan.findOne({ owner: req.user._id }).sort({
        createdAt: -1,
      });
      if (!lastScan) {
        throw new ApiError(
          400,
          "No resume found. Please upload a resume first.",
        );
      }
      if (lastScan.resumeText) {
        resumeText = lastScan.resumeText;
      } else {
        throw new ApiError(
          400,
          "Resume text not found in history. Please re-upload your resume.",
        );
      }
    }

    if (!resumeText || resumeText.trim().length === 0) {
      throw new ApiError(400, "Could not extract text from PDF");
    }

    const prompt = `
You are an expert Resume Writer and ATS Optimization Specialist.
I will provide you with a resume text AND a Job Description (JD).

Your Goal: Optimize the phrasing of EXISTING experience to match the JD keywords, but DO NOT invent new skills.

CRITICAL TRUTH CONSTRAINTS:
1. **NO LYING:** Do NOT add hard skills (languages, tools, frameworks, certifications) to the optimizedResume if they are not in the original resume
2. **MISSING SKILLS HANDLING:** If the JD requires a skill the user lacks, add it ONLY to critical_missing_skills array, NOT to the resume
3. **PHRASING:** You MAY rewrite existing bullet points to use JD-specific terminology (e.g., changing "Used JS" to "Leveraged JavaScript (ES6+)") as long as facts remain true
4. **DO NOT output ATS scores.** Instead, extract the raw quality metrics for both BEFORE and AFTER versions
5. **PLACEHOLDERS:** If a bullet point is strong but lacks a number, you may add a placeholder like "[X]%" or "[Amount]".
6. **CONCISENESS IS KEY:** Bullet points (especially in Projects and Experience) MUST be concise and punchy. Avoid long paragraphs. Recruiters prefer 1-page resumes, so keep descriptions tight and impactful.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "quality_metrics_before": {
    "is_contact_info_complete": boolean,
    "bullet_points_count": integer,
    "quantified_bullet_points_count": integer,
    "action_verbs_used": ["verbs", "in", "original"],
    "weak_words_found": ["weak", "words", "in", "original"],
    "spelling_errors": ["typos"],
    "missing_sections": ["missing", "sections"]
  },
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

QUALITY METRICS EXTRACTION RULES:
- is_contact_info_complete: true if Email, Phone, AND Location are ALL present
- bullet_points_count: Total bullet points in Experience AND Projects sections
- quantified_bullet_points_count: Bullets with metrics (%, $, numbers) OR placeholders like [X]%, [Amount]
- action_verbs_used: Extract unique strong verbs starting bullets
- weak_words_found: Find weak phrases like "helped", "responsible for", "worked on"
- spelling_errors: List potential typos
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

      // Calculate ATS scores internally using quality metrics
      const atsScoreBefore = calculateATSScore(geminiResponse.quality_metrics_before);
      const atsScoreAfter = calculateATSScore(geminiResponse.quality_metrics_after);

      // Calculate Potential Score Increase
      // Formula: (Number of Critical Missing Skills) * 5 points
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

      console.log("JD Optimization - Before:", atsScoreBefore, "After:", atsScoreAfter);
      console.log("Critical Missing Skills:", geminiResponse.critical_missing_skills);
      console.log("Potential Score Boost:", potentialScoreIncrease);

      req.aiAnalysisResult = {
        ...analysisData,
        quality_metrics_before: geminiResponse.quality_metrics_before,
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

    if (req.file && req.cloudinaryResult) {
      pdfUrl = req.cloudinaryResult.secure_url;
      originalName = req.file.originalname;
      thumbnail = pdfUrl ? pdfUrl.replace(/\.pdf$/i, ".jpg") : null;
    } else {
      const lastScan = await ResumeScan.findOne({ owner: userId }).sort({
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
    }

    const newScan = await ResumeScan.create({
      owner: userId,
      originalName,
      pdfUrl,
      thumbnail,
      atsScore:
        (aiResult as unknown as { ats_score_after?: number }).ats_score_after ||
        0,
      analysisResult: aiResult as unknown as Record<string, unknown>,
      resumeText: req.resumeText || "",
      type: "optimization",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Resume scan saved successfully", newScan));
  },
);
