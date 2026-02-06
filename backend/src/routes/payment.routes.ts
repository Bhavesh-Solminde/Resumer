import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  verifyPayment,
  handleRazorpayWebhook,
  getSubscriptionStatus,
  getUsageStats,
} from "../controllers/payment.controllers.js";

const paymentRouter = Router();

// Webhook (no auth - Razorpay calls this directly, verified via signature)
paymentRouter.post("/webhook", handleRazorpayWebhook);

// Authenticated routes
paymentRouter.post("/subscribe", verifyJWT, createSubscription);
paymentRouter.post("/verify", verifyJWT, verifyPayment);
paymentRouter.get("/status", verifyJWT, getSubscriptionStatus);
paymentRouter.get("/usage", verifyJWT, getUsageStats);

export default paymentRouter;
