import Mongoose from "mongoose";

const ResumeScanSchema = new Mongoose.Schema(
  {
    originalName: {
      type: String, // e.g., "Bhavesh_Resume_Final.pdf"
      required: true,
    },
    pdfUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URl
      default: null,
    },
    owner: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User", // Links back to your User model
      required: true,
    },
    atsScore: {
      type: Number, // e.g., 85
      required: true,
    },
    // We store the full AI JSON response here
    analysisResult: {
      type: Object, // This allows flexibility for the JSON structure
      required: true,
    },
  },
  { timestamps: true }
);

const ResumeScan = Mongoose.model("ResumeScan", ResumeScanSchema);
export default ResumeScan;
