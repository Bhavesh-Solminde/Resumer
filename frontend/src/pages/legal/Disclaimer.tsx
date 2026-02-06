import React from "react";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

const Disclaimer: React.FC = () => {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="February 6, 2026">
      <h2>1. AI-Generated Content</h2>
      <p>
        Resumer uses artificial intelligence (Google Gemini) to analyze and
        optimize resumes. While we strive for accuracy, AI-generated content may
        contain errors or suggestions that require your review. You are solely
        responsible for verifying and approving all content before using it.
      </p>

      <h2>2. No Guarantee of Employment</h2>
      <p>
        Resumer is a tool to improve your resume. We do not guarantee:
      </p>
      <ul>
        <li>Job interviews or employment offers</li>
        <li>Specific ATS scores from third-party systems</li>
        <li>Accuracy of ATS score calculations</li>
      </ul>

      <h2>3. Resume Content Accuracy</h2>
      <p>
        It is your responsibility to ensure that all information in your resume
        is truthful and accurate. Our optimization suggestions may include
        placeholder metrics (e.g., "[X]%") which you must replace with actual
        figures. Never include fabricated information in your resume.
      </p>

      <h2>4. Service Availability</h2>
      <p>
        We strive for high availability but do not guarantee uninterrupted
        service. Scheduled maintenance, updates, or unforeseen issues may
        temporarily affect service availability.
      </p>

      <h2>5. Third-Party Services</h2>
      <p>
        Our service relies on third-party providers (Google AI, Razorpay,
        Cloudinary, MongoDB Atlas). We are not responsible for disruptions
        caused by these providers.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Resumer shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages
        arising from your use of the Service.
      </p>

      <h2>7. Contact</h2>
      <p>
        If you have questions about this disclaimer, please{" "}
        <a href="/contact">contact us</a>.
      </p>
    </LegalPageLayout>
  );
};

export default Disclaimer;
