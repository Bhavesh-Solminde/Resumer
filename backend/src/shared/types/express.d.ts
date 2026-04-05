import { Document, Types } from "mongoose";
import { UploadApiResponse } from "cloudinary";

/**
 * User document from MongoDB (attached to req.user by auth middleware)
 */
export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string | null;
  resumeHistory: Types.ObjectId[];

  // Credits
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: "free" | "basic" | "pro" | "enterprise";

  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  hasCredits(amount: number): boolean;
}

/**
 * Cloudinary upload result
 */
export type CloudinaryResult = UploadApiResponse;

/**
 * AI Analysis result attached to req
 */
export interface IAiAnalysisResult {
  [key: string]: unknown;
}

declare global {
  namespace Express {
    // Override the User type to include our custom properties
    interface User extends IUserDocument {}

    interface Request {
      /**
       * Result from Cloudinary upload middleware
       */
      cloudinaryResult?: CloudinaryResult;

      /**
       * Result from AI analysis middleware
       */
      aiAnalysisResult?: IAiAnalysisResult;

      /**
       * Resume text extracted from PDF
       */
      resumeText?: string;
    }
  }
}

export {};
