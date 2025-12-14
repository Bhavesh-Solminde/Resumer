import dotenv from "dotenv";
dotenv.config();
const ENV = {
  PORT: `${process.env.PORT}`,
  MONGODB_URI: `${process.env.MONGODB_URI}`,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  CORS_ORIGIN: `${process.env.CORS_ORIGIN}`,
  CLOUDINARY_CLOUD_NAME: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  CLOUDINARY_API_KEY: `${process.env.CLOUDINARY_API_KEY}`,
  CLOUDINARY_API_SECRET: `${process.env.CLOUDINARY_API_SECRET}`,
  GEMINI_API_KEY: `${process.env.GEMINI_API_KEY}`,
};
export default ENV;
