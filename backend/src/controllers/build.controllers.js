import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ResumeBuild } from "../models/resumeBuild.model.js";
export const storeBuiltResume = asyncHandler((req, res) => {
  const resume = req.body;
});
export const fetchBuildHistory = asyncHandler((req, res) => {});
export const fetchResumeById = asyncHandler((req, res) => {});
export const deleteResume = asyncHandler((req, res) => {});
