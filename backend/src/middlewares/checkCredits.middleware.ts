import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * Middleware factory: Check if user has enough credits AND deduct them eagerly.
 *
 * Credits are deducted BEFORE the controller runs. This is simpler and more
 * reliable than trying to deduct after the response is sent (which can fail
 * silently with compression or streaming). If the controller later fails with
 * a 5xx, credits are still consumed — this is an acceptable tradeoff since
 * most failures are transient and retries are possible.
 *
 * Also tracks monthly usage per operation type.
 *
 * @param requiredCredits - Number of credits required for this operation
 * @param operationType - Type of credit operation for tracking
 */
const checkCredits = (
  requiredCredits: number,
  operationType: "analysis" | "optimization_general" | "optimization_jd",
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }

      // Backfill credits for users created before credit system.
      await User.updateOne(
        { _id: req.user._id, credits: { $exists: false } },
        { $set: { credits: 20, totalCreditsUsed: 0, subscriptionTier: "free" } },
      );

      // Atomic check-and-deduct: filter guarantees sufficient balance
      const result = await User.findOneAndUpdate(
        { _id: req.user._id, credits: { $gte: requiredCredits } },
        { $inc: { credits: -requiredCredits, totalCreditsUsed: requiredCredits } },
        { new: true, projection: { credits: 1 } },
      );

      if (!result) {
        // Either user not found or insufficient credits — disambiguate:
        const user = await User.findById(req.user._id).select("credits");
        if (!user) throw new ApiError(404, "User not found");
        throw new ApiError(
          403,
          `Insufficient credits. You need ${requiredCredits} credits but have ${user.credits ?? 0}. Buy more credits to continue.`,
        );
      }

      const currentMonth = new Date().toISOString().slice(0, 7);

      // Upsert monthly usage tracking
      const monthlyUpdate = await User.updateOne(
        {
          _id: req.user._id,
          "monthlyUsage.month": currentMonth,
          "monthlyUsage.operationType": operationType,
        },
        {
          $inc: {
            "monthlyUsage.$.creditsUsed": requiredCredits,
            "monthlyUsage.$.operationCount": 1,
          },
        },
      );

      // If no existing entry for this month+operation, push a new one
      if (monthlyUpdate.matchedCount === 0) {
        await User.updateOne(
          { _id: req.user._id },
          {
            $push: {
              monthlyUsage: {
                month: currentMonth,
                creditsUsed: requiredCredits,
                operationType,
                operationCount: 1,
              },
            },
          },
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkCredits;
