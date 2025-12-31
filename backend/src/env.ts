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
};

export default ENV;
