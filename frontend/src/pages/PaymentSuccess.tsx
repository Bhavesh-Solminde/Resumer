import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "../store/Subscription.store";
import { Button } from "../components/ui/button";
import { PLAN_CONFIGS } from "@resumer/shared-types";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionTier, credits } = useSubscriptionStore();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/resume/analyze");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const planConfig = PLAN_CONFIGS[subscriptionTier];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Credits have been added to your account
            </p>
          </div>

          {/* Plan Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Pack
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {planConfig.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Current Balance
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {credits} credits
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
              Credits never expire — use them whenever you’re ready!
            </p>
          </div>

          {/* Countdown */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to dashboard in{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {countdown}
            </span>{" "}
            seconds...
          </div>

          {/* Action Button */}
          <Button
            onClick={() => navigate("/resume/analyze")}
            className="w-full"
            size="lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
