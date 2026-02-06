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
import ENV from "./env.js";
import "./passport/google.strategy.js";
import "./passport/github.strategy.js";

const app = express();

app.use(compression());

// CORS configuration - support multiple origins for development
const allowedOrigins: (string | undefined)[] = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  ENV.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(passport.initialize());

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
