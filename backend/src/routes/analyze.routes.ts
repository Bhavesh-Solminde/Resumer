import { Router } from "express";
import { handleAnalyzeResume } from "../controllers/analyze.controllers.js";
import upload from "../middlewares/memory.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import checkCredits from "../middlewares/checkCredits.middleware.js";

const analyzeRouter = Router();

analyzeRouter.post(
  "/analyze",
  verifyJWT,
  checkCredits(5, "analysis"),
  upload.single("resume"),
  handleAnalyzeResume,
);

export default analyzeRouter;
