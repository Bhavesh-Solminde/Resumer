import React from "react";
import { Coins } from "lucide-react";
import { useSubscriptionStore } from "../store/Subscription.store";
import { cn } from "../lib/utils";

interface CreditBadgeProps {
  className?: string;
  showLabel?: boolean;
}

const CreditBadge: React.FC<CreditBadgeProps> = ({
  className,
  showLabel = true,
}) => {
  const { credits, subscriptionTier } = useSubscriptionStore();

  const tierColors: Record<string, string> = {
    free: "text-muted-foreground",
    basic: "text-blue-500",
    pro: "text-amber-500",
    enterprise: "text-purple-500",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-sm font-medium",
        tierColors[subscriptionTier] || "text-muted-foreground",
        className,
      )}
      title={`${credits} credits remaining (${subscriptionTier} plan)`}
    >
      <Coins className="h-3.5 w-3.5" />
      <span>{credits}</span>
      {showLabel && (
        <span className="hidden md:inline text-xs text-muted-foreground capitalize">
          {subscriptionTier}
        </span>
      )}
    </div>
  );
};

export default CreditBadge;
