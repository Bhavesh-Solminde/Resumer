/**
 * Cashfree frontend helper
 * Uses @cashfreepayments/cashfree-js Drop-in SDK for checkout modal
 */

import { load } from "@cashfreepayments/cashfree-js";

// Cashfree SDK instance (cached after first load)
let cashfreeInstance: Awaited<ReturnType<typeof load>> | null = null;

/**
 * Initialize the Cashfree JS SDK (production mode)
 * Returns a cached instance if already loaded
 */
export async function initCashfree() {
  if (cashfreeInstance) return cashfreeInstance;

  const mode = (import.meta.env.VITE_CASHFREE_MODE as string) || "production";
  cashfreeInstance = await load({ mode: mode as "sandbox" | "production" });
  return cashfreeInstance;
}

/**
 * Checkout result from Cashfree modal
 */
export interface CashfreeCheckoutResult {
  error?: { message: string };
  redirect?: boolean;
  paymentDetails?: {
    paymentMessage: string;
    orderId: string;
  };
}

/**
 * Open Cashfree checkout modal
 * @param paymentSessionId — from backend create-order response
 * @returns checkout result (error, redirect, or paymentDetails)
 */
export async function openCashfreeCheckout(
  paymentSessionId: string,
): Promise<CashfreeCheckoutResult> {
  const cf = await initCashfree();

  const result = await cf.checkout({
    paymentSessionId,
    redirectTarget: "_modal",
  });

  return result as CashfreeCheckoutResult;
}
