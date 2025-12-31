/**
 * User Types
 * Types for user authentication and profile
 */

/**
 * Base user interface (shared between frontend and backend)
 */
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  resumeHistory: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * User with password (backend only - never send to frontend)
 */
export interface IUserWithPassword extends IUser {
  password: string;
  refreshToken: string | null;
}

/**
 * User document methods (for Mongoose)
 */
export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

/**
 * Signup request payload
 */
export interface ISignupRequest {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Login request payload
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Auth response with tokens
 */
export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Update password request
 */
export interface IUpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * Update profile request
 */
export interface IUpdateProfileRequest {
  fullName?: string;
  avatar?: string;
}

/**
 * JWT payload structure
 */
export interface IJwtPayload {
  _id: string;
  fullName?: string;
  email?: string;
  iat?: number;
  exp?: number;
}
