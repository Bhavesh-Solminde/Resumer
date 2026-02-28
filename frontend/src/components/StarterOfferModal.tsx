import React, { useState } from "react";
import { Sparkles, X, Loader2, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { PLAN_CONFIGS } from "@resumer/shared-types";
import { useSubscriptionStore } from "../store/Subscription.store";
import { useAuthStore } from "../store/Auth.store";
import { loadRazorpayScript, openRazorpayCheckout } from "../lib/razorpay";
import { useNavigate } from "react-router-dom";

interface StarterOfferModalProps {
  open: boolean;
  onClose: () => void;
}

const StarterOfferModal: React.FC<StarterOfferModalProps> = ({ open, onClose }) => {
  const { authUser } = useAuthStore();
  const { createSubscription, verifyPayment, fetchStatus } = useSubscriptionStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const starterPlan = PLAN_CONFIGS.starter;

  const handleClaim = async () => {
    if (!authUser) return;
    setIsLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setIsLoading(false);
      return;
    }

    const result = await createSubscription("starter");
    if (!result) {
      setIsLoading(false);
      return;
    }

    openRazorpayCheckout({
      keyId: result.razorpayKeyId,
      orderId: result.orderId,
      amount: result.amount,
      planName: starterPlan.name,
      userName: authUser.fullName,
      userEmail: authUser.email,
      onSuccess: async (response) => {
        const success = await verifyPayment(response);
        if (success) {
          await fetchStatus();
          onClose();
          navigate("/payment/success");
        } else {
          navigate("/payment/failure");
        }
        setIsLoading(false);
      },
      onDismiss: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 px-6 py-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <Gift className="h-12 w-12 mx-auto mb-3 animate-bounce" />
          <h2 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" /> Welcome Offer! <Sparkles className="h-6 w-6" />
          </h2>
          <p className="text-white/90 text-sm">
            Limited time — available for new users only
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-foreground">₹9</span>
              <span className="text-muted-foreground line-through text-lg">₹1999</span>
            </div>
            <p className="text-lg font-medium text-foreground">
              {starterPlan.credits} Credits
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              One-time offer • Credits never expire
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {[
              "100 Resume Analyses",
              "50 General Optimizations",
              "33 JD-Based Optimizations",
              "Free Resume Builder & PDF Export",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            onClick={handleClaim}
            disabled={isLoading}
            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Claim 500 Credits for ₹9
              </>
            )}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-3 py-2 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarterOfferModal;
