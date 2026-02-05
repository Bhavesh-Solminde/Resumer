import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  ResumeScanHistory,
  fetchResumeScanById,
  deleteResumeScan,
} from "../controllers/profile.controllers.js";

const profileRouter = Router();

profileRouter.get("/history", verifyJWT, ResumeScanHistory);
profileRouter.get("/:id", verifyJWT, fetchResumeScanById);
profileRouter.delete("/:id", verifyJWT, deleteResumeScan);

export default profileRouter;
