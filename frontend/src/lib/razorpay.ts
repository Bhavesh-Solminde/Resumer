/**
 * Razorpay frontend helper
 * Loads Razorpay script and opens checkout modal (Orders API — supports all payment methods)
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Load the Razorpay checkout script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout modal (Orders API — Card, UPI, Net Banking all supported)
 */
export function openRazorpayCheckout(options: {
  keyId: string;
  orderId: string;
  amount: number; // INR (will be converted to paise)
  planName: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}): void {
  const rzp = new window.Razorpay({
    key: options.keyId,
    order_id: options.orderId,
    amount: options.amount * 100, // Convert INR to paise
    currency: "INR",
    name: "Resumer",
    description: `${options.planName} Credit Pack`,
    handler: options.onSuccess,
    prefill: {
      name: options.userName,
      email: options.userEmail,
    },
    theme: {
      color: "#6366f1",
    },
    modal: {
      ondismiss: options.onDismiss,
    },
  });
  rzp.open();
}
