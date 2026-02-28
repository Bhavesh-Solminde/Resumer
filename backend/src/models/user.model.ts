import mongoose, { Document, Model, Schema, Types } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import ENV from "../env.js";

/**
 * Monthly usage tracking subdocument
 */
export interface IMonthlyUsage {
  month: string; // "YYYY-MM"
  creditsUsed: number;
  operationType: "analysis" | "optimization_general" | "optimization_jd";
  operationCount: number;
}

/**
 * Subscription tier type
 */
export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

/**
 * User document interface
 */
export interface IUser {
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string | null;
  resumeHistory: Types.ObjectId[];

  // Credits (one-time purchase, never expire)
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: SubscriptionTier; // Tracks highest plan purchased (free/basic/pro)
  starterOfferClaimed: boolean; // Whether user has claimed the ₹9 starter offer
  monthlyUsage: IMonthlyUsage[];

  createdAt: Date;
  updatedAt: Date;
}

/**
 * User document methods
 */
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  hasCredits(amount: number): boolean;
}

/**
 * User document type (combines interface with Document and methods)
 */
export type UserDocument = Document<Types.ObjectId> & IUser & IUserMethods;

/**
 * User model type
 */
type UserModel = Model<IUser, object, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // Google Profile Picture
      default: "",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    resumeHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "ResumeScan",
      },
    ],

    // ── Credits (one-time purchase, never expire) ──
    credits: {
      type: Number,
      default: 20, // Free tier default
      min: 0,
    },
    totalCreditsUsed: {
      type: Number,
      default: 0,
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free",
    },
    starterOfferClaimed: {
      type: Boolean,
      default: false,
    },
    monthlyUsage: [
      {
        month: { type: String, required: true },
        creditsUsed: { type: Number, default: 0 },
        operationType: {
          type: String,
          enum: ["analysis", "optimization_general", "optimization_jd"],
          required: true,
        },
        operationCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// ── Indexes ──
UserSchema.index({ credits: 1 });
UserSchema.index({ "monthlyUsage.month": 1 });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function (): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    ENV.ACCESS_TOKEN_SECRET,
    // Type assertion needed because ENV values are strings, but jwt expects specific types
    { expiresIn: ENV.ACCESS_TOKEN_EXPIRY } as SignOptions
  );
};

UserSchema.methods.generateRefreshToken = async function (): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    // Type assertion needed because ENV values are strings, but jwt expects specific types
    { expiresIn: ENV.REFRESH_TOKEN_EXPIRY } as SignOptions
  );
};

UserSchema.methods.hasCredits = function (amount: number): boolean {
  return this.credits >= amount;
};

const User = mongoose.model<IUser, UserModel>("User", UserSchema);
export default User;
