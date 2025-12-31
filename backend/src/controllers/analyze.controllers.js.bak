import { GoogleGenerativeAI } from "@google/generative-ai";
import ENV from "../env.js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../lib/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ResumeScan from "../models/resumeScan.model.js";

//Setup Google Gemini AI
const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

export const handleAnalyzeResume = asyncHandler(async (req, res) => {
  // Ensure file is present
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  //isUser authenticated?
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  // Extract text from PDF
  let resumeText = "";
  try {
    const pdfData = await pdf(req.file.buffer);
    resumeText = pdfData.text;
  } catch (error) {
    throw new ApiError(400, "Failed to parse PDF file");
  }

  // Ensure text extraction was successful
  if (!resumeText || resumeText.trim().length === 0) {
    throw new ApiError(400, "Could not extract text from PDF");
  }
  // console.log("Resume text extracted successfully (length: " + resumeText.length + ")");

  const prompt = `
      Act as an expert Technical Recruiter and Resume Optimizer.
      Analyze the following resume text.
      
      Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
      {
        "score": number (0-100),
        "summary": "Professional summary of the candidate",
        "key_skills": ["skill1", "skill2", ...],
        "missing_keywords": ["keyword1", "keyword2", ...],
        "formatting_issues": ["issue1", "issue2", ...],
        "actionable_feedback": ["tip1", "tip2", ...]
      }

      RESUME TEXT:
      ${resumeText}
    `;

  try {
    // Parallel Execution: Start Gemini API call AND Cloud Upload simultaneously
    const geminiPromise = model.generateContent(prompt);
    const cloudinaryPromise = cloudinaryUpload(req.file?.buffer);

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
    } else if (typeof geminiResult?.text === "function") {
      responseText = geminiResult.text();
    } else if (
      geminiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      responseText = geminiResult.response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini AI");
    }

    // Clean & Parse JSON
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysisData = JSON.parse(cleanJson);

    // Save to DB: Create a history record
    const resumeScan = await ResumeScan.create({
      originalName: req.file?.originalname,
      pdfUrl: cloudinaryUrl,
      owner: req.user?._id,
      atsScore: analysisData.score,
      analysisResult: analysisData,
      resumeText: resumeText,
    });
    console.log(analysisData);

    await User.updateOne(
      { _id: req.user._id },
      { $push: { resumeHistory: resumeScan._id } }
    );

    // Send Response
    return res.status(200).json(
      new ApiResponse(200, "Resume analyzed successfully", {
        ...analysisData,
        resumeUrl: cloudinaryUrl,
      })
    );
  } catch (error) {
    console.error("Request to AI or Cloudinary failed:", error);
    throw new ApiError(
      500,
      error.message || "An error occurred while analyzing the resume"
    );
  }
});
