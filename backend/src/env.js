import dotenv from "dotenv";
dotenv.config();
const ENV = {
  PORT: `${process.env.PORT}`,
  MONGODB_URI: `${process.env.MONGODB_URI}`,
  NODE_ENV: `${process.env.NODE_ENV}`,
  CORS_ORIGIN: `${process.env.CORS_ORIGIN}`,
  CLOUDINARY_CLOUD_NAME: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  CLOUDINARY_API_KEY: `${process.env.CLOUDINARY_API_KEY}`,
  CLOUDINARY_API_SECRET: `${process.env.CLOUDINARY_API_SECRET}`,
  GEMINI_API_KEY: `${process.env.GEMINI_API_KEY}`,
  ACCESS_TOKEN_SECRET: `${process.env.ACCESS_TOKEN_SECRET}`,
  ACCESS_TOKEN_EXPIRY: `${process.env.ACCESS_TOKEN_EXPIRY}`,
  REFRESH_TOKEN_SECRET: `${process.env.REFRESH_TOKEN_SECRET}`,
  REFRESH_TOKEN_EXPIRY: `${process.env.REFRESH_TOKEN_EXPIRY}`,
};
export default ENV;
