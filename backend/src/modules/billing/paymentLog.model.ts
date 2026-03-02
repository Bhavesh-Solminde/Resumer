import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Payment status enum
 */
export type PaymentStatus = "success" | "failed" | "pending" | "refunded";

/**
 * Payment method enum
 */
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "unknown";

/**
 * Payment log document interface
 */
export interface IPaymentLog {
  userId: Types.ObjectId;
  razorpay_payment_id: string;
  razorpay_order_id: string | null;
  razorpay_subscription_id: string | null;
  razorpay_signature: string | null;
  amount: number; // In paise (INR smallest unit)
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  failure_reason: string | null;
  plan: "basic" | "pro" | "enterprise" | null;
  creditsGranted: number;
  creditsApplied: boolean;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment log document type
 */
export type PaymentLogDocument = Document<Types.ObjectId> & IPaymentLog;

const PaymentLogSchema = new Schema<IPaymentLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpay_subscription_id: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending", "refunded"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "unknown"],
      default: "unknown",
    },
    failure_reason: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      enum: ["starter", "basic", "pro", "enterprise", null],
      default: null,
    },
    creditsGranted: {
      type: Number,
      default: 0,
    },
    creditsApplied: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ── Indexes ──
PaymentLogSchema.index({ userId: 1, createdAt: -1 });
PaymentLogSchema.index({ status: 1 });
PaymentLogSchema.index({ razorpay_payment_id: 1 }, { unique: true });
PaymentLogSchema.index({ razorpay_order_id: 1 });

const PaymentLog = mongoose.model<IPaymentLog>("PaymentLog", PaymentLogSchema);
export default PaymentLog;
