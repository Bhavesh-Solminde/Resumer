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

// Certification Schema
const CertificationSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" }, // e.g. "AWS Certified Solutions Architect"
    issuer: { type: String, default: "" }, // e.g. "Amazon Web Services"
    date: { type: String, default: "" }, // e.g. "Aug 2024"
    link: { type: String, default: "" }, // Credential URL
  },
  { _id: false }
);

// Extracurricular Schema
const ExtracurricularSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" }, // e.g. "Volunteer Lead"
    organization: { type: String, default: "" }, // e.g. "Rotary Club"
    date: { type: String, default: "" },
    description: { type: String, default: "" }, // e.g. "Organized charity drive..."
  },
  { _id: false }
);

// --- MAIN SCHEMA ---

const ResumeBuildSchema = new mongoose.Schema(
  {
    // 1. LINK TO USER (Critical for Dashboard)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // 2. META DATA (For Dashboard Cards)
    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
    },
    templateId: {
      type: String,
      default: "Shradha Khapra", // Allows you to switch designs later
    },
    thumbnail: {
      type: String,
      default: "", // Cloudinary URL for the dashboard preview image
    },

    // 3. THE CORE CONTENT (Matches your Frontend State EXACTLY)
    content: {
      personalInfo: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        website: { type: String, default: "" },
        summary: { type: String, default: "" },
      },

      // Arrays using the sub-schemas defined above
      education: [EducationSchema],
      experience: [ExperienceSchema],
      projects: [ProjectSchema],
      certifications: [CertificationSchema],
      extracurricular: [ExtracurricularSchema],

      // Flexible Skills Structure (Categorized)
      skills: {
        languages: [{ type: String }], // e.g., ["Java", "Python"]
        frameworks: [{ type: String }], // e.g., ["React", "Node.js"]
        tools: [{ type: String }], // e.g., ["Git", "Docker"]
        default: { languages: [], frameworks: [], tools: [] },
      },
    },
    // 4. HISTORY TRACKING
    sourceScanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeScan", // Links back to the analysis if applicable
      default: null,
    },
    // 2. PRESENTATION (The "Playlist")
    // This defines the render order. Personal Info is fixed in frontend, so exclude it.
    layout: {
      sectionOrder: {
        type: [String],
        default: [
          "education",
          "experience",
          "projects",
          "skills",
          "certifications",
          "extracurricular",
        ],
      },
    },
  },
  { timestamps: true }
);

export default ResumeBuild = mongoose.model("resumeBuild", ResumeBuildSchema);
