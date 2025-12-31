import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ENV from "../env.js";
import User from "../models/user.model.js";
// Type augmentation from ../types/express.d.ts is applied globally

interface DecodedToken extends JwtPayload {
  _id: string;
}

/**
 * JWT verification middleware
 * Attaches user to req.user if token is valid
 */
const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized request");
      }
      const decodedToken = jwt.verify(
        accessToken,
        ENV.ACCESS_TOKEN_SECRET
      ) as DecodedToken;

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      const err = error as { message?: string };
      throw new ApiError(401, err?.message || "Invalid access token");
    }
  }
);

export default verifyJWT;
