import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ENV from "../env.js";

/**
 * Admin authorization middleware
 * Checks if the authenticated user is an admin (by email match)
 * Must be used AFTER verifyJWT middleware
 */
const isAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    // Check if user's email matches admin email
    if (req.user.email !== ENV.ADMIN_EMAIL) {
      throw new ApiError(
        403,
        "Forbidden: Admin access required"
      );
    }

    next();
  }
);

export default isAdmin;
