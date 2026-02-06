import React, { useEffect, useState } from "react";
import { XCircle, ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/pricing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your payment could not be processed. Please try again.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-left">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Common reasons for payment failure:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>Insufficient funds</li>
              <li>Payment timeout or cancellation</li>
              <li>Bank/card verification issues</li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to pricing page in{" "}
            <span className="font-bold text-red-600 dark:text-red-400">
              {countdown}
            </span>{" "}
            seconds...
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/pricing")}
              className="w-full"
              size="lg"
            >
              Try Again
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
