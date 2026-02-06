import { Router } from "express";
import {
  trackFaqView,
  trackFaqVote,
  getFaqAnalytics,
} from "../controllers/faq.controllers.js";

const faqRouter = Router();

// Public routes (no auth needed for tracking)
faqRouter.post("/:faqId/view", trackFaqView);
faqRouter.post("/:faqId/vote", trackFaqVote);

// Analytics (could be protected later for admin)
faqRouter.get("/analytics", getFaqAnalytics);

export default faqRouter;
