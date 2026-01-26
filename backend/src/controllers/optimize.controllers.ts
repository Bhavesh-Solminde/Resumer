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

// ============================================================================
// Setup Google Gemini AI
// ============================================================================

const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

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
I will provide you with a resume text. Your task is to:
1. OPTIMIZE the content for better ATS scores and impact
2. Provide a "Before & After" comparison of specific improvements
3. Return the FULLY OPTIMIZED resume in a structured format

CRITICAL INSTRUCTIONS:
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field
2. Use EXACT field names as specified below
3. Dates should be in "MM/YYYY" format or "Present" for current positions
4. Convert weak, passive bullet points into strong, quantified achievements
5. Add metrics and numbers wherever possible (even reasonable estimates)

Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
{
  "ats_score_before": number (0-100),
  "ats_score_after": number (0-100),
  "optimization_summary": "Brief explanation of major improvements made",
  "red_vs_green_comparison": [
    {
      "section": "Experience / Projects / Summary / Skills",
      "original_text": "The exact weak text from the resume (Red)",
      "optimized_text": "The powerful, rewritten version (Green)",
      "explanation": "Why this change improves ATS ranking and impact"
    }
  ],
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
      "content": "Optimized professional summary with keywords and impact"
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
        "bullets": ["Quantified achievement 1", "Quantified achievement 2"]
      }
    ],
    "education": [
      {
        "id": "uuid-here",
        "degree": "Bachelor of Science in Computer Science",
        "institution": "University Name",
        "location": "City, Country",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "gpa": "3.8/4.0",
        "description": "Relevant coursework or honors"
      }
    ],
    "projects": [
      {
        "id": "uuid-here",
        "name": "Project Name",
        "subtitle": "Tech Stack",
        "date": "MM/YYYY",
        "description": "Impact-focused description",
        "bullets": ["Quantified feature 1", "Quantified feature 2"],
        "link": "github.com/project"
      }
    ],
    "skills": {
      "title": "Skills",
      "items": ["JavaScript", "Python", "React", "Node.js"]
    },
    "certifications": [
      {
        "id": "uuid-here",
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "date": "MM/YYYY",
        "expiryDate": "",
        "credentialId": "ABC123"
      }
    ],
    "achievements": [
      {
        "id": "uuid-here",
        "title": "Achievement Title",
        "description": "Quantified achievement description",
        "date": "MM/YYYY"
      }
    ],
    "extracurricular": [
      {
        "id": "uuid-here",
        "title": "Role/Position",
        "organization": "Organization Name",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "description": "Brief description",
        "bullets": ["Activity 1", "Activity 2"]
      }
    ]
  }
}

FIELD NAME RULES (CRITICAL - DO NOT DEVIATE):
- Experience: use "title" for job title, NOT "role" or "position"
- Projects: use "name" for project name, NOT "title"
- Education: use "gpa" NOT "score" or "grade"
- All dates: use "startDate" and "endDate", NOT "start" and "end"
- Skills: use flat "items" array, NOT categorized objects

OPTIMIZATION RULES:
- Replace passive voice with active voice
- Add metrics: percentages, numbers, dollar amounts
- Use strong action verbs: Led, Engineered, Architected, Optimized
- Remove filler words and clichés
- Ensure keywords match common job descriptions

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

      const analysisData: IOptimizationResult = JSON.parse(cleanJson);

      req.aiAnalysisResult = analysisData as unknown as Record<string, unknown>;
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
Your task is to:
1. TAILOR the resume specifically to match the JD requirements
2. Provide a "Before & After" comparison showing JD-specific improvements
3. Return the FULLY OPTIMIZED resume in a structured format

CRITICAL INSTRUCTIONS:
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field
2. Use EXACT field names as specified below
3. Dates should be in "MM/YYYY" format or "Present" for current positions
4. Incorporate keywords from the JD into experience bullets and skills
5. Reorder skills to prioritize JD-relevant ones first

Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
{
  "ats_score_before": number (0-100),
  "ats_score_after": number (0-100),
  "optimization_summary": "How the resume was tailored to match the JD",
  "red_vs_green_comparison": [
    {
      "section": "Experience / Projects / Summary / Skills",
      "original_text": "The original text that didn't match the JD (Red)",
      "optimized_text": "The JD-tailored version (Green)",
      "explanation": "Why this change improves ATS ranking for THIS specific JD"
    }
  ],
  "missing_keywords_added": ["keyword1", "keyword2"],
  "optimizedResume": {
    "header": {
      "fullName": "John Doe",
      "title": "JD-aligned title",
      "email": "john@example.com",
      "phone": "+1 234 567 890",
      "location": "City, Country",
      "linkedin": "linkedin.com/in/johndoe",
      "website": "johndoe.com"
    },
    "summary": {
      "content": "JD-tailored professional summary with relevant keywords"
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
        "bullets": ["JD-keyword-rich achievement 1", "JD-keyword-rich achievement 2"]
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
        "description": "Relevant coursework matching JD"
      }
    ],
    "projects": [
      {
        "id": "uuid-here",
        "name": "Project Name",
        "subtitle": "JD-relevant tech stack",
        "date": "MM/YYYY",
        "description": "JD-aligned description",
        "bullets": ["JD-relevant feature 1", "JD-relevant feature 2"],
        "link": "github.com/project"
      }
    ],
    "skills": {
      "title": "Skills",
      "items": ["JD-keyword-1", "JD-keyword-2", "Other relevant skills"]
    },
    "certifications": [
      {
        "id": "uuid-here",
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "date": "MM/YYYY",
        "expiryDate": "",
        "credentialId": "ABC123"
      }
    ],
    "achievements": [
      {
        "id": "uuid-here",
        "title": "Achievement Title",
        "description": "JD-relevant achievement",
        "date": "MM/YYYY"
      }
    ],
    "extracurricular": [
      {
        "id": "uuid-here",
        "title": "Role/Position",
        "organization": "Organization Name",
        "startDate": "MM/YYYY",
        "endDate": "MM/YYYY",
        "description": "Brief description",
        "bullets": ["Activity 1", "Activity 2"]
      }
    ]
  }
}

FIELD NAME RULES (CRITICAL - DO NOT DEVIATE):
- Experience: use "title" for job title, NOT "role" or "position"
- Projects: use "name" for project name, NOT "title"
- Education: use "gpa" NOT "score" or "grade"
- All dates: use "startDate" and "endDate", NOT "start" and "end"
- Skills: use flat "items" array, NOT categorized objects

JD-TAILORING RULES:
- Extract keywords from JD and incorporate into bullets
- Match job title in header.title if appropriate
- Reorder experience bullets to highlight JD-relevant work first
- Add JD-mentioned technologies to skills (if candidate has them)
- Tailor summary to echo JD language

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

      const analysisData: IOptimizationResult = JSON.parse(cleanJson);

      req.aiAnalysisResult = analysisData as unknown as Record<string, unknown>;
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
