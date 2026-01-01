import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; // Import compression
import passport from "passport"; // Import passport
import authRouter from "./routes/auth.routes.js";
import analyzeRouter from "./routes/analyze.routes.js";
import profileRouter from "./routes/profile.routes.js";
import ENV from "./env.js";
import "./passport/google.strategy.js"; // Execute the config file
import "./passport/github.strategy.js"; // Execute the config file
import optimizeRouter from "./routes/optimize.routes.js";
import buildRouter from "./routes/build.routes.js";

const app = express();

app.use(compression()); // Compress all responses

// CORS configuration - support multiple origins for development
const allowedOrigins = [
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resume", analyzeRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/resume", optimizeRouter);
app.use("/api/v1/resume", buildRouter);

export default app;
