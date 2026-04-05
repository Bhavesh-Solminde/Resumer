import { Request, Response, NextFunction, RequestHandler } from "express";
import mongoose from "mongoose";

/**
 * Async handler wrapper to avoid try-catch blocks in every controller.
 * Catches any errors thrown by async functions and passes them to the error handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRequestHandler<T = any> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

/**
 * Sanitize error information for logging — strips raw input values and
 * limits output to message + stack to avoid leaking sensitive data.
 */
const sanitizeForLogging = (err: unknown): { message: string; stack?: string } => {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  }
  return { message: String(err) };
};

const asyncHandler = <T = unknown>(
  fn: AsyncRequestHandler<T>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as Request<T>, res, next);
    } catch (err: unknown) {
      // Log sanitized error information only
      const sanitized = sanitizeForLogging(err);
      console.error("❌ Error in async handler:", sanitized.message);
      if (sanitized.stack) {
        console.error("Stack:", sanitized.stack);
      }

      // Handle Mongoose CastError specifically — route through global error middleware
      if (err instanceof mongoose.Error.CastError) {
        const castErr = err as mongoose.Error.CastError;
        console.error(
          `🔴 Mongoose CastError on field "${castErr.path}"`
        );
        const error = new Error(`Invalid data type for field: ${castErr.path}`);
        (error as Error & { statusCode?: number }).statusCode = 400;
        return next(error);
      }

      // Handle Mongoose ValidationError — route through global error middleware
      if (err instanceof mongoose.Error.ValidationError) {
        console.error("🔴 Mongoose ValidationError:", sanitized.message);
        const error = new Error(err.message || "Validation failed");
        (error as Error & { statusCode?: number }).statusCode = 400;
        return next(error);
      }

      // Pass all other errors to the global error handler
      next(err);
    }
  };
};

export default asyncHandler;
