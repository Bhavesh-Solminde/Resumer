/**
 * Basic Template
 * Clean, simple template with teal accents
 */

// Section components
import HeaderSection from "./sections/HeaderSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import SummarySection from "./sections/SummarySection";
import AchievementsSection from "./sections/AchievementsSection";
import CertificationsSection from "./sections/CertificationsSection";
import ExtracurricularSection from "./sections/ExtracurricularSection";

// Preview component
import TemplatePreview from "./TemplatePreview";

// Sample data
import { sampleData } from "./sampleData";

const basicTemplate = {
  id: "basic",
  name: "Basic",
  description: "Clean and simple resume with teal accents",
  themeColor: "#0d9488",
  fontFamily: "'Inter', sans-serif",
  preview: TemplatePreview,

  sections: {
    header: HeaderSection,
    education: EducationSection,
    experience: ExperienceSection,
    projects: ProjectsSection,
    skills: SkillsSection,
    summary: SummarySection,
    achievements: AchievementsSection,
    certifications: CertificationsSection,
    extracurricular: ExtracurricularSection,
  },

  sampleData: sampleData as unknown as Record<string, unknown>,
};

export default basicTemplate;
