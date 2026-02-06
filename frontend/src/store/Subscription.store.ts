import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { toast } from "react-hot-toast";
import type {
  ApiResponse,
  ISubscriptionStatus,
  ICreateSubscriptionResponse,
  IVerifyPaymentResponse,
  IUsageStats,
  SubscriptionTier,
} from "@resumer/shared-types";

/**
 * Subscription store state
 */
interface SubscriptionState {
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: SubscriptionTier;
  usageStats: IUsageStats | null;
  isLoading: boolean;
  isSubscribing: boolean;
}

/**
 * Subscription store actions
 */
interface SubscriptionActions {
  fetchStatus: () => Promise<void>;
  fetchUsageStats: () => Promise<void>;
  createSubscription: (plan: "basic" | "pro") => Promise<ICreateSubscriptionResponse | null>;
  verifyPayment: (data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => Promise<boolean>;
  updateCredits: (credits: number) => void;
  reset: () => void;
}

export type SubscriptionStore = SubscriptionState & SubscriptionActions;

const initialState: SubscriptionState = {
  credits: 20,
  totalCreditsUsed: 0,
  subscriptionTier: "free",
  usageStats: null,
  isLoading: false,
  isSubscribing: false,
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  ...initialState,

  fetchStatus: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<ApiResponse<ISubscriptionStatus>>(
        "/payment/status",
      );
      const data = res.data.data;
      set({
        credits: data.credits,
        totalCreditsUsed: data.totalCreditsUsed,
        subscriptionTier: data.subscriptionTier,
      });
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsageStats: async () => {
    try {
      const res = await axiosInstance.get<ApiResponse<IUsageStats>>(
        "/payment/usage",
      );
      set({ usageStats: res.data.data });
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    }
  },

  createSubscription: async (plan) => {
    set({ isSubscribing: true });
    try {
      const res = await axiosInstance.post<ApiResponse<ICreateSubscriptionResponse>>(
        "/payment/subscribe",
        { plan },
      );
      return res.data.data;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create subscription"));
      return null;
    } finally {
      set({ isSubscribing: false });
    }
  },

  verifyPayment: async (data) => {
    try {
      const res = await axiosInstance.post<ApiResponse<IVerifyPaymentResponse>>(
        "/payment/verify",
        data,
      );
      const result = res.data.data;
      set({
        credits: result.credits,
        subscriptionTier: result.subscriptionTier,
      });
      toast.success("Credits added to your account!");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Payment verification failed"));
      return false;
    }
  },

  updateCredits: (credits) => set({ credits }),

  reset: () => set(initialState),
}));
