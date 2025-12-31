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
      const error = err as { statusCode?: number; message?: string };
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export default asyncHandler;
