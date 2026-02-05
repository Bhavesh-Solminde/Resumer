import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ResumeBuild, {
  IResumeContent,
  ILayout,
} from "../models/resumeBuild.model.js";
// Type augmentation from ../types/express.d.ts is applied globally

// ============================================================================
// Types
// ============================================================================

interface CreateResumeBody {
  title?: string;
  sourceScanId?: string;
}

interface UpdateResumeBody {
  content?: Partial<IResumeContent>;
  title?: string;
  templateId?: string;
  thumbnail?: string;
  layout?: ILayout;
}

// ============================================================================
// Controllers
// ============================================================================

/**
 * Create a new resume draft
 */
export const storeBuiltResume = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, sourceScanId } = req.body as CreateResumeBody;

    // Validate sourceScanId if provided
    let validSourceScanId = null;
    if (sourceScanId && mongoose.Types.ObjectId.isValid(sourceScanId)) {
      validSourceScanId = sourceScanId;
    }

    const newResume = await ResumeBuild.create({
      userId: req.user!._id,
      title: title || "Untitled Resume",
      sourceScanId: validSourceScanId,
      content: {
        personalInfo: {
          fullName: req.user!.fullName || "",
          email: req.user!.email || "",
        },
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Resume created successfully", newResume));
  }
);

/**
 * Fetch resume build history for dashboard
 */
export const fetchBuildHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const history = await ResumeBuild.find({ userId: req.user!._id })
      .sort({ updatedAt: -1 })
      .select("title thumbnail templateId updatedAt createdAt _id");

    return res
      .status(200)
      .json(new ApiResponse(200, "History fetched successfully", history));
  }
);

/**
 * Fetch a specific resume by ID for editing
 */
export const fetchResumeById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Resume ID");
    }

    const resume = await ResumeBuild.findById(id);

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    if (resume.userId.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, "You are not authorized to view this resume");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Resume loaded successfully", resume));
  }
);

/**
 * Update a resume (auto-save endpoint)
 */
export const updateBuiltResume = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, title, templateId, thumbnail, layout } =
      req.body as UpdateResumeBody;

    // Only allow specific fields to be updated (whitelist approach)
    const updates: Partial<UpdateResumeBody> = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (templateId !== undefined) updates.templateId = templateId;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (layout !== undefined) updates.layout = layout;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Resume ID");
    }

    const updatedResume = await ResumeBuild.findOneAndUpdate(
      { _id: id, userId: req.user!._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      throw new ApiError(404, "Resume not found or unauthorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Resume saved successfully", updatedResume));
  }
);

/**
 * Delete a resume
 */
export const deleteResume = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Resume ID");
    }

    const deletedResume = await ResumeBuild.findOneAndDelete({
      _id: id,
      userId: req.user!._id,
    });

    if (!deletedResume) {
      throw new ApiError(404, "Resume not found or unauthorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Resume deleted successfully", {}));
  }
);
