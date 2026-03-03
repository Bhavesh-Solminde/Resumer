/**
 * Shared hook encapsulating the full Cashfree checkout flow:
 * initCashfree → createSubscription → openCashfreeCheckout → verifyPayment
 *
 * Used by Pricing.tsx and StarterOfferModal.tsx to avoid duplication.
 */

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { initCashfree, openCashfreeCheckout } from "../lib/cashfree";
import { useSubscriptionStore } from "../store/Subscription.store";

export interface CheckoutResult {
  success: boolean;
  /** True when the SDK redirected (return_url) instead of using the modal */
  redirected?: boolean;
}

export function useCashfreeCheckout() {
  const { createSubscription, verifyPayment, fetchStatus } =
    useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  /**
   * Run the entire checkout flow for a given plan.
   * Returns `{ success: true }` only when payment is verified.
   */
  const startCheckout = useCallback(
    async (plan: "starter" | "basic" | "pro"): Promise<CheckoutResult> => {
      setIsLoading(true);
      setLoadingPlan(plan);

      try {
        // 1. Init SDK
        try {
          await initCashfree();
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Failed to load payment SDK";
          toast.error(msg);
          return { success: false };
        }

        // 2. Create order on backend
        const result = await createSubscription(plan);
        if (!result) {
          // createSubscription already toasts errors via the store
          return { success: false };
        }

        // 3. Guard: orderId must be present for verification later
        if (!result.orderId) {
          toast.error("Order created but no orderId returned. Please contact support.");
          return { success: false };
        }

        // 4. Open Cashfree checkout modal
        const checkoutResult = await openCashfreeCheckout(
          result.paymentSessionId,
        );

        if (checkoutResult.error) {
          toast.error(
            checkoutResult.error.message || "Checkout failed. Please try again.",
          );
          return { success: false };
        }

        if (checkoutResult.redirect) {
          // User was redirected — handled by return_url on the backend
          return { success: false, redirected: true };
        }

        if (checkoutResult.paymentDetails) {
          // 5. Verify payment on backend
          const verified = await verifyPayment({
            order_id: result.orderId,
          });

          if (verified) {
            await fetchStatus();
            return { success: true };
          }

          return { success: false };
        }

        // None of error / redirect / paymentDetails returned — unexpected
        toast.error("Checkout closed without completing payment.");
        return { success: false };
      } finally {
        setIsLoading(false);
        setLoadingPlan(null);
      }
    },
    [createSubscription, verifyPayment, fetchStatus],
  );

  return { startCheckout, isLoading, loadingPlan };
}
