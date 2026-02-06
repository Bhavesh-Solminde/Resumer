import nodemailer from "nodemailer";
import ENV from "../env.js";

/**
 * Nodemailer transporter for sending emails
 */
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: parseInt(ENV.SMTP_PORT, 10) || 587,
  secure: parseInt(ENV.SMTP_PORT, 10) === 465, // true for 465, false for other ports
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

/**
 * Send an email
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  await transporter.sendMail({
    from: ENV.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

/**
 * Send a contact form confirmation email
 */
export async function sendContactConfirmation(
  name: string,
  email: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "We received your message - Resumer",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Hi ${name},</h2>
        <p>Thank you for reaching out to us! We've received your message and will get back to you within 24-48 hours.</p>
        <p>If your inquiry is urgent, please reply to this email.</p>
        <br />
        <p>Best regards,<br /><strong>The Resumer Team</strong></p>
      </div>
    `,
  });
}

/**
 * Send admin notification for new contact form submission
 */
export async function sendAdminContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionId: string;
}): Promise<void> {
  const subjectLabels = {
    general: "General Inquiry",
    technical: "Technical Support",
    billing: "Billing Question",
    partnership: "Partnership Request",
  };

  await sendEmail({
    to: ENV.ADMIN_EMAIL,
    subject: `New Contact Form: ${subjectLabels[data.subject as keyof typeof subjectLabels]} - Resumer`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Submission ID:</strong> ${data.submissionId}</p>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #6366f1;">${data.email}</a></p>
          <p style="margin: 10px 0;"><strong>Subject:</strong> ${subjectLabels[data.subject as keyof typeof subjectLabels]}</p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">
${data.message}
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" 
             style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
            Reply to ${data.name}
          </a>
        </div>

        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          You can reply directly to this user by clicking the button above or emailing ${data.email}
        </p>
      </div>
    `,
  });
}

/**
 * Send a credit purchase confirmation email
 */
export async function sendCreditPurchaseEmail(
  name: string,
  email: string,
  plan: string,
  creditsAdded: number,
  totalCredits: number,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `${creditsAdded} credits added to your account - Resumer`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Hi ${name},</h2>
        <p>Your <strong>${plan}</strong> credit pack purchase was successful! 🎉</p>
        <p><strong>${creditsAdded} credits</strong> have been added to your account.</p>
        <p>Your current balance: <strong>${totalCredits} credits</strong></p>
        <p style="color: #16a34a; font-weight: bold;">Your credits never expire — use them whenever you’re ready!</p>
        <ul>
          <li>Resume Analysis: 5 credits</li>
          <li>General Optimization: 10 credits</li>
          <li>JD-Based Optimization: 15 credits</li>
          <li>Resume Building & Export: Free</li>
        </ul>
        <p>Start optimizing your resume at <a href="https://resumer.app">resumer.app</a></p>
        <br />
        <p>Best regards,<br /><strong>The Resumer Team</strong></p>
      </div>
    `,
  });
}

export default transporter;
