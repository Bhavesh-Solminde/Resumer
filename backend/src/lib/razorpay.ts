import Razorpay from "razorpay";
import ENV from "../env.js";

/**
 * Razorpay client instance
 */
const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

/**
 * Plan configuration mapping tier to credit amounts and prices
 * (No Razorpay plan IDs needed — we use Orders API with one-time payments)
 */
export const PLAN_CONFIG = {
  basic: {
    credits: 200,
    price: 999, // INR
  },
  pro: {
    credits: 500,
    price: 1999, // INR
  },
} as const;

/**
 * Credit costs for each operation type
 */
export const CREDIT_COSTS = {
  analysis: 5,
  optimization_general: 10,
  optimization_jd: 15,
  build_export: 0, // Free
} as const;

export default razorpay;
