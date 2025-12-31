import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import ENV from "../env.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @returns Cloudinary upload result
 */
const cloudinaryUpload = async (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  // We wrap the stream logic in a Promise so we can 'await' it
  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Resumer",
          resource_type: "raw",
          access_mode: "public",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload returned no result"));
          }
        }
      );

      // Pipe the buffer into the upload stream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    }
  );

  // Now we can simply return the full result object
  return uploadResult;
};

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinaryUpload;
