import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User, { UserDocument } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ENV from "../env.js";
// Type augmentation from ../types/express.d.ts is applied globally
import { Types } from "mongoose";

// ============================================================================
// Types
// ============================================================================

interface RegisterBody {
  fullName?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

interface UpdatePasswordBody {
  oldPassword?: string;
  newPassword?: string;
}

interface UpdateProfileBody {
  fullName?: string;
}

interface DecodedRefreshToken extends JwtPayload {
  _id: string;
}

// ============================================================================
// Utilities
// ============================================================================

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const generateAccessAndRefreshTokens = async (
  userId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  maxAge: 60 * 60 * 1000, // 1 hour
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
});

// ============================================================================
// Controllers
// ============================================================================

export const handleRegister = asyncHandler(
  async (req: Request<object, object, RegisterBody>, res: Response) => {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing");
    }
    const { fullName, email, password } = req.body;

    if (
      [fullName, email, password].some((field) => !field || field.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (!emailRegex.test(email!)) {
      throw new ApiError(
        400,
        "Invalid email format! Please provide a valid email."
      );
    }

    if (password!.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long.");
    }

    console.log("Creating User");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists.");
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Internal server error user could not be stored");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as Types.ObjectId
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .json(new ApiResponse(201, "User Registered successfully", createdUser));
  }
);

export const handleLogin = asyncHandler(
  async (req: Request<object, object, LoginBody>, res: Response) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new ApiError(400, "email or password is required");
    }

    const user = (await User.findOne({ email })) as UserDocument | null;
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as Types.ObjectId
    );

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  }
);

export const handleLogout = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (await User.findById(req.user?._id)) as UserDocument | null;
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .clearCookie("accessToken", getAccessCookieOptions())
      .clearCookie("refreshToken", getRefreshCookieOptions())
      .json(new ApiResponse(200, "User logged out successfully", {}));
  }
);

export const handleUpdatePassword = asyncHandler(
  async (req: Request<object, object, UpdatePasswordBody>, res: Response) => {
    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Old and new password are required");
    }

    const user = (await User.findById(req.user?._id)) as UserDocument | null;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, "Password updated successfully", {}));
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "User not Authorised");
    }

    try {
      const decoded = jwt.verify(
        incomingRefreshToken,
        ENV.REFRESH_TOKEN_SECRET
      ) as DecodedRefreshToken;
      const user = (await User.findById(decoded?._id)) as UserDocument | null;

      if (!user) {
        throw new ApiError(401, "User not found || Wrong refresh token");
      }

      if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(
          401,
          "User not Authorised || refresh token didnt match"
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id as Types.ObjectId);

      return res
        .status(201)
        .cookie("accessToken", accessToken, getAccessCookieOptions())
        .cookie("refreshToken", newRefreshToken, getRefreshCookieOptions())
        .json(
          new ApiResponse(201, "AccessToken generated successfully", {
            accessToken,
            refreshToken: newRefreshToken,
          })
        );
    } catch {
      throw new ApiError(500, "Internal server error");
    }
  }
);

export const handleGoogleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    // Passport attaches the authenticated user to req.user
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Authentication failed");
    }

    // Generate YOUR tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as Types.ObjectId
    );

    // Redirect user back to Frontend Dashboard with cookies set
    const frontendUrl = ENV.CORS_ORIGIN || "http://localhost:5173";
    res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .redirect(`${frontendUrl}/resume/analyze`);
  }
);

export const updateProfile = asyncHandler(
  async (req: Request<object, object, UpdateProfileBody>, res: Response) => {
    const { fullName } = req.body;

    if (!fullName || fullName.trim() === "") {
      throw new ApiError(400, "Full Name is required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully", user));
  }
);
