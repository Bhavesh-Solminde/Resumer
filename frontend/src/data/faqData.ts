import type { IFaqItem } from "@resumer/shared-types";

export const faqData: IFaqItem[] = [
  // Credits & Billing
  {
    id: "credits-what",
    question: "What are credits and how do they work?",
    answer:
      "Credits are the currency used to access our AI-powered features. Each action costs a specific number of credits: Resume Analysis costs 5 credits, General Optimization costs 10 credits, and JD-Based Optimization costs 15 credits. Resume Building and PDF Export are always free. Your credits refresh each billing cycle.",
    category: "Credits & Billing",
    tags: ["credits", "billing", "pricing"],
  },
  {
    id: "credits-expire",
    question: "Do unused credits carry over to the next month?",
    answer:
      "No, credits reset at the beginning of each billing cycle. We recommend using your credits within your billing period. When your subscription renews, you'll receive your full allotment of credits for your plan.",
    category: "Credits & Billing",
    tags: ["credits", "expiry", "rollover"],
  },
  {
    id: "upgrade-plan",
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes! You can upgrade your plan at any time. To switch plans, cancel your current subscription and subscribe to a new one. Your remaining credits from the current period will remain until the end of the billing cycle.",
    category: "Credits & Billing",
    tags: ["upgrade", "downgrade", "plan"],
  },
  {
    id: "payment-methods",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment methods through Razorpay, including UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, and popular wallets like Paytm, PhonePe, and Google Pay.",
    category: "Credits & Billing",
    tags: ["payment", "upi", "card", "razorpay"],
  },
  {
    id: "refund-policy",
    question: "What is your refund policy?",
    answer:
      "We offer refunds within 7 days of purchase if you haven't used more than 20% of your credits for that billing cycle. After that, you can cancel your subscription and continue using it until the end of the billing period. Please visit our Refund Policy page for detailed terms.",
    category: "Credits & Billing",
    tags: ["refund", "cancellation", "money-back"],
  },

  // Features
  {
    id: "ats-score",
    question: "What is an ATS score?",
    answer:
      "An ATS (Applicant Tracking System) score measures how well your resume is optimized for automated screening systems used by recruiters. Our AI evaluates your resume on criteria like keyword relevance, formatting, action verbs, quantified achievements, and section completeness to give you a score out of 100.",
    category: "Features",
    tags: ["ats", "score", "analysis"],
  },
  {
    id: "general-vs-jd",
    question:
      "What's the difference between General Optimization and JD-Based Optimization?",
    answer:
      "General Optimization improves your resume's overall quality — fixing weak verbs, adding metrics, improving structure, and boosting your ATS score. JD-Based Optimization goes further by tailoring your resume to a specific job description, matching keywords, and identifying skill gaps. JD optimization is more targeted and typically produces better results for specific applications.",
    category: "Features",
    tags: ["optimization", "jd", "general", "difference"],
  },
  {
    id: "resume-builder",
    question: "Is the resume builder really free?",
    answer:
      "Yes! Our drag-and-drop resume builder and PDF export are completely free for all plans, including the Free tier. Building and exporting resumes costs 0 credits.",
    category: "Features",
    tags: ["builder", "free", "export", "pdf"],
  },
  {
    id: "file-formats",
    question: "What file formats are supported?",
    answer:
      "Currently, we accept PDF files for resume analysis and optimization. Our resume builder exports to PDF format, which is the most widely accepted format by ATS systems.",
    category: "Features",
    tags: ["pdf", "format", "upload"],
  },

  // Privacy & Security
  {
    id: "data-privacy",
    question: "How is my resume data handled?",
    answer:
      "Your privacy is our priority. Resume data is encrypted in transit and at rest. We only use your resume data to provide our analysis and optimization services. We do not share your personal information or resume content with third parties. You can delete your account and all associated data at any time.",
    category: "Privacy & Security",
    tags: ["privacy", "data", "security", "encryption"],
  },
  {
    id: "data-retention",
    question: "How long do you keep my data?",
    answer:
      "Your resume scans and analysis history are stored as long as your account is active. You can delete individual scans from your profile history at any time. If you delete your account, all associated data is permanently removed within 30 days.",
    category: "Privacy & Security",
    tags: ["data", "retention", "deletion"],
  },

  // Account
  {
    id: "cancel-subscription",
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription from your Profile page under the Subscription section. After cancellation, you'll retain access to your plan's features until the end of the current billing period.",
    category: "Account",
    tags: ["cancel", "subscription", "account"],
  },
  {
    id: "delete-account",
    question: "Can I delete my account?",
    answer:
      "Yes, you can request account deletion by contacting us through the Contact page. We'll process your request and permanently delete all your data within 30 days.",
    category: "Account",
    tags: ["delete", "account", "data"],
  },
];

/**
 * Get unique FAQ categories
 */
export function getFaqCategories(): string[] {
  const categories = new Set(faqData.map((f) => f.category));
  return Array.from(categories);
}

/**
 * Search FAQs by query
 */
export function searchFaqs(query: string): IFaqItem[] {
  const lower = query.toLowerCase();
  return faqData.filter(
    (f) =>
      f.question.toLowerCase().includes(lower) ||
      f.answer.toLowerCase().includes(lower) ||
      f.tags.some((t) => t.includes(lower)),
  );
}
