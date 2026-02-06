import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import FaqAnalytics from "../models/faqAnalytics.model.js";

// ============================================================================
// Controller: Track FAQ View
// ============================================================================

export const trackFaqView = asyncHandler(
  async (req: Request, res: Response) => {
    const { faqId } = req.params;

    if (!faqId) {
      throw new ApiError(400, "FAQ ID is required");
    }

    await FaqAnalytics.findOneAndUpdate(
      { faqId },
      {
        $inc: { views: 1 },
        $set: { lastViewed: new Date() },
      },
      { upsert: true, new: true },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "View tracked", null));
  },
);

// ============================================================================
// Controller: Track FAQ Vote
// ============================================================================

export const trackFaqVote = asyncHandler(
  async (req: Request, res: Response) => {
    const { faqId } = req.params;
    const { helpful } = req.body as { helpful: boolean };

    if (!faqId) {
      throw new ApiError(400, "FAQ ID is required");
    }

    if (typeof helpful !== "boolean") {
      throw new ApiError(400, "helpful must be a boolean");
    }

    const updateField = helpful
      ? { $inc: { helpfulVotes: 1 } }
      : { $inc: { notHelpfulVotes: 1 } };

    const result = await FaqAnalytics.findOneAndUpdate(
      { faqId },
      updateField,
      { upsert: true, new: true },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Vote recorded", {
        helpfulVotes: result.helpfulVotes,
        notHelpfulVotes: result.notHelpfulVotes,
      }));
  },
);

// ============================================================================
// Controller: Get FAQ Analytics (for admin/internal use)
// ============================================================================

export const getFaqAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const analytics = await FaqAnalytics.find()
      .sort({ views: -1 })
      .lean();

    return res
      .status(200)
      .json(new ApiResponse(200, "FAQ analytics retrieved", analytics));
  },
);
