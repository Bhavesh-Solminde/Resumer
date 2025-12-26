import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ResumeBuild from "../models/resumeBuild.model.js";

// 1. CREATE NEW DRAFT (Blank or with Initial Data)
export const storeBuiltResume = asyncHandler(async (req, res) => {
  const { title } = req.body;

  // Create a fresh resume. Mongoose defaults will handle empty arrays.
  const newResume = await ResumeBuild.create({
    userId: req.user._id,
    title: title || "Untitled Resume",
    content: {
      personalInfo: {
        fullName: req.user.fullName || "",
        email: req.user.email || "",
      },
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Resume created successfully", newResume));
});

// 2. FETCH HISTORY (Lightweight List for Dashboard)
export const fetchBuildHistory = asyncHandler(async (req, res) => {
  const history = await ResumeBuild.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .select("title thumbnail templateId updatedAt createdAt _id");

  return res
    .status(200)
    .json(new ApiResponse(200, "History fetched successfully", history));
});

// 3. FETCH BY ID (Full Editor Load)
export const fetchResumeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Resume ID");
  }

  const resume = await ResumeBuild.findById(id);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this resume");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume loaded successfully", resume));
});

// 4. UPDATE (The Auto-Save Endpoint)
export const updateBuiltResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, title, templateId, thumbnail, layout } = req.body.data;

  // Only allow specific fields to be updated (whitelist approach)
  const updates = {};
  if (content !== undefined) updates.content = content;
  if (title !== undefined) updates.title = title;
  if (templateId !== undefined) updates.templateId = templateId;
  if (thumbnail !== undefined) updates.thumbnail = thumbnail;
  if (layout !== undefined) updates.layout = layout;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Resume ID");
  }

  const updatedResume = await ResumeBuild.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedResume) {
    throw new ApiError(404, "Resume not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume saved successfully", updatedResume));
});

// 5. DELETE
export const deleteResume = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Resume ID");
  }

  const deletedResume = await ResumeBuild.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!deletedResume) {
    throw new ApiError(404, "Resume not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Resume deleted successfully", {}));
});
