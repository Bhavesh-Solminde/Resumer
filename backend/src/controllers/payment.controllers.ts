import { Request, Response } from "express";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import razorpay, { PLAN_CONFIG } from "../lib/razorpay.js";
import { sendCreditPurchaseEmail } from "../lib/email.js";
import User from "../models/user.model.js";
import PaymentLog from "../models/paymentLog.model.js";
import ENV from "../env.js";

// ============================================================================
// Types
// ============================================================================

interface CreateOrderBody {
  plan: "basic" | "pro";
}

interface VerifyPaymentBody {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ============================================================================
// Controller: Create Order (One-time credit purchase)
// ============================================================================

export const createSubscription = asyncHandler(
  async (req: Request<object, object, CreateOrderBody>, res: Response) => {
    const { plan } = req.body;

    if (!plan || !PLAN_CONFIG[plan]) {
      throw new ApiError(400, "Invalid plan. Must be 'basic' or 'pro'.");
    }

    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const planConfig = PLAN_CONFIG[plan];

    // Create Razorpay Order (one-time payment — all methods supported)
    const order = await razorpay.orders.create({
      amount: planConfig.price * 100, // Convert to paise
      currency: "INR",
      receipt: `rcpt_${user._id.toString().slice(-8)}_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        plan,
        email: user.email,
      },
    });

    return res.status(200).json(
      new ApiResponse(200, "Order created", {
        orderId: order.id,
        razorpayKeyId: ENV.RAZORPAY_KEY_ID,
        plan,
        amount: planConfig.price,
        currency: "INR",
      }),
    );
  },
);

// ============================================================================
// Controller: Verify Payment (after Razorpay checkout)
// ============================================================================

export const verifyPayment = asyncHandler(
  async (req: Request<object, object, VerifyPaymentBody>, res: Response) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new ApiError(400, "Missing payment verification details");
    }

    if (!req.user?._id) throw new ApiError(401, "Unauthorized");

    // Verify signature: HMAC SHA256 of "order_id|payment_id"
    const generatedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Log failed payment
      await PaymentLog.create({
        userId: req.user._id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount: 0,
        status: "failed",
        failure_reason: "Signature verification failed",
        ipAddress: req.ip || null,
      });
      throw new ApiError(400, "Payment verification failed. Invalid signature.");
    }

    // Fetch order details from Razorpay to determine the plan
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes as Record<string, string> | undefined;
    const plan = notes?.plan as "basic" | "pro" | undefined;

    if (!plan || !PLAN_CONFIG[plan]) {
      throw new ApiError(400, "Could not determine plan from order");
    }

    const creditsToAdd = PLAN_CONFIG[plan].credits;

    // Idempotency: skip if credits were already granted for this payment
    const existingLog = await PaymentLog.findOne({
      razorpay_payment_id,
      status: "success",
    });
    if (existingLog) {
      const user = await User.findById(req.user._id).select("credits subscriptionTier");
      if (!user) throw new ApiError(404, "User not found");
      return res.status(200).json(
        new ApiResponse(200, "Payment already processed", {
          subscriptionTier: user.subscriptionTier,
          credits: user.credits,
        }),
      );
    }

    // ADD credits to existing balance (not replace) and update tier
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { credits: creditsToAdd },
        $set: { subscriptionTier: plan },
      },
      { new: true },
    );

    if (!user) throw new ApiError(404, "User not found");

    // Log successful payment
    await PaymentLog.create({
      userId: req.user._id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount: PLAN_CONFIG[plan].price * 100, // In paise
      currency: "INR",
      status: "success",
      plan,
      creditsGranted: creditsToAdd,
      ipAddress: req.ip || null,
    });

    // Send confirmation email (non-blocking)
    sendCreditPurchaseEmail(user.fullName, user.email, plan, creditsToAdd, user.credits).catch(
      (err) => console.error("Failed to send purchase email:", err),
    );

    return res.status(200).json(
      new ApiResponse(200, "Payment verified — credits added to your account", {
        subscriptionTier: user.subscriptionTier,
        credits: user.credits,
      }),
    );
  },
);

// ============================================================================
// Controller: Razorpay Webhook Handler
// ============================================================================

export const handleRazorpayWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const webhookSecret = ENV.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature using raw body buffer
    const signature = req.headers["x-razorpay-signature"] as string;
    // req.body is a Buffer when express.raw() middleware is used
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature verification failed");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Parse body if it's a Buffer (from express.raw)
    const bodyData = Buffer.isBuffer(req.body) ? JSON.parse(rawBody.toString("utf-8")) : req.body;
    const event = bodyData.event as string;
    const payload = bodyData.payload;

    console.log(`Razorpay webhook received: ${event}`);

    switch (event) {
      case "payment.captured": {
        const paymentEntity = payload.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;
        const notes = paymentEntity?.notes;

        if (orderId && notes?.userId && notes?.plan) {
          const plan = notes.plan as "basic" | "pro";
          const planConfig = PLAN_CONFIG[plan];

          if (planConfig) {
            // ADD credits (not replace) — idempotent check via PaymentLog
            const existingLog = await PaymentLog.findOne({ razorpay_payment_id: paymentId });
            if (!existingLog || existingLog.status !== "success") {
              await User.findByIdAndUpdate(notes.userId, {
                $inc: { credits: planConfig.credits },
                $set: { subscriptionTier: plan },
              });
            }

            // Log webhook payment (upsert — might already exist from verify)
            if (paymentId) {
              await PaymentLog.findOneAndUpdate(
                { razorpay_payment_id: paymentId },
                {
                  userId: notes.userId,
                  razorpay_payment_id: paymentId,
                  razorpay_order_id: orderId,
                  amount: paymentEntity.amount || 0,
                  currency: paymentEntity.currency || "INR",
                  status: "success",
                  plan,
                  creditsGranted: planConfig.credits,
                  payment_method: paymentEntity.method || "unknown",
                },
                { upsert: true },
              ).catch((err: unknown) =>
                console.error("Failed to log webhook payment:", err),
              );
            }
          }
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = payload.payment?.entity;
        const paymentId = paymentEntity?.id;
        const orderId = paymentEntity?.order_id || null;
        const notes = paymentEntity?.notes;

        if (paymentId) {
          await PaymentLog.create({
            userId: notes?.userId || null,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            amount: paymentEntity?.amount || 0,
            currency: paymentEntity?.currency || "INR",
            status: "failed",
            failure_reason:
              paymentEntity?.error_description || "Payment failed",
            payment_method: paymentEntity?.method || "unknown",
          }).catch((err: unknown) =>
            console.error("Failed to log failed payment:", err),
          );
        }
        break;
      }
    }

    // Always return 200 to acknowledge webhook
    return res.status(200).json({ status: "ok" });
  },
);

// ============================================================================
// Controller: Get Credit Status
// ============================================================================

export const getSubscriptionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");

    const user = await User.findById(req.user._id).select(
      "credits totalCreditsUsed subscriptionTier",
    );

    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
      new ApiResponse(200, "Credit status retrieved", {
        credits: user.credits ?? 20,
        totalCreditsUsed: user.totalCreditsUsed ?? 0,
        subscriptionTier: user.subscriptionTier ?? "free",
      }),
    );
  },
);

// ============================================================================
// Controller: Get Usage Statistics
// ============================================================================

export const getUsageStats = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");

    const user = await User.findById(req.user._id).select(
      "credits totalCreditsUsed subscriptionTier monthlyUsage",
    );

    if (!user) throw new ApiError(404, "User not found");

    // Get current month usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthUsage = user.monthlyUsage.filter(
      (u) => u.month === currentMonth,
    );

    // Get payment history
    const payments = await PaymentLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json(
      new ApiResponse(200, "Usage statistics retrieved", {
        credits: user.credits,
        totalCreditsUsed: user.totalCreditsUsed,
        subscriptionTier: user.subscriptionTier,
        currentMonthUsage,
        recentPayments: payments,
      }),
    );
  },
);
