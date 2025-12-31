import mongoose, { Document, Model, Schema, Types } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import ENV from "../env.js";

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
  },
  { timestamps: true }
);

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

const User = mongoose.model<IUser, UserModel>("User", UserSchema);
export default User;
