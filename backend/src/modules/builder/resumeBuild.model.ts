import mongoose, { Document, Schema, Types } from "mongoose";

// ============================================================================
// Sub-document interfaces (aligned with frontend @resumer/shared-types)
// ============================================================================

export interface IEducation {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface IExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface IProject {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: string[];
  link: string;
}

export interface ICertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId: string;
}

export interface IExtracurricular {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ISkills {
  title: string;
  items: string[];
}

export interface IPersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ISummary {
  content: string;
}

export interface IResumeContent {
  personalInfo: IPersonalInfo;
  summary: ISummary;
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  certifications: ICertification[];
  extracurricular: IExtracurricular[];
  achievements: IAchievement[];
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
// Sub-schemas (aligned with frontend @resumer/shared-types)
// ============================================================================

const EducationSchema = new Schema<IEducation>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    gpa: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
    bullets: [{ type: String }],
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    name: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
    bullets: [{ type: String }],
    link: { type: String, default: "" },
  },
  { _id: false },
);

const CertificationSchema = new Schema<ICertification>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    credentialId: { type: String, default: "" },
  },
  { _id: false },
);

const ExtracurricularSchema = new Schema<IExtracurricular>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
    bullets: [{ type: String }],
  },
  { _id: false },
);

const AchievementSchema = new Schema<IAchievement>(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { _id: false },
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
      default: "basic",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    content: {
      personalInfo: {
        fullName: { type: String, default: "" },
        title: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
      },
      summary: {
        content: { type: String, default: "" },
      },
      education: [EducationSchema],
      experience: [ExperienceSchema],
      projects: [ProjectSchema],
      certifications: [CertificationSchema],
      extracurricular: [ExtracurricularSchema],
      achievements: [AchievementSchema],
      skills: {
        title: { type: String, default: "Skills" },
        items: [{ type: String }],
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
          "header",
          "summary",
          "education",
          "experience",
          "projects",
          "skills",
          "certifications",
          "achievements",
          "extracurricular",
        ],
      },
    },
  },
  { timestamps: true },
);

const ResumeBuild = mongoose.model<IResumeBuild>(
  "resumeBuild",
  ResumeBuildSchema,
);
export default ResumeBuild;
