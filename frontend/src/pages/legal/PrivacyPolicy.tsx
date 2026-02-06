import React from "react";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="February 6, 2026">
      <h2>1. Information We Collect</h2>
      <p>
        When you use Resumer, we collect the following types of information:
      </p>
      <ul>
        <li>
          <strong>Account Information:</strong> Name, email address, and profile
          picture when you sign up or log in via Google/GitHub.
        </li>
        <li>
          <strong>Resume Data:</strong> The PDF files you upload and the text
          extracted from them for analysis and optimization.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with our
          services, including pages visited and features used.
        </li>
        <li>
          <strong>Payment Information:</strong> Payment details are processed
          securely by Razorpay. We do not store your card details.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide our resume analysis and optimization services</li>
        <li>To manage your account and subscription</li>
        <li>To process payments through Razorpay</li>
        <li>To communicate important service updates</li>
        <li>To improve our services and user experience</li>
      </ul>

      <h2>3. Data Storage & Security</h2>
      <p>
        Your data is stored on MongoDB Atlas with encryption at rest and in
        transit. Resume files are stored on Cloudinary's secure infrastructure.
        We follow industry-standard security practices to protect your
        information.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li>
          <strong>Google Gemini AI:</strong> For resume analysis and optimization.
          Your resume text is sent to Google's API for processing.
        </li>
        <li>
          <strong>Razorpay:</strong> For secure payment processing.
        </li>
        <li>
          <strong>Cloudinary:</strong> For secure file storage.
        </li>
        <li>
          <strong>MongoDB Atlas:</strong> For database hosting.
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. You may
        delete individual scans at any time from your profile. Upon account
        deletion, all your data will be permanently removed within 30 days.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request correction of incorrect data</li>
        <li>Request deletion of your account and data</li>
        <li>Export your data</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use essential cookies for authentication (access tokens and refresh
        tokens). We do not use tracking cookies or third-party advertising
        cookies.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any significant changes via email or an in-app notification.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please{" "}
        <a href="/contact">contact us</a>.
      </p>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
