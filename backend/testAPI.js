import { GoogleGenerativeAI } from "@google/generative-ai";

import ENV from "./src/env.js";
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    // This is a hack to list models using the SDK's internal methods or standard fetch
    // Use the standard fetch to be 100% sure what the API sees
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.error) {
      console.log("Error:", data.error.message);
    } else {
      console.log("✅ AVAILABLE MODELS FOR THIS KEY:");
      data.models.forEach((m) => {
        // Only show models that support generating content
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
    }
  } catch (error) {
    console.error("Script failed:", error);
  }
}

listModels();
