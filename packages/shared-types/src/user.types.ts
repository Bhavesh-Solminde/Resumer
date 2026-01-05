/**
 * User Types
 * Types for user authentication and profile
 */

/**
 * Base user interface (shared between frontend and backend)
 *
 * ⚠️ ISSUE: Backend defines this locally in models/user.model.ts instead of importing from shared-types
 * TODO: Refactor backend to import this interface OR delete this duplicate
 */
// export interface IUser {
//   _id: string;
//   fullName: string;
//   email: string;
//   avatar: string;
//   resumeHistory: string[];
//   createdAt: string;
//   updatedAt: string;
// }

/**
 * User with password (backend only - never send to frontend)
 *
 * ⚠️ ISSUE: Extends commented IUser; Backend defines locally
 * TODO: Refactor or delete
 */
// export interface IUserWithPassword extends IUser {
//   password: string;
//   refreshToken: string | null;
// }

/**
 * User document methods (for Mongoose)
 *
 * ⚠️ ISSUE: Backend defines these methods locally in models/user.model.ts
 * TODO: Refactor or delete
 */
// export interface IUserMethods {
//   isPasswordCorrect(password: string): Promise<boolean>;
//   generateAccessToken(): Promise<string>;
//   generateRefreshToken(): Promise<string>;
// }

/**
 * Signup request payload
 *
 * ⚠️ ISSUE: Exported but never imported in frontend or backend
 * TODO: Use this in auth controllers/forms OR delete if unnecessary
 */
// export interface ISignupRequest {
//   fullName: string;
//   email: string;
//   password: string;
// }

/**
 * Login request payload
 *
 * ⚠️ ISSUE: Exported but never imported in frontend or backend
 * TODO: Use this in auth controllers/forms OR delete if unnecessary
 */
// export interface ILoginRequest {
//   email: string;
//   password: string;
// }

/**
 * Auth response with tokens
 *
 * ⚠️ ISSUE: Uses IUser which is commented out; also never imported
 * TODO: Uncomment when IUser is fixed
 */
// export interface IAuthResponse {
//   user: IUser;
//   accessToken: string;
//   refreshToken: string;
// }

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
