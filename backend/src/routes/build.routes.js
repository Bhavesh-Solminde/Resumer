import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  storeBuiltResume,
  fetchBuildHistory,
  fetchResumeById,
  updateBuiltResume, // <--- ADDED THIS (You need it to save changes)
  deleteResume,
} from "../controllers/build.controllers.js";

const buildRouter = Router();

// Create New
buildRouter.post("/build", verifyJWT, storeBuiltResume);

// Save/Update Existing (CRITICAL: Do not forget this)
buildRouter.put("/build/:id", verifyJWT, updateBuiltResume);

// History List (Metadata only)
buildRouter.get("/build/history", verifyJWT, fetchBuildHistory);

// Get Specific Resume (Full Data)
buildRouter.get("/build/:id", verifyJWT, fetchResumeById);

// Delete
buildRouter.delete("/build/:id", verifyJWT, deleteResume);

export default buildRouter;
