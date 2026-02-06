import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * FAQ analytics document interface
 */
export interface IFaqAnalytics {
  faqId: string; // Unique identifier matching frontend FAQ data
  views: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  lastViewed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * FAQ analytics document type
 */
export type FaqAnalyticsDocument = Document<Types.ObjectId> & IFaqAnalytics;

const FaqAnalyticsSchema = new Schema<IFaqAnalytics>(
  {
    faqId: {
      type: String,
      required: true,
      unique: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
    },
    lastViewed: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: helpfulness rate
FaqAnalyticsSchema.virtual("helpfulnessRate").get(function () {
  const total = this.helpfulVotes + this.notHelpfulVotes;
  if (total === 0) return 0;
  return Math.round((this.helpfulVotes / total) * 100);
});

// ── Indexes ──
FaqAnalyticsSchema.index({ views: -1 });
FaqAnalyticsSchema.index({ helpfulVotes: -1 });

const FaqAnalytics = mongoose.model<IFaqAnalytics>(
  "FaqAnalytics",
  FaqAnalyticsSchema,
);
export default FaqAnalytics;
