import { Router } from "express";
import { handleAnalyzeResume } from "./analyze.controller.js";
import upload from "../../shared/middlewares/memory.middleware.js";
import verifyJWT from "../auth/auth.middleware.js";
import checkCredits from "../billing/checkCredits.middleware.js";

const analyzeRouter = Router();

analyzeRouter.post(
  "/analyze",
  verifyJWT,
  checkCredits(5, "analysis"),
  upload.single("resume"),
  handleAnalyzeResume,
);

export default analyzeRouter;
