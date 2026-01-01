import multer from "multer";

const storage = multer.memoryStorage();

/**
 * Multer middleware for handling file uploads in memory
 * Max file size: 5MB
 */
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
