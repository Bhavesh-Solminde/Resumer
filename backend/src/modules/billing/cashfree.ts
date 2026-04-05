import { Cashfree, CFEnvironment } from "cashfree-pg";
import ENV from "../../env.js";

/**
 * Resolve Cashfree environment from NODE_ENV.
 * Non-production deployments use sandbox/test mode.
 */
const cfEnv =
  ENV.NODE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

/**
 * Cashfree PG client instance
 */
const cashfree = new Cashfree(
  cfEnv,
  ENV.CASHFREE_APP_ID,
  ENV.CASHFREE_SECRET_KEY,
);

/**
 * Plan configuration mapping tier to credit amounts and prices
 * (One-time credit purchases via Cashfree Orders API)
 *
 * NOTE: Cashfree amounts are in RUPEES (not paise like Razorpay)
 */
export const PLAN_CONFIG = {
  starter: {
    credits: 500,
    price: 9, // INR — limited-time March offer
  },
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

export default cashfree;
