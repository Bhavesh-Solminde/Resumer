import mongoose from "mongoose";

// Sub-schemas ensure consistent structure for arrays (prevents "undefined" errors)
const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    score: { type: String, default: "" }, // CGPA/Percentage
  },
  { _id: false }
); // Disable auto-ID for subdocs to keep JSON clean

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "" }, // Storing rich text or bullet points as string
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ResumeBuild = new mongoose.Schema({
  // 1. LINK TO USER (Critical for Dashboard)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  // 2. META DATA (For Dashboard Cards)
  title: { type: String },
  // 3. THE CORE CONTENT (Matches your Frontend State EXACTLY)
  // Arrays using the sub-schemas defined above
  // Flexible Skills Structure (Categorized)
  // Using Mixed allows you to add categories dynamically if needed
  // Custom Sections (Optional scalability)
  // 4. HISTORY TRACKING
});
