import { Router } from "express";
import { submitContactForm } from "../controllers/contact.controllers.js";
import rateLimit from "express-rate-limit";

// Rate limiter: 5 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    statusCode: 429,
    success: false,
    message: "Too many contact submissions. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactRouter = Router();

contactRouter.post("/", contactLimiter, submitContactForm);

export default contactRouter;
