import { GoogleGenerativeAI } from "@google/generative-ai";
import ENV from "../env.js";
import pdf from "pdf-parse/lib/pdf-parse.js";

//Setup Google Gemini AI
const ai = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); // Flash is fast & cheap

export const handleAnalyzeResume = async (req, res) => {
  try {
    // Ensure file is present
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract text from PDF
    const pdfData = await pdf(req.file.buffer);
    const resumeText = pdfData.text;

    // Ensure text extraction was successful
    if (!resumeText) {
      return res
        .status(400)
        .json({ message: "Could not extract text from PDF" });
    }

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

    // Generate response from Gemini AI
    const result = await model.generateContent(prompt);

    // Handle response based on SDK version (assuming standard response structure)
    let responseText = "";
    if (result.response && typeof result.response.text === "function") {
      responseText = result.response.text();
    } else if (typeof result.text === "function") {
      responseText = result.text();
    } else if (
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0
    ) {
      // Fallback for raw response structure
      responseText = result.response.candidates[0].content.parts[0].text;
    } else {
      // Try to inspect the result object if possible, or throw
      console.log("Gemini Result:", JSON.stringify(result, null, 2));
      throw new Error("Unexpected response format from Gemini AI");
    }

    // Clean & Parse JSON
    // Gemini sometimes wraps response in ```json ... ```. We remove that.
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysisData = JSON.parse(cleanJson);

    //send response
    return res.status(200).json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error("Request to ai failed:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
