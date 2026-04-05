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
  cf_payment_id: string | null;
  cf_order_id: string | null;
  amount: number; // In rupees (Cashfree uses rupees, not paise)
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  failure_reason: string | null;
  plan: "starter" | "basic" | "pro" | "enterprise" | null;
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
    cf_payment_id: {
      type: String,
      default: null,
    },
    cf_order_id: {
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
PaymentLogSchema.index({ cf_payment_id: 1 }, { unique: true, sparse: true });
PaymentLogSchema.index({ cf_order_id: 1 });

const PaymentLog = mongoose.model<IPaymentLog>("PaymentLog", PaymentLogSchema);
export default PaymentLog;
