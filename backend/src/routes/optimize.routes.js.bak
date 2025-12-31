import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  optimizeResume,
  optimizeJd,
  saveResumeScan,
  uploadToCloudinaryMiddleware,
} from "../controllers/optimize.controllers.js";
import upload from "../middlewares/memory.middleware.js";

const optimizeRouter = Router();

optimizeRouter.post(
  "/optimize/general",
  verifyJWT,
  upload.single("resume"),
  uploadToCloudinaryMiddleware,
  optimizeResume,
  saveResumeScan
);

optimizeRouter.post(
  "/optimize/jd",
  verifyJWT,
  upload.single("resume"),
  uploadToCloudinaryMiddleware,
  optimizeJd,
  saveResumeScan
);

export default optimizeRouter;
