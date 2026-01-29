import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ENV from "../env.js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ResumeScan from "../models/resumeScan.model.js";
import type {
  IAchievementItem,
  ICertificationItem,
  IEducationItem,
  IExperienceItem,
  IExtracurricularItem,
  IHeaderData,
  IProjectItem,
  ISkillsSection,
  ISummaryData,
} from "@resumer/shared-types";
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types - Frontend-aligned interfaces
// ============================================================================

type ISkillsData = ISkillsSection["data"];

/**
 * Extracted resume structure (matches frontend Section[] format)
 */
interface IExtractedResume {
  header: IHeaderData;
  summary: ISummaryData;
  experience: IExperienceItem[];
  education: IEducationItem[];
  projects: IProjectItem[];
  skills: ISkillsData;
  certifications: ICertificationItem[];
  achievements: IAchievementItem[];
  extracurricular: IExtracurricularItem[];
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
 * Raw response from Gemini AI (without score)
 */
interface IGeminiResponse {
  quality_metrics: IQualityMetrics;
  executive_summary: string;
  top_keywords: string[];
  actionable_feedback: string[];
  extractedResume: IExtractedResume;
}

/**
 * Final analysis result (with calculated score)
 */
interface IAnalysisData {
  score: number;
  summary: string;
  key_skills: string[];
  formatting_issues: string[];
  actionable_feedback: string[];
  extractedResume: IExtractedResume;
}

// Setup Google Gemini AI
const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

// ============================================================================
// ATS Score Calculation
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
  "transformed", "upgraded", "utilized"
]);

/**
 * Calculate ATS score based on quality metrics extracted by Gemini
 * @param metrics - Quality metrics from Gemini analysis
 * @returns Calculated ATS score (0-100)
 */
