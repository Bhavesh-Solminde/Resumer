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
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types - Frontend-aligned interfaces
// ============================================================================

/**
 * Header data (personal info)
 */
interface IHeaderData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

/**
 * Summary data
 */
interface ISummaryData {
  content: string;
}

/**
 * Experience item
 */
interface IExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

/**
 * Education item
 */
interface IEducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

/**
 * Project item
 */
interface IProjectItem {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: string[];
  link: string;
}

/**
 * Certification item
 */
interface ICertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId: string;
}

/**
 * Achievement item
 */
interface IAchievementItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

/**
 * Extracurricular item
 */
interface IExtracurricularItem {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

/**
 * Skills data
 */
interface ISkillsData {
  title: string;
  items: string[];
}

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
 * Analysis result from Gemini AI
 */
interface IAnalysisData {
  score: number;
  summary: string;
  key_skills: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  actionable_feedback: string[];
  extractedResume: IExtractedResume;
}

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
1. Generate a UUID (like "a1b2c3d4-e5f6-7890-abcd-ef1234567890") for EVERY "id" field
2. Use EXACT field names as specified - DO NOT substitute (e.g., use "title" not "role", use "name" not "title" for projects)
3. Dates should be in "MM/YYYY" format or "Present" for current positions
4. If information is not found, use empty string "" for text fields and empty array [] for arrays
5. Extract bullet points from descriptions as separate items in "bullets" array

Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
{
  "score": number (0-100, ATS compatibility score),
  "summary": "Professional summary of the candidate based on their resume",
  "key_skills": ["skill1", "skill2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...] (common ATS keywords missing from resume),
  "formatting_issues": ["issue1", "issue2", ...],
  "actionable_feedback": ["tip1", "tip2", ...],
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
      "content": "Professional summary paragraph from the resume"
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
        "subtitle": "Tech Stack or Type",
        "date": "MM/YYYY",
        "description": "What the project does",
        "bullets": ["Feature 1", "Feature 2"],
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
        "name": "AWS Certified Developer",
        "issuer": "Amazon Web Services",
        "date": "MM/YYYY",
        "expiryDate": "MM/YYYY or empty if no expiry",
        "credentialId": "ABC123"
      }
    ],
    "achievements": [
      {
        "id": "uuid-here",
        "title": "Achievement Title",
        "description": "What was achieved",
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

      const analysisData: IAnalysisData = JSON.parse(cleanJson);

      // Save to DB: Create a history record
      const resumeScan = await ResumeScan.create({
        originalName: req.file?.originalname,
        pdfUrl: cloudinaryUrl,
        owner: req.user!._id,
        atsScore: analysisData.score,
        analysisResult: analysisData as unknown as Record<string, unknown>,
        resumeText: resumeText,
      });
      console.log(analysisData);

      await User.updateOne(
        { _id: req.user!._id },
        { $push: { resumeHistory: resumeScan._id } }
      );

      // Send Response
      return res.status(200).json(
        new ApiResponse(200, "Resume analyzed successfully", {
          ...analysisData,
          resumeUrl: cloudinaryUrl,
        })
      );
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Request to AI or Cloudinary failed:", error);
      throw new ApiError(
        500,
        err.message || "An error occurred while analyzing the resume"
      );
    }
  }
);
