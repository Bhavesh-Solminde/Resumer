import { Router } from "express";
import express from "express";
import verifyJWT from "../auth/auth.middleware.js";
import {
  createSubscription,
  verifyPayment,
  handleCashfreeWebhook,
  getSubscriptionStatus,
  getUsageStats,
} from "./payment.controller.js";

const paymentRouter = Router();

// Webhook (no auth - Cashfree calls this directly, verified via signature)
// Use raw body for webhook signature verification
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleCashfreeWebhook
);

// Authenticated routes
paymentRouter.post("/subscribe", verifyJWT, createSubscription);
paymentRouter.post("/verify", verifyJWT, verifyPayment);
paymentRouter.get("/status", verifyJWT, getSubscriptionStatus);
paymentRouter.get("/usage", verifyJWT, getUsageStats);

export default paymentRouter;
