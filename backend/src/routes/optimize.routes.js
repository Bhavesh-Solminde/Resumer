import Router from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  handleGeneralOptimization,
  handleJdOptimization,
} from "../controllers/optimize.controllers";
import upload from "../middlewares/memory.middleware";

const optimizeRouter = Router();

optimizeRouter.post(
  "/general",
  verifyJWT,
  upload.single(),
  handleGeneralOptimization
);
optimizeRouter.post("/jd", verifyJWT, upload.single(), handleJdOptimization);

export default optimizeRouter;
