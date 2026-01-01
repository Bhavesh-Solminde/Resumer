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
    resumeText: {
      type: String, // Extracted text from PDF
    },
    // We store the full AI JSON response here
    analysisResult: {
      type: Object, // This allows flexibility for the JSON structure
      required: true,
    },
    type: {
      type: String,
      enum: ["analysis", "optimization"],
      default: "analysis",
    },
    gOptimized: {
      type: String,
      default: "",
    },
    jdOptimized: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for faster history queries (filtering by owner, sorting by date)
ResumeScanSchema.index({ owner: 1, createdAt: -1 });

const ResumeScan = Mongoose.model("ResumeScan", ResumeScanSchema);
export default ResumeScan;
