import { Request, Response } from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import cashfree, { PLAN_CONFIG } from "./cashfree.js";
import { sendCreditPurchaseEmail } from "../../shared/lib/email.js";
import User from "../auth/user.model.js";
import PaymentLog from "./paymentLog.model.js";
import ENV from "../../env.js";
import type { CreateOrderRequest, PaymentEntity } from "cashfree-pg";

// ============================================================================
// Types
// ============================================================================

interface CreateOrderBody {
  plan: "starter" | "basic" | "pro";
}

interface VerifyPaymentBody {
  order_id: string;
}

// ============================================================================
// Controller: Create Order (One-time credit purchase via Cashfree)
// ============================================================================

export const createSubscription = asyncHandler(
  async (req: Request<object, object, CreateOrderBody>, res: Response) => {
    const { plan } = req.body;

    if (!plan || !PLAN_CONFIG[plan]) {
      throw new ApiError(400, "Invalid plan. Must be 'starter', 'basic', or 'pro'.");
    }

    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    // Starter plan: one-time only
    if (plan === "starter" && user.starterOfferClaimed) {
      throw new ApiError(400, "Starter offer already claimed. Each user can only claim it once.");
    }

    const planConfig = PLAN_CONFIG[plan];

    // Generate a unique order ID
    const orderId = `order_${user._id.toString().slice(-8)}_${Date.now()}`;

    // Build Cashfree order request
    // NOTE: Cashfree amounts are in RUPEES (not paise)
    const orderRequest: CreateOrderRequest = {
      order_id: orderId,
      order_amount: planConfig.price,
      order_currency: "INR",
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.fullName,
        customer_email: user.email,
        customer_phone: "9999999999", // Placeholder — Cashfree requires phone
      },
      order_meta: {
        return_url: `${ENV.CORS_ORIGIN || "https://resumerapp.live"}/payment/status?order_id={order_id}`,
        notify_url: `${ENV.CORS_ORIGIN ? ENV.CORS_ORIGIN.replace("://", "://api.").replace(":5173", ":8080") : "https://resumer-backend-fyapfggzacejf2dv.centralindia-01.azurewebsites.net"}/api/v1/payment/webhook`,
      },
      order_note: `${plan} Credit Pack`,
      order_tags: {
        userId: user._id.toString(),
        plan,
        email: user.email,
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest);
    const orderData = response.data;

    if (!orderData?.payment_session_id) {
      throw new ApiError(500, "Failed to create Cashfree order");
    }

    return res.status(200).json(
      new ApiResponse(200, "Order created", {
        orderId: orderData.order_id,
        paymentSessionId: orderData.payment_session_id,
        plan,
        amount: planConfig.price,
        currency: "INR",
      }),
    );
  },
);

// ============================================================================
// Controller: Verify Payment (after Cashfree checkout)
// ============================================================================

