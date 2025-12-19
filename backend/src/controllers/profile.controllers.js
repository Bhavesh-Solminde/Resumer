import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ResumeScan from "../models/resumeScan.model.js";
import User from "../models/user.model.js";

export const ResumeScanHistory = asyncHandler(async (req, res) => {
  const history = await ResumeScan.find({ owner: req?.user._id });
  if (!history) {
    throw new ApiError(404, "History not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "history sent from backend successfully", history)
    );
});
