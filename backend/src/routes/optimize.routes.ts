import { Router, Request, Response, NextFunction } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import checkCredits from "../middlewares/checkCredits.middleware.js";
import {
  optimizeResume,
  optimizeJd,
  saveResumeScan,
  uploadToCloudinaryMiddleware,
} from "../controllers/optimize.controllers.js";
import upload from "../middlewares/memory.middleware.js";

const optimizeRouter = Router();

/**
 * Optional multer middleware — only parses file if Content-Type is multipart.
 * When no file is uploaded (plain JSON body), skip multer entirely so
 * the controller can fall back to the database for resume text.
 */
const optionalFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return upload.single("resume")(req, res, next);
  }
  next();
};

optimizeRouter.post(
  "/optimize/general",
  verifyJWT,
  checkCredits(10, "optimization_general"),
  optionalFileUpload,
  uploadToCloudinaryMiddleware,
  optimizeResume,
  saveResumeScan,
);

optimizeRouter.post(
  "/optimize/jd",
  verifyJWT,
  checkCredits(15, "optimization_jd"),
  optionalFileUpload,
  uploadToCloudinaryMiddleware,
  optimizeJd,
  saveResumeScan,
);

export default optimizeRouter;
