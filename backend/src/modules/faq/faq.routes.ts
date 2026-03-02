import { Router } from "express";
import {
  trackFaqView,
  trackFaqVote,
  getFaqAnalytics,
} from "./faq.controller.js";
import verifyJWT from "../auth/auth.middleware.js";
import isAdmin from "../auth/isAdmin.middleware.js";

const faqRouter = Router();

// Public routes (no auth needed for tracking)
faqRouter.post("/:faqId/view", trackFaqView);
faqRouter.post("/:faqId/vote", trackFaqVote);

// Analytics (protected - admin only)
faqRouter.get("/analytics", verifyJWT, isAdmin, getFaqAnalytics);

export default faqRouter;
