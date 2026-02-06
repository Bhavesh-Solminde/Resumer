import React from "react";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

const RefundPolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="February 6, 2026">
      <h2>1. Eligibility</h2>
      <p>
        We offer refunds under the following conditions:
      </p>
      <ul>
        <li>
          The refund is requested within <strong>7 days</strong> of the payment
          date.
        </li>
        <li>
          You have used <strong>less than 20%</strong> of the credits allocated
          for that billing cycle.
        </li>
      </ul>

      <h2>2. Non-Refundable Scenarios</h2>
      <ul>
        <li>Refund requested after 7 days of payment</li>
        <li>More than 20% of credits have been consumed</li>
        <li>Account has been suspended for terms violation</li>
        <li>Recurring charges beyond the first billing cycle (cancel anytime)</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <ol>
        <li>
          Visit our <a href="/contact">Contact page</a> and select "Billing" as
          the subject.
        </li>
        <li>
          Include your registered email address and the reason for the refund
          request.
        </li>
        <li>Our team will review and respond within 3-5 business days.</li>
      </ol>

      <h2>4. Refund Processing</h2>
      <p>
        Approved refunds will be processed back to the original payment method
        via Razorpay. Please allow 5-7 business days for the refund to reflect
        in your account.
      </p>

      <h2>5. Cancellation</h2>
      <p>
        If you don't qualify for a refund, you can still cancel your
        subscription at any time. After cancellation:
      </p>
      <ul>
        <li>
          You'll retain access to your plan's features until the end of the
          current billing period.
        </li>
        <li>No further charges will be made.</li>
        <li>
          Your account will revert to the Free plan after the billing period
          ends.
        </li>
      </ul>

      <h2>6. Contact</h2>
      <p>
        For refund-related queries, please <a href="/contact">contact us</a>.
      </p>
    </LegalPageLayout>
  );
};

export default RefundPolicy;
