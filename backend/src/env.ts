import dotenv from "dotenv";
dotenv.config();

/**
 * Environment variables configuration
 */
interface IEnv {
  PORT: string;
  MONGODB_URI: string;
  NODE_ENV: string;
  CORS_ORIGIN: string | undefined;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  GEMINI_API_KEY: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  // Razorpay
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  // Email (Nodemailer)
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  ADMIN_EMAIL: string;
}

const ENV: IEnv = {
  PORT: `${process.env.PORT}`,
  MONGODB_URI: `${process.env.MONGODB_URI}`,
  NODE_ENV: `${process.env.NODE_ENV}`,
  CORS_ORIGIN: process.env.CORS_ORIGIN || undefined,
  CLOUDINARY_CLOUD_NAME: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  CLOUDINARY_API_KEY: `${process.env.CLOUDINARY_API_KEY}`,
  CLOUDINARY_API_SECRET: `${process.env.CLOUDINARY_API_SECRET}`,
  GEMINI_API_KEY: `${process.env.GEMINI_API_KEY}`,
  ACCESS_TOKEN_SECRET: `${process.env.ACCESS_TOKEN_SECRET}`,
  ACCESS_TOKEN_EXPIRY: `${process.env.ACCESS_TOKEN_EXPIRY}`,
  REFRESH_TOKEN_SECRET: `${process.env.REFRESH_TOKEN_SECRET}`,
  REFRESH_TOKEN_EXPIRY: `${process.env.REFRESH_TOKEN_EXPIRY}`,
  GOOGLE_CLIENT_ID: `${process.env.GOOGLE_CLIENT_ID}`,
  GOOGLE_CLIENT_SECRET: `${process.env.GOOGLE_CLIENT_SECRET}`,
  GOOGLE_CALLBACK_URL: `${process.env.GOOGLE_CALLBACK_URL}`,
  GITHUB_CLIENT_ID: `${process.env.GITHUB_CLIENT_ID}`,
  GITHUB_CLIENT_SECRET: `${process.env.GITHUB_CLIENT_SECRET}`,
  GITHUB_CALLBACK_URL: `${process.env.GITHUB_CALLBACK_URL}`,
  // Razorpay
  RAZORPAY_KEY_ID: `${process.env.RAZORPAY_KEY_ID}`,
  RAZORPAY_KEY_SECRET: `${process.env.RAZORPAY_KEY_SECRET}`,
  RAZORPAY_WEBHOOK_SECRET: `${process.env.RAZORPAY_WEBHOOK_SECRET}`,
  // Email
  SMTP_HOST: `${process.env.SMTP_HOST}`,
  SMTP_PORT: `${process.env.SMTP_PORT}`,
  SMTP_USER: `${process.env.SMTP_USER}`,
  SMTP_PASS: `${process.env.SMTP_PASS}`,
  SMTP_FROM: `${process.env.SMTP_FROM}`,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "bhaveshsolminde@gmail.com",
};

export default ENV;
