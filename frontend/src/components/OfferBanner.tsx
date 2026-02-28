import React, { useState } from "react";
import { X, Zap, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BANNER_DISMISSED_KEY = "resumer_offer_banner_dismissed";

const OfferBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(
    () => sessionStorage.getItem(BANNER_DISMISSED_KEY) === "true",
  );
  const navigate = useNavigate();

  if (isDismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");
    setIsDismissed(true);
  };

  return (
    <div
      onClick={() => navigate("/auth/signup")}
      className="relative z-[60] w-full bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white py-2.5 px-4 text-center cursor-pointer hover:brightness-110 transition-all"
    >
      <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        <Gift className="h-4 w-4 flex-shrink-0 animate-pulse" />
        <span>
          <Zap className="inline h-4 w-4 -mt-0.5" />{" "}
          <strong>March Offer:</strong> Get{" "}
          <strong>500 credits</strong> for just{" "}
          <strong>₹9</strong> — Limited time only!
        </span>
        <Gift className="h-4 w-4 flex-shrink-0 animate-pulse" />
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default OfferBanner;
