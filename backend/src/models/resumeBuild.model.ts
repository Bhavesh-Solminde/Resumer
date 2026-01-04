import mongoose, { Document, Schema, Types } from "mongoose";

// ============================================================================
// Sub-document interfaces
// ============================================================================

export interface IEducation {
  institution: string;
  degree: string;
  start: string;
  end: string;
  score: string;
}

export interface IExperience {
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

export interface IProject {
  title: string;
  link: string;
  start: string;
  end: string;
  description: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface IExtracurricular {
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface ISkills {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
}

export interface IResumeContent {
  personalInfo: IPersonalInfo;
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  certifications: ICertification[];
  extracurricular: IExtracurricular[];
  skills: ISkills;
}

export interface ILayout {
  sectionOrder: string[];
}

// ============================================================================
// Main document interface
// ============================================================================

export interface IResumeBuild {
  userId: Types.ObjectId;
  title: string;
  templateId: string;
  thumbnail: string;
  content: IResumeContent;
  /**
   * TODO: Implement "Create Resume from Scan" feature
   * - Link resume to the analyzed/uploaded resume scan
   * - Pre-populate content from AI analysis results
   * - Show "imported from scan" indicator in UI
   */
  sourceScanId: Types.ObjectId | null;
  layout: ILayout;
  createdAt: Date;
  updatedAt: Date;
}

export type ResumeBuildDocument = Document<Types.ObjectId> & IResumeBuild;

// ============================================================================
// Sub-schemas
// ============================================================================

const EducationSchema = new Schema<IEducation>(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    score: { type: String, default: "" },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const ExtracurricularSchema = new Schema<IExtracurricular>(
  {
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

// ============================================================================
// Main schema
// ============================================================================

const ResumeBuildSchema = new Schema<IResumeBuild>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
    },
    templateId: {
      type: String,
      default: "Shradha Khapra",
    },
    thumbnail: {
      type: String,
      default: "",
    },
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
      education: [EducationSchema],
      experience: [ExperienceSchema],
      projects: [ProjectSchema],
      certifications: [CertificationSchema],
      extracurricular: [ExtracurricularSchema],
      skills: {
        languages: [{ type: String }],
        frameworks: [{ type: String }],
        tools: [{ type: String }],
        default: { languages: [], frameworks: [], tools: [] },
      },
    },
    sourceScanId: {
      type: Schema.Types.ObjectId,
      ref: "ResumeScan",
      default: null,
    },
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

const ResumeBuild = mongoose.model<IResumeBuild>(
  "resumeBuild",
  ResumeBuildSchema
);
export default ResumeBuild;
