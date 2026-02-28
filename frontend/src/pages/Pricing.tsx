import React, { useEffect, useState } from "react";
import { Check, Loader2, ArrowLeft, Home, Zap } from "lucide-react";
import { PLAN_CONFIGS } from "@resumer/shared-types";
import { useSubscriptionStore } from "../store/Subscription.store";
import { useAuthStore } from "../store/Auth.store";
import { loadRazorpayScript, openRazorpayCheckout } from "../lib/razorpay";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Footer from "../components/Footer";
import { cn } from "../lib/utils";

const Pricing: React.FC = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const {
    isSubscribing,
    starterOfferClaimed,
    createSubscription,
    verifyPayment,
    fetchStatus,
  } = useSubscriptionStore();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      fetchStatus();
    }
  }, [authUser, fetchStatus]);

  const handleSubscribe = async (plan: "starter" | "basic" | "pro") => {
    if (!authUser) return;

    setLoadingPlan(plan);

    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setLoadingPlan(null);
      return;
    }

    // Create subscription on backend
    const result = await createSubscription(plan);
    if (!result) {
      setLoadingPlan(null);
      return;
    }

    // Open Razorpay checkout
    openRazorpayCheckout({
      keyId: result.razorpayKeyId,
      orderId: result.orderId,
      amount: result.amount,
      planName: PLAN_CONFIGS[plan].name,
      userName: authUser.fullName,
      userEmail: authUser.email,
      onSuccess: async (response) => {
        const success = await verifyPayment(response);
        if (success) {
          navigate("/payment/success");
        } else {
          navigate("/payment/failure");
        }
        setLoadingPlan(null);
      },
      onDismiss: () => {
        navigate("/payment/failure");
        setLoadingPlan(null);
      },
    });
  };

  // Whether the Pro card shows the one-time ₹9 starter deal
  const proHasStarterOffer = authUser && !starterOfferClaimed;

  const plans = [
    { key: "free" as const, highlight: false },
    { key: "basic" as const, highlight: true },
    { key: "pro" as const, highlight: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-4 py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <Home className="h-4 w-4" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy credits to power your job search. Credits never expire — use
            them whenever you're ready. Resume builder and PDF export are always free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(({ key, highlight }) => {
            const config = PLAN_CONFIGS[key];
            const isBusy = loadingPlan === key || isSubscribing;

            return (
              <div
                key={key}
                className={cn(
                  "relative flex flex-col rounded-xl border p-8",
                  highlight
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-border",
                )}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Recommended
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{config.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.description}
                  </p>
                </div>

                <div className="mb-6">
                  {key === "pro" && proHasStarterOffer ? (
                    <>
                      <span className="text-4xl font-bold text-blue-600">₹9</span>
                      <span className="text-muted-foreground line-through ml-2 text-lg">₹{config.price}</span>
                      <div className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
                        <Zap className="h-3 w-3" /> One-time welcome offer
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        {config.price === 0 ? "Free" : `₹${config.price}`}
                      </span>
                      {config.price > 0 && (
                        <span className="text-muted-foreground ml-1 text-sm">one-time</span>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {config.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {key === "free" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Free Forever
                  </Button>
                ) : key === "pro" && proHasStarterOffer ? (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    disabled={isBusy || !authUser}
                    onClick={() => handleSubscribe("starter")}
                  >
                    {isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    {isBusy
                      ? "Processing..."
                      : "Get 500 Credits for ₹9"}
                  </Button>
                ) : (
                  <Button
                    variant={highlight ? "default" : "outline"}
                    className="w-full"
                    disabled={isBusy || !authUser}
                    onClick={() => handleSubscribe(key)}
                  >
                    {isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isBusy
                      ? "Processing..."
                      : `Buy ${config.credits} Credits`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {!authUser && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Please{" "}
            <a href="/auth/login" className="text-primary hover:underline">
              sign in
            </a>{" "}
            to purchase credits.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
