import { v2 as cloudinary } from "cloudinary";
import ENV from "../env.js";
import streamifier from "streamifier";

const cloudinaryUpload = async (fileBuffer) => {
  try {
    // We wrap the stream logic in a Promise so we can 'await' it
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Resumer",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the buffer into the upload stream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    // Now we can simply return the full result object
    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error; // Re-throw so the Controller knows it failed
  }
};

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinaryUpload;
