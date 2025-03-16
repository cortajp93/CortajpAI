import nodemailer from "nodemailer";
import { type Waitlist } from "@shared/schema";

// Initialize nodemailer transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(entry: Waitlist) {
  // If SMTP is not configured, log and return
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("SMTP not configured, skipping email send");
    return;
  }

  const verificationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/verify?token=${entry.verificationToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: entry.email,
      subject: "Verify your email address",
      html: `
        <h2>Welcome to our Waitlist!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${verificationUrl}">Verify Email Address</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    console.log(`Verification email sent to ${entry.email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
