import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ResumeScan from "../models/resumeScan.model.js";
// Type augmentation from ../types/express.d.ts is applied globally

/**
 * Get resume scan history for the authenticated user
 */
export const ResumeScanHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const history = await ResumeScan.find({
      owner: req.user!._id,
      type: "analysis",
    })
      .sort({ createdAt: -1 })
      .select("originalName atsScore thumbnail pdfUrl createdAt _id");

    if (!history || history.length === 0) {
      return res.status(200).json(new ApiResponse(200, "No history found", []));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "history sent from backend successfully", history)
      );
  }
);

/**
 * Fetch a specific resume scan by ID
 */
export const fetchResumeScanById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Invalid id");
    }

    const scan = await ResumeScan.findById(id);

    if (!scan) {
      throw new ApiError(404, "Resume not found");
    }

    // CRITICAL SECURITY CHECK: Ensure the requester owns this data
    if (scan.owner.toString() !== req.user!._id.toString()) {
      throw new ApiError(404, "Not authorised to view this scan");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Scan details fetched successfully", scan));
  }
);
