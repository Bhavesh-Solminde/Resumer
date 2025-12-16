import Router from "express";
import { handleAnalyzeResume } from "../controllers/analyze.controllers.js";
import upload from "../middlewares/memory.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const resumeRouter = Router();

resumeRouter.post(
  "/analyze",
  upload.single({ name: "resume" }),
  verifyJWT,
  handleAnalyzeResume
);
// resumeRouter.get("/analyze", handleGetAnalysisResult); // Commented out as it was imported from wrong file and might not exist yet

export default resumeRouter;
