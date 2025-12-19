import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { ResumeScanHistory } from "../controllers/profile.controllers.js";

const profileRouter = Router();

profileRouter.get("/history", verifyJWT, ResumeScanHistory);

export default profileRouter;
