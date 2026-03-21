import { Request, Response, NextFunction, RequestHandler } from "express";

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

const asyncHandler = <T = unknown>(
  fn: AsyncRequestHandler<T>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as Request<T>, res, next);
    } catch (err: unknown) {
      // Log the full error for debugging
      console.error("❌ Error in async handler:", err);

      // Handle Mongoose CastError specifically
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        err.name === "CastError"
      ) {
        const castErr = err as {
          kind?: string;
          path?: string;
          value?: unknown;
        };
        console.error(
          `🔴 Mongoose CastError on field "${castErr.path}": Value ${JSON.stringify(castErr.value)} cannot be cast to ${castErr.kind}`
        );
        return res.status(400).json({
          success: false,
          message: `Invalid data type for field: ${castErr.path}`,
        });
      }

      // Handle Mongoose ValidationError
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        err.name === "ValidationError"
      ) {
        console.error("🔴 Mongoose ValidationError:", err);
        return res.status(400).json({
          success: false,
          message:
            (err as { message?: string }).message || "Validation failed",
        });
      }

      const error = err as { statusCode?: number; message?: string };

      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export default asyncHandler;
