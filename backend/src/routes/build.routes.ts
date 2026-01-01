import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  storeBuiltResume,
  fetchBuildHistory,
  fetchResumeById,
  updateBuiltResume,
  deleteResume,
} from "../controllers/build.controllers.js";

const buildRouter = Router();

// Create New
buildRouter.post("/build", verifyJWT, storeBuiltResume);

// Save/Update Existing
buildRouter.put("/build/:id", verifyJWT, updateBuiltResume);

// History List (Metadata only)
buildRouter.get("/build/history", verifyJWT, fetchBuildHistory);

// Get Specific Resume (Full Data)
buildRouter.get("/build/:id", verifyJWT, fetchResumeById);

// Delete
buildRouter.delete("/build/:id", verifyJWT, deleteResume);

export default buildRouter;
