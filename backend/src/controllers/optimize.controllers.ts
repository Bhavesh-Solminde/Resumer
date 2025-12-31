import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ResumeScan from "../models/resumeScan.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ENV from "../env.js";
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types
// ============================================================================

interface IOptimizationResult {
  ats_score_before: number;
  ats_score_after: number;
  optimization_summary: string;
  red_vs_green_comparison: Array<{
    section: string;
    original_text: string;
    optimized_text: string;
    explanation: string;
  }>;
  missing_keywords_added?: string[];
}

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
  }
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
          "No resume found. Please upload a resume first."
        );
      }
      if (lastScan.resumeText) {
        resumeText = lastScan.resumeText;
      } else {
        throw new ApiError(
          400,
          "Resume text not found in history. Please re-upload your resume."
        );
      }
    }

    if (!resumeText || resumeText.trim().length === 0) {
      throw new ApiError(400, "Could not extract text from PDF");
    }

    const prompt = `
      Act as an expert Resume Writer.
      I will provide you with a resume text.
      Your task is to strictly OPTIMIZE the content for a "Before & After" comparison.
      
      Identify specific bullet points, sentences, or sections that are weak, passive, or cliché (The "Red" column).
      Rewrite them to be strong, quantified, and action-oriented (The "Green" column).

      Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
      {
        "ats_score_before": number (0-100),
        "ats_score_after": number (0-100),
        "optimization_summary": "A brief explanation of the major changes made (e.g. 'Added metrics to project descriptions, strengthened action verbs').",
        "red_vs_green_comparison": [
          {
            "section": "Experience / Projects / Summary",
            "original_text": "The exact weak text from the resume (Red)",
            "optimized_text": "The powerful, rewritten version (Green)",
            "explanation": "Why this change is better (e.g. 'Passive voice -> Active voice')"
          }
        ]
      }

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
        err.message || "An error occurred while optimizing the resume"
      );
    }
  }
);

// ============================================================================
// Controller: Optimize Resume for Job Description
// ============================================================================

export const optimizeJd = asyncHandler(
  async (
    req: Request<object, object, OptimizeJdBody>,
    _res: Response,
    next: NextFunction
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
          "No resume found. Please upload a resume first."
        );
      }
      if (lastScan.resumeText) {
        resumeText = lastScan.resumeText;
      } else {
        throw new ApiError(
          400,
          "Resume text not found in history. Please re-upload your resume."
        );
      }
    }

    if (!resumeText || resumeText.trim().length === 0) {
      throw new ApiError(400, "Could not extract text from PDF");
    }

    const prompt = `
      Act as an expert Resume Writer and ATS Specialist.
      I will provide you with a resume text and a Job Description (JD).
      Your task is to OPTIMIZE the resume specifically to match the JD for a "Before & After" comparison.
      
      Identify bullet points or sections in the resume that are irrelevant, weak, or missing key keywords from the JD (The "Red" column).
      Rewrite them to align with the JD's requirements, incorporating missing keywords and using stronger action verbs (The "Green" column).

      Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
      {
        "ats_score_before": number (0-100),
        "ats_score_after": number (0-100),
        "optimization_summary": "Briefly explain how the resume was tailored to the JD.",
        "red_vs_green_comparison": [
          {
            "section": "Experience / Projects / Skills",
            "original_text": "The original text that didn't match the JD well (Red)",
            "optimized_text": "The rewritten version tailored to the JD (Green)",
            "explanation": "Why this change improves ATS ranking for this specific JD"
          }
        ],
        "missing_keywords_added": ["List of JD keywords that were successfully integrated"]
      }

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
        err.message || "An error occurred while optimizing the resume"
      );
    }
  }
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
          "No existing resume found. Please upload a resume first."
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
  }
);