export const verifyPayment = asyncHandler(
  async (req: Request<object, object, VerifyPaymentBody>, res: Response) => {
    const { order_id } = req.body;

    if (!order_id) {
      throw new ApiError(400, "Missing order_id");
    }

    if (!req.user?._id) throw new ApiError(401, "Unauthorized");

    // Fetch order status from Cashfree API (server-side verification)
    const orderResponse = await cashfree.PGFetchOrder(order_id);
    const orderData = orderResponse.data;

    if (!orderData || orderData.order_status !== "PAID") {
      // Log failed/pending payment
      await PaymentLog.create({
        userId: req.user._id,
        cf_payment_id: null,
        cf_order_id: order_id,
        amount: orderData?.order_amount || 0,
        status: "failed",
        failure_reason: `Order status: ${orderData?.order_status || "unknown"}`,
        ipAddress: req.ip || null,
      }).catch(() => {});
      throw new ApiError(400, "Payment verification failed. Order is not paid.");
    }

    // Fetch payment details
    const paymentsResponse = await cashfree.PGOrderFetchPayments(order_id);
    const payments = paymentsResponse.data;
    const successPayment = Array.isArray(payments)
      ? payments.find((p: PaymentEntity) => p.payment_status === "SUCCESS")
      : null;

    const cfPaymentId = successPayment
      ? String(successPayment.cf_payment_id)
      : `cf_${order_id}`;

    // Determine plan from order tags
    const tags = orderData.order_tags as Record<string, string> | undefined;
    const plan = tags?.plan as "starter" | "basic" | "pro" | undefined;

    if (!plan || !PLAN_CONFIG[plan]) {
      throw new ApiError(400, "Could not determine plan from order");
    }

    const creditsToAdd = PLAN_CONFIG[plan].credits;

    // Determine payment method
    let paymentMethod: string = "unknown";
    if (successPayment) {
      const pm = successPayment.payment_method;
      if (pm && typeof pm === "object") {
        const pmObj = pm as Record<string, unknown>;
        if (pmObj.upi) paymentMethod = "upi";
        else if (pmObj.card) paymentMethod = "card";
        else if (pmObj.netbanking) paymentMethod = "netbanking";
        else if (pmObj.app) paymentMethod = "wallet";
      }
    }

    // Idempotency: Create PaymentLog FIRST with creditsApplied=false
    // If duplicate key error (11000), check if credits were applied
    try {
      await PaymentLog.create({
        userId: req.user._id,
        cf_payment_id: cfPaymentId,
        cf_order_id: order_id,
        amount: PLAN_CONFIG[plan].price, // In rupees (Cashfree uses rupees)
        currency: "INR",
        status: "pending",
        plan,
        creditsGranted: creditsToAdd,
        creditsApplied: false,
        payment_method: paymentMethod,
        ipAddress: req.ip || null,
      });
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 11000) {
        // Duplicate key — check if credits were already applied
        const existingLog = await PaymentLog.findOne({ cf_payment_id: cfPaymentId });
        if (existingLog?.creditsApplied) {
          const user = await User.findById(req.user._id).select("credits subscriptionTier");
          if (!user) throw new ApiError(404, "User not found");
          return res.status(200).json(
            new ApiResponse(200, "Payment already processed", {
              subscriptionTier: user.subscriptionTier,
              credits: user.credits,
            }),
          );
        }
        // Credits not yet applied — fall through to apply them
      } else {
        throw err;
      }
    }

    // Grant credits — safe to run even on recovery (idempotent $inc)
    const updateOps: Record<string, unknown> = {
      $inc: { credits: creditsToAdd },
      $set: { subscriptionTier: plan === "starter" ? "basic" : plan },
    };
    // Mark starter offer as claimed
    if (plan === "starter") {
      (updateOps.$set as Record<string, unknown>).starterOfferClaimed = true;
    }

    // Atomic guard: for starter plan, only grant if not already claimed
    const userFilter: Record<string, unknown> = { _id: req.user._id };
    if (plan === "starter") {
      userFilter.starterOfferClaimed = { $ne: true };
    }

    const user = await User.findOneAndUpdate(
      userFilter,
      updateOps,
      { new: true },
    );

    if (!user) throw new ApiError(404, "User not found");

    // Mark credits as applied and status as success
    await PaymentLog.findOneAndUpdate(
      { cf_payment_id: cfPaymentId },
      { $set: { creditsApplied: true, status: "success" } },
    );

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
// Controller: Cashfree Webhook Handler
// ============================================================================

export const handleCashfreeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    // MUST be a Buffer — if not, middleware is misconfigured
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: "Bad request" });
    }

    const rawBody = req.body.toString("utf-8");
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;

    if (!signature || !timestamp) {
      console.error("Webhook missing signature or timestamp headers");
      return res.status(400).json({ error: "Missing signature headers" });
    }

    // Verify webhook signature using Cashfree SDK
    let webhookEvent;
    try {
      webhookEvent = cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch {
      console.error("Webhook signature verification failed");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const eventType = webhookEvent.type;
    const payload = webhookEvent.object?.data;

    console.log(`Cashfree webhook received: ${eventType}`);

    switch (eventType) {
      case "PAYMENT_SUCCESS_WEBHOOK": {
        const order = payload?.order;
        const payment = payload?.payment;
        const orderId = order?.order_id;
        const cfPaymentId = payment?.cf_payment_id
          ? String(payment.cf_payment_id)
          : null;

        // Determine plan from order tags
        const tags = order?.order_tags as Record<string, string> | undefined;
        const userId = tags?.userId;
        const plan = tags?.plan as "starter" | "basic" | "pro" | undefined;

        if (orderId && userId && plan && PLAN_CONFIG[plan]) {
          const planConfig = PLAN_CONFIG[plan];

          if (cfPaymentId) {
            // Determine payment method
            let paymentMethod: string = "unknown";
            const pm = payment?.payment_method;
            if (pm && typeof pm === "object") {
              if (pm.upi) paymentMethod = "upi";
              else if (pm.card) paymentMethod = "card";
              else if (pm.netbanking) paymentMethod = "netbanking";
              else if (pm.app) paymentMethod = "wallet";
            }

            try {
              await PaymentLog.create({
                userId,
                cf_payment_id: cfPaymentId,
                cf_order_id: orderId,
                amount: payment?.payment_amount || order?.order_amount || 0,
                currency: order?.order_currency || "INR",
                status: "pending",
                plan,
                creditsGranted: planConfig.credits,
                creditsApplied: false,
                payment_method: paymentMethod,
              });
            } catch (err: unknown) {
              const error = err as { code?: number };
              if (error.code === 11000) {
                // Duplicate — check if credits were already applied
                const existingLog = await PaymentLog.findOne({ cf_payment_id: cfPaymentId });
                if (existingLog?.creditsApplied) {
                  console.log(`Webhook duplicate: Payment ${cfPaymentId} already fully processed`);
                  break;
                }
                // Credits not applied yet — fall through to apply
                console.log(`Webhook recovery: Payment ${cfPaymentId} log exists but credits not applied`);
              } else {
                console.error("Failed to create webhook payment log:", err);
                break;
              }
            }

            // Grant credits (idempotent — runs on first attempt or recovery)
            try {
              const webhookUpdateOps: Record<string, unknown> = {
                $inc: { credits: planConfig.credits },
                $set: { subscriptionTier: plan === "starter" ? "basic" : plan },
              };
              if (plan === "starter") {
                (webhookUpdateOps.$set as Record<string, unknown>).starterOfferClaimed = true;
              }

              // Atomic guard: for starter plan, only grant if not already claimed
              const webhookUserFilter: Record<string, unknown> = { _id: userId };
              if (plan === "starter") {
                webhookUserFilter.starterOfferClaimed = { $ne: true };
              }

              await User.findOneAndUpdate(webhookUserFilter, webhookUpdateOps);

              // Mark credits as applied and status as success
              await PaymentLog.findOneAndUpdate(
                { cf_payment_id: cfPaymentId },
                { $set: { creditsApplied: true, status: "success" } },
              );
            } catch (creditErr) {
              console.error(`Failed to apply credits for payment ${cfPaymentId}:`, creditErr);
            }
          }
        }
        break;
      }

      case "PAYMENT_FAILED_WEBHOOK": {
        const order = payload?.order;
        const payment = payload?.payment;
        const orderId = order?.order_id;
        const cfPaymentId = payment?.cf_payment_id
          ? String(payment.cf_payment_id)
          : null;

        const tags = order?.order_tags as Record<string, string> | undefined;

        if (cfPaymentId) {
          await PaymentLog.create({
            userId: tags?.userId || undefined,
            cf_payment_id: cfPaymentId,
            cf_order_id: orderId || null,
            amount: payment?.payment_amount || order?.order_amount || 0,
            currency: order?.order_currency || "INR",
            status: "failed",
            failure_reason:
              payment?.payment_message || "Payment failed",
            payment_method: "unknown",
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
      "credits totalCreditsUsed subscriptionTier starterOfferClaimed",
    );

    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
      new ApiResponse(200, "Credit status retrieved", {
        credits: user.credits ?? 20,
        totalCreditsUsed: user.totalCreditsUsed ?? 0,
        subscriptionTier: user.subscriptionTier ?? "free",
        starterOfferClaimed: user.starterOfferClaimed ?? false,
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
