import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const healthRouter = Router();

/**
 * Health check endpoint for Azure App Service
 * Returns 200 if service is healthy, 503 if unhealthy
 */
healthRouter.get("/health", (req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ...healthCheck,
        message: "Database connection is down",
      });
    }

    return res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error instanceof Error ? error.message : "Error";
    return res.status(503).json(healthCheck);
  }
});

/**
 * Readiness probe endpoint
 * Used by Azure to check if app is ready to receive traffic
 */
healthRouter.get("/ready", (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: "ready" });
  }
  return res.status(503).json({ status: "not ready" });
});

/**
 * Liveness probe endpoint
 * Used by Azure to check if app should be restarted
 */
healthRouter.get("/live", (req: Request, res: Response) => {
  return res.status(200).json({ status: "alive" });
});

export default healthRouter;
