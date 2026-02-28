/**
 * Subscription & Credit Types
 * Types for payment, subscription management, and credit system
 */

/**
 * Subscription tier (kept for analytics & UI display)
 */
export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

/**
 * Subscription status
 * @deprecated No longer used — credits never expire. Kept for backward compat.
 */
export type SubscriptionStatus = "active" | "inactive" | "cancelled" | "expired";

/**
 * Credit operation types
 */
export type CreditOperationType = "analysis" | "optimization_general" | "optimization_jd";

/**
 * Credit costs for each operation
 */
export const CREDIT_COSTS: Record<CreditOperationType, number> = {
  analysis: 5,
  optimization_general: 10,
  optimization_jd: 15,
} as const;

/**
 * Plan configuration
 */
export interface IPlanConfig {
  credits: number;
  price: number; // INR
  name: string;
  description: string;
  features: string[];
}

/**
 * All plan configurations
 */
export const PLAN_CONFIGS: Record<string, IPlanConfig> = {
  free: {
    credits: 20,
    price: 0,
    name: "Free",
    description: "Get started with basic features",
    features: [
      "20 free credits (one-time)",
      "Resume Analysis (5 credits)",
      "General Optimization (10 credits)",
      "Resume Builder (Free)",
      "PDF Export (Free)",
    ],
  },
  starter: {
    credits: 500,
    price: 9,
    name: "Starter",
    description: "Limited time March offer",
    features: [
      "500 credits for just ₹9",
      "One-time offer for new users",
      "Credits never expire",
      "Resume Analysis (5 credits)",
      "General Optimization (10 credits)",
      "JD-Based Optimization (15 credits)",
      "Resume Builder (Free)",
      "PDF Export (Free)",
    ],
  },
  basic: {
    credits: 200,
    price: 999,
    name: "Basic",
    description: "For active job seekers",
    features: [
      "200 credits (one-time purchase)",
      "Credits never expire",
      "Resume Analysis (5 credits)",
      "General Optimization (10 credits)",
      "JD-Based Optimization (15 credits)",
      "Resume Builder (Free)",
      "PDF Export (Free)",
      "Email Support",
    ],
  },
  pro: {
    credits: 500,
    price: 1999,
    name: "Pro",
    description: "For serious professionals",
    features: [
      "500 credits (one-time purchase)",
      "Credits never expire",
      "Resume Analysis (5 credits)",
      "General Optimization (10 credits)",
      "JD-Based Optimization (15 credits)",
      "Resume Builder (Free)",
      "PDF Export (Free)",
      "Priority Support",
    ],
  },
} as const;

/**
 * User interface (frontend-safe, no password/refresh token)
 */
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  resumeHistory: string[];
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

/**
 * Signup request payload
 */
export interface ISignupRequest {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Login request payload
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Credit status response from GET /payment/status
 */
export interface ISubscriptionStatus {
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: SubscriptionTier;
  starterOfferClaimed: boolean;
}

/**
 * Create subscription response (Order-based — one-time payment)
 */
export interface ICreateSubscriptionResponse {
  orderId: string;
  razorpayKeyId: string;
  plan: "starter" | "basic" | "pro";
  amount: number;
  currency: string;
}

/**
 * Verify payment response
 */
export interface IVerifyPaymentResponse {
  subscriptionTier: SubscriptionTier;
  credits: number;
}

/**
 * Payment log entry (for usage stats)
 */
export interface IPaymentLogEntry {
  _id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending" | "refunded";
  plan: "basic" | "pro" | "enterprise" | null;
  creditsGranted: number;
  createdAt: string;
}

/**
 * Monthly usage entry
 */
export interface IMonthlyUsageEntry {
  month: string;
  creditsUsed: number;
  operationType: CreditOperationType;
  operationCount: number;
}

/**
 * Usage stats response
 */
export interface IUsageStats {
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: SubscriptionTier;
  currentMonthUsage: IMonthlyUsageEntry[];
  recentPayments: IPaymentLogEntry[];
}

/**
 * Contact form submission request
 */
export interface IContactFormRequest {
  name: string;
  email: string;
  subject: "general" | "technical" | "billing" | "partnership";
  message: string;
}

/**
 * FAQ data item
 */
export interface IFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}
