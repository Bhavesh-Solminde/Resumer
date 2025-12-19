import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport"; // Import passport
import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import profileRouter from "./routes/profile.routes.js";
import ENV from "./env.js";
import "./passport/google.strategy.js"; // Execute the config file
import "./passport/github.strategy.js"; // Execute the config file

const app = express();

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(passport.initialize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/profile", profileRouter);

export default app;
