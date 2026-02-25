import { Request, Response, NextFunction } from "express";
import ENV from "../env.js";

/**
 * CSRF protection middleware using strict Origin/Referer validation.
 *
 * When sameSite is "none" in production (cross-origin cookies between
 * Vercel frontend and Azure backend), this middleware verifies that
 * state-changing requests (POST, PUT, PATCH, DELETE) originate from
 * an allowed Origin or Referer.
 *
 * Safe methods (GET, HEAD, OPTIONS) are always allowed.
 */
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Only enforce in production where sameSite is "none"
  if (ENV.NODE_ENV !== "production") {
    return next();
  }

  // Safe methods don't need CSRF protection
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method.toUpperCase())) {
    return next();
  }

  // Build the allowlist from CORS config
  const envOrigins = ENV.CORS_ORIGIN 
    ? ENV.CORS_ORIGIN.split(",").map(o => o.trim().replace(/\/$/, "")) 
    : [];

  const allowedOrigins = new Set<string>(
    [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://resumerapp.live",
      "https://www.resumerapp.live",
      ...envOrigins
    ].filter((o): o is string => !!o),
  );

  // Check Origin header first (preferred — set by browsers on cross-origin requests)
  const origin = req.headers.origin;
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.has(normalizedOrigin)) {
      return next();
    }
    console.warn(`[CSRF] Blocked request: Origin "${origin}" not in allowlist`);
    return res.status(403).json({ error: "Forbidden: Invalid origin" });
  }

  // Fallback to Referer header (for same-origin requests where Origin may be absent)
  const referer = req.headers.referer;
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin.replace(/\/$/, "");
      if (allowedOrigins.has(refererOrigin)) {
        return next();
      }
    } catch {
      // Malformed referer — reject
    }
    console.warn(`[CSRF] Blocked request: Referer "${referer}" not in allowlist`);
    return res.status(403).json({ error: "Forbidden: Invalid referer" });
  }

  // No Origin and no Referer on a mutating request — reject
  console.warn(`[CSRF] Blocked request: Missing Origin and Referer headers on ${req.method} ${req.path}`);
  return res.status(403).json({ error: "Forbidden: Missing origin header" });
};

export default csrfProtection;
