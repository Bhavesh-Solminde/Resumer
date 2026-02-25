import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
import analyzeRouter from "./routes/analyze.routes.js";
import profileRouter from "./routes/profile.routes.js";
import optimizeRouter from "./routes/optimize.routes.js";
import buildRouter from "./routes/build.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import contactRouter from "./routes/contact.routes.js";
import faqRouter from "./routes/faq.routes.js";
import healthRouter from "./routes/health.routes.js";
import csrfProtection from "./middlewares/csrf.middleware.js";
import ENV from "./env.js";
import "./passport/google.strategy.js";
import "./passport/github.strategy.js";

const app = express();

app.use(compression());

// CORS configuration - support multiple origins for development
const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://resumerapp.live"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed (ignoring trailing slashes)
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        // Pass false instead of throwing an Error to prevent 500 crashes
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// Webhook path constant (used for raw body parsing)
const WEBHOOK_PATH = "/api/v1/payment/webhook";

// Initialize JSON middleware once
const jsonParser = express.json({ limit: "16kb" });

// Conditional JSON parsing — skip for webhook routes that need raw body
app.use((req, res, next) => {
  if (req.path === WEBHOOK_PATH) {
    // Skip JSON parsing for webhook — express.raw() will handle it in the route
    next();
  } else {
    jsonParser(req, res, next);
  }
});

app.use(cookieParser());
app.use(csrfProtection);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(passport.initialize());

// Health check routes (no auth required)
app.use("/api/v1", healthRouter);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resume", analyzeRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/resume", optimizeRouter);
app.use("/api/v1/resume", buildRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/faq", faqRouter);

// ── Global Error Handler ──
// Catches errors from next(error) in middleware (e.g., checkCredits)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as { statusCode?: number; message?: string; errors?: string[] };
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  if (statusCode === 500) {
    console.error("Unhandled server error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    data: null,
  });
});

export default app;
