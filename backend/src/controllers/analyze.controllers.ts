import { Request, Response } from "express";
import { createHash } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ENV from "../env.js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ResumeScan from "../models/resumeScan.model.js";
import { calculateATSScore, generateFormattingIssues } from "../utils/atsScore.js";
import type { IQualityMetrics } from "../utils/atsScore.js";
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

const computeContentHash = (input: Buffer | string): string =>
  createHash("sha256").update(input).digest("hex");

// Setup Google Gemini AI
const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      // Store quality_metrics so optimization can reuse them for consistent "before" scoring
      const contentHash = computeContentHash(req.file.buffer);

      const resumeScan = await ResumeScan.create({
        originalName: req.file?.originalname,
        contentHash,
        pdfUrl: cloudinaryUrl,
        owner: req.user!._id,
        atsScore: atsScore,
        analysisResult: {
          ...analysisData,
          quality_metrics: geminiResponse.quality_metrics, // Stored for optimization reuse
        } as unknown as Record<string, unknown>,
        resumeText: resumeText,
        type: "analysis", // Explicitly mark as analysis scan
      });
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
