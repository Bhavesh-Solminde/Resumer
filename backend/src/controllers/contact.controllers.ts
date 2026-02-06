import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ContactSubmission from "../models/contactSubmission.model.js";
import { sendContactConfirmation, sendAdminContactNotification } from "../lib/email.js";

// ============================================================================
// Types
// ============================================================================

interface ContactBody {
  name: string;
  email: string;
  subject: "general" | "technical" | "billing" | "partnership";
  message: string;
}

// ============================================================================
// Controller: Submit Contact Form
// ============================================================================

export const submitContactForm = asyncHandler(
  async (req: Request<object, object, ContactBody>, res: Response) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      throw new ApiError(400, "All fields are required");
    }

    if (name.length > 100) {
      throw new ApiError(400, "Name must be less than 100 characters");
    }

    if (message.length > 2000) {
      throw new ApiError(400, "Message must be less than 2000 characters");
    }

    const validSubjects = ["general", "technical", "billing", "partnership"];
    if (!validSubjects.includes(subject)) {
      throw new ApiError(400, "Invalid subject category");
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email address");
    }

    // Create submission
    const submission = await ContactSubmission.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip || null,
    });

    // Send confirmation email (non-blocking)
    sendContactConfirmation(name, email).catch((err) =>
      console.error("Failed to send contact confirmation email:", err),
    );

    // Send admin notification (non-blocking)
    sendAdminContactNotification({
      name,
      email,
      subject,
      message,
      submissionId: submission._id.toString(),
    }).catch((err) =>
      console.error("Failed to send admin notification email:", err),
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Your message has been submitted successfully. We'll get back to you within 24-48 hours.",
          { id: submission._id },
        ),
      );
  },
);
