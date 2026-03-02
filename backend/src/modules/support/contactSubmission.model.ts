import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Contact submission subject categories
 */
export type ContactSubject = "general" | "technical" | "billing" | "partnership";

/**
 * Contact submission status
 */
export type ContactStatus = "pending" | "resolved";

/**
 * Contact submission document interface
 */
export interface IContactSubmission {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  status: ContactStatus;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact submission document type
 */
export type ContactSubmissionDocument = Document<Types.ObjectId> & IContactSubmission;

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    subject: {
      type: String,
      enum: ["general", "technical", "billing", "partnership"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ── Indexes ──
ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ email: 1 });
ContactSubmissionSchema.index({ ipAddress: 1, createdAt: -1 });

const ContactSubmission = mongoose.model<IContactSubmission>(
  "ContactSubmission",
  ContactSubmissionSchema,
);
export default ContactSubmission;
