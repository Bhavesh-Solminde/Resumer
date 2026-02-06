import React from "react";
import { useSubscriptionStore } from "../store/Subscription.store";
import { useNavigate } from "react-router-dom";
import { CREDIT_COSTS, type CreditOperationType } from "@resumer/shared-types";

interface CreditGuardProps {
  operation: CreditOperationType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps an action with a credit check.
 * If user doesn't have enough credits, shows upgrade prompt instead.
 */
const CreditGuard: React.FC<CreditGuardProps> = ({
  operation,
  children,
  fallback,
}) => {
  const { credits } = useSubscriptionStore();
  const navigate = useNavigate();
  const requiredCredits = CREDIT_COSTS[operation];
  const hasEnough = credits >= requiredCredits;

  if (hasEnough) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center gap-3 p-6 border rounded-lg bg-muted/30 text-center">
      <p className="text-sm text-muted-foreground">
        You need <strong>{requiredCredits} credits</strong> for this action but
        only have <strong>{credits}</strong>.
      </p>
      <button
        onClick={() => navigate("/pricing")}
        className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Buy Credits
      </button>
    </div>
  );
};

export default CreditGuard;
