import React from "react";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="February 6, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Resumer ("the Service"), you agree to be bound by
        these Terms of Service. If you do not agree, please do not use the
        Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Resumer is an AI-powered resume optimization platform that provides:
      </p>
      <ul>
        <li>Resume analysis with ATS scoring</li>
        <li>General and job-description-based resume optimization</li>
        <li>A drag-and-drop resume builder with PDF export</li>
      </ul>

      <h2>3. Account Registration</h2>
      <p>
        You must provide accurate and complete information when creating an
        account. You are responsible for maintaining the security of your account
        credentials.
      </p>

      <h2>4. Credit System & Subscriptions</h2>
      <ul>
        <li>
          Credits are required to use AI-powered features (Analysis,
          Optimization).
        </li>
        <li>Credits reset at the beginning of each billing cycle.</li>
        <li>Unused credits do not roll over.</li>
        <li>Resume Building and PDF Export are free for all plans.</li>
        <li>
          Subscriptions are billed monthly through Razorpay. You can cancel at
          any time.
        </li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Upload content that is harmful, offensive, or violates others' rights</li>
        <li>Attempt to reverse engineer or exploit the Service</li>
        <li>Automate access to the Service without permission</li>
        <li>Share your account credentials with others</li>
      </ul>

      <h2>6. AI-Generated Content Disclaimer</h2>
      <p>
        Our AI optimization suggestions are recommendations only. You are
        responsible for reviewing and verifying all content before using it.
        Resumer does not guarantee that AI-generated content is factually
        accurate, and you should never include false information in your resume.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        You retain ownership of all resume content you upload. Resumer does not
        claim ownership of your data. Our platform, code, and design are our
        proprietary property.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Resumer is provided "as is" without warranties of any kind. We are not
        liable for any damages arising from the use of our Service, including
        but not limited to job application outcomes.
      </p>

      <h2>9. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these
        terms. You may delete your account at any time.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these terms at any time. Continued use of the Service
        after changes constitutes acceptance.
      </p>

      <h2>11. Contact</h2>
      <p>
        For questions about these terms, please <a href="/contact">contact us</a>.
      </p>
    </LegalPageLayout>
  );
};

export default TermsOfService;
