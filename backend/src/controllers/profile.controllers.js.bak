import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ResumeScan from "../models/resumeScan.model.js";
import User from "../models/user.model.js";

export const ResumeScanHistory = asyncHandler(async (req, res) => {
  // Filter to only show Analysis scans (exclude Optimizations)
  // We check for 'key_skills' which exists in Analysis but not Optimization
  const history = await ResumeScan.find({
    owner: req.user._id,
    type: "analysis", // <--- USE THIS. Much faster and cleaner.
  })
    .sort({
      createdAt: -1,
    })
    .select("originalName atsScore thumbnail pdfUrl createdAt _id"); // Don't forget the .select() projection!;
  if (!history || history.length === 0) {
    // Return 200 with empty array, easier for frontend to handle
    return res.status(200).json(new ApiResponse(200, "No history found", []));
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "history sent from backend successfully", history)
    );
});

export const fetchResumeScanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Invalid id");
  }

  // 1. Validate ID format (Optional but good practice for MongoDB ObjectIds)
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   throw new ApiError(400, "Invalid Scan ID format");
  // }

  // 2. Fetch the document (No .select() here, we want the FULL details now)
  const scan = await ResumeScan.findById(id);

  // 3. Check if it exists
  if (!scan) {
    throw new ApiError(404, "Resume not found");
  }

  // 4. CRITICAL SECURITY CHECK: Ensure the requester owns this data
  // Convert ObjectIds to strings for comparison to be safe
  if (scan.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(404, "Not authorised to view this scan");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Scan details fetched successfully", scan));
});
