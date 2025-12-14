import Router from "express";
import { handleAnalyzeResume } from "../controllers/analyze.controllers.js";
import upload from "../middlewares/memory.middleware.js";

const resumeRouter = Router();

resumeRouter.post("/analyze", upload.single("resume"), handleAnalyzeResume);
// resumeRouter.get("/analyze", handleGetAnalysisResult); // Commented out as it was imported from wrong file and might not exist yet

export default resumeRouter;