function calculateATSScore(metrics: IQualityMetrics): number {
  let score = 0;

  // 1. Contact Information (15 points)
  // Complete contact info is crucial for recruiters
  if (metrics.is_contact_info_complete) {
    score += 15;
  } else {
    score += 5; // Partial credit if some info exists
  }

  // 2. Bullet Points Quantity (15 points)
  // Ideal: 15-25 bullets for a strong resume
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
  // Most important: measurable impact with numbers
  const quantifiedCount = metrics.quantified_bullet_points_count;
  const quantifiedRatio = bulletCount > 0 ? quantifiedCount / bulletCount : 0;
  if (quantifiedRatio >= 0.5) {
    score += 20; // 50%+ bullets are quantified
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

  // 5. Weak Words Penalty (-10 points max)
  const weakWordsCount = metrics.weak_words_found.length;
  if (weakWordsCount === 0) {
    score += 10; // Bonus for no weak words
  } else if (weakWordsCount <= 2) {
    score += 6;
  } else if (weakWordsCount <= 5) {
    score += 2;
  }
  // More than 5 weak words = 0 points for this category

  // 6. Spelling/Grammar (10 points)
  const spellingErrors = metrics.spelling_errors.length;
  if (spellingErrors === 0) {
    score += 10;
  } else if (spellingErrors <= 2) {
    score += 6;
  } else if (spellingErrors <= 5) {
    score += 3;
  }
  // More than 5 errors = 0 points

  // 7. Section Completeness (15 points)
  // Standard sections: Skills, Experience, Education, Projects, Summary
  const missingSections = metrics.missing_sections.length;
  if (missingSections === 0) {
    score += 15;
  } else if (missingSections === 1) {
    score += 10;
  } else if (missingSections === 2) {
    score += 5;
  }
  // More than 2 missing = 0 points

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Generate formatting issues from quality metrics
 */
function generateFormattingIssues(metrics: IQualityMetrics): string[] {
  const issues: string[] = [];

  if (!metrics.is_contact_info_complete) {
    issues.push("Missing essential contact information (email, phone, or location)");
  }

  if (metrics.bullet_points_count < 10) {
    issues.push("Resume has too few bullet points - aim for 15-25 achievement bullets");
  }

  const quantifiedRatio =
    metrics.bullet_points_count > 0
      ? metrics.quantified_bullet_points_count / metrics.bullet_points_count
      : 0;
  if (quantifiedRatio < 0.3) {
    issues.push("Less than 30% of bullets contain quantified metrics - add more numbers and percentages");
  }

  if (metrics.weak_words_found.length > 0) {
    issues.push(`Found weak words: ${metrics.weak_words_found.slice(0, 5).join(", ")}`);
  }

  if (metrics.spelling_errors.length > 0) {
    issues.push(`Potential spelling issues: ${metrics.spelling_errors.slice(0, 3).join(", ")}`);
  }

  if (metrics.missing_sections.length > 0) {
    issues.push(`Missing standard sections: ${metrics.missing_sections.join(", ")}`);
  }

  return issues;
}

/**
 * Analyze resume using AI and save to database
 */
export const handleAnalyzeResume = asyncHandler(
  async (req: Request, res: Response) => {
    // Ensure file is present
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    // Is user authenticated?
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    // Extract text from PDF
    let resumeText = "";
    try {
      const pdfData = await pdf(req.file.buffer);
      resumeText = pdfData.text;
    } catch {
      throw new ApiError(400, "Failed to parse PDF file");
    }

    // Ensure text extraction was successful
    if (!resumeText || resumeText.trim().length === 0) {
      throw new ApiError(400, "Could not extract text from PDF");
    }

    const prompt = `
You are an expert Technical Recruiter, Resume Parser, and ATS Specialist.
Analyze the following resume text and extract ALL information into a structured format.

CRITICAL INSTRUCTIONS:
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field.
2. Use EXACT field names as specified.
3. Dates should be in "MM/YYYY" format or "Present".
4. If info is missing, use empty strings or arrays.
5. **DO NOT output a score.** Instead, extract the raw quality metrics listed below.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "quality_metrics": {
    "is_contact_info_complete": boolean,
    "bullet_points_count": integer,
    "quantified_bullet_points_count": integer,
    "action_verbs_used": ["List", "of", "unique", "strong", "verbs", "found"],
    "weak_words_found": ["List", "of", "words", "like", "helped", "responsible for", "worked on", "various"],
    "spelling_errors": ["List", "of", "potential", "typos"],
    "missing_sections": ["List", "of", "standard", "sections", "missing"]
  },
  "executive_summary": "Professional summary of the candidate's strengths based on the resume content",
  "top_keywords": ["List", "of", "top", "5-10", "hard", "skills", "found"],
  "actionable_feedback": ["Specific tip 1", "Specific tip 2"],
  "extractedResume": {
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
      "content": "Professional summary paragraph"
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
        "bullets": ["Achievement 1", "Achievement 2"]
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
        "bullets": ["Feature 1", "Feature 2"],
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
- bullet_points_count: Total count of bullet points in Experience AND Projects sections
- quantified_bullet_points_count: Count of bullets containing metrics (%, $, numbers, +, k, M, x improvement)
- action_verbs_used: Extract unique strong verbs that start bullets (e.g., "Developed", "Led", "Implemented")
- weak_words_found: Find weak phrases like "helped", "responsible for", "worked on", "assisted", "various", "etc"
- spelling_errors: List potential typos or misspellings found
- missing_sections: Check for missing standard sections (Skills, Experience, Education, Projects, Summary)

FIELD NAME RULES (CRITICAL):
- Experience: use "title", NOT "role"
- Projects: use "name", NOT "title"
- Education: use "gpa"
- Skills: use flat "items" array

RESUME TEXT:
${resumeText}
    `;

    try {
      // Parallel Execution: Start Gemini API call AND Cloud Upload simultaneously
      const geminiPromise = model.generateContent(prompt);
      const cloudinaryPromise = cloudinaryUpload(req.file.buffer);

      // Await Results: Wait for both to finish
      const [geminiResult, cloudinaryResult] = await Promise.all([
        geminiPromise,
        cloudinaryPromise,
      ]);

      const cloudinaryUrl = cloudinaryResult.secure_url;

      // Handle Gemini response
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

      // Clean & Parse JSON
      const cleanJson = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const geminiResponse: IGeminiResponse = JSON.parse(cleanJson);

      // Calculate ATS score internally using quality metrics
      const atsScore = calculateATSScore(geminiResponse.quality_metrics);

      // Generate formatting issues from quality metrics
      const formattingIssues = generateFormattingIssues(
        geminiResponse.quality_metrics,
      );

      // Transform Gemini response to final analysis data
      const analysisData: IAnalysisData = {
        score: atsScore,
        summary: geminiResponse.executive_summary,
        key_skills: geminiResponse.top_keywords,
        formatting_issues: formattingIssues,
        actionable_feedback: geminiResponse.actionable_feedback,
        extractedResume: geminiResponse.extractedResume,
      };

      // Save to DB: Create a history record
      // Redact detailed metrics from long-term storage
      const { quality_metrics, ...safeResponse } = geminiResponse;
      // Compute simple flags or summary if needed
      const metricsSummary = {
        hasTypos: (quality_metrics?.spelling_errors?.length || 0) > 0,
        missingSectionsCount: quality_metrics?.missing_sections?.length || 0,
      };

      const resumeScan = await ResumeScan.create({
        originalName: req.file?.originalname,
        pdfUrl: cloudinaryUrl,
        owner: req.user!._id,
        atsScore: atsScore,
        analysisResult: {
          ...analysisData,
          metricsSummary, // Store redacted summary
          // quality_metrics omitted intentionally
        } as unknown as Record<string, unknown>,
        resumeText: resumeText,
      });
      console.log("ATS Score:", atsScore); // redacted log

      await User.updateOne(
        { _id: req.user!._id },
        { $push: { resumeHistory: resumeScan._id } },
      );

      // Send Response
      return res.status(200).json(
        new ApiResponse(200, "Resume analyzed successfully", {
          ...analysisData,
          resumeUrl: cloudinaryUrl,
        }),
      );
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Request to AI or Cloudinary failed:", error);
      throw new ApiError(
        500,
        err.message || "An error occurred while analyzing the resume",
      );
    }
  },
);
