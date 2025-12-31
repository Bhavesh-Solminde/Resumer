import mongoose from "mongoose";
import ENV from "../env.js";

export const connectDB = async () => {
  try {
    const MongoDB_Instance = await mongoose.connect(ENV.MONGODB_URI);
    console.log(
      `MongoDB connected successfully: ${MongoDB_Instance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
