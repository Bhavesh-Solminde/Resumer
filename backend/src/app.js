import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import ENV from "./env.js";

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resume", resumeRouter);

export default app;
