/**
 * Shraddha Template
 * Clean professional template with blue section headers
 * Default template for the resume builder
 */

// Section components
import HeaderSection from "./sections/HeaderSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import SummarySection from "./sections/SummarySection";
import AchievementsSection from "./sections/AchievementsSection";
import StrengthsSection from "./sections/StrengthsSection";

// Preview component for template selection
import TemplatePreview from "./TemplatePreview";

// Sample data for template
import { sampleData } from "./sampleData";
import type { Template } from "../index";

const shraddhaTemplate: Template = {
  id: "shraddha",
  name: "Shraddha",
  description: "Clean professional resume with blue section headers",
  themeColor: "#2563eb",
  fontFamily: "'Inter', sans-serif",
  preview: TemplatePreview,

  // Section components map
  sections: {
    header: HeaderSection,
    education: EducationSection,
    experience: ExperienceSection,
    projects: ProjectsSection,
    skills: SkillsSection,
    summary: SummarySection,
    achievements: AchievementsSection,
    strengths: StrengthsSection,
  },

  sampleData: sampleData as unknown as Record<string, unknown>,
};

export default shraddhaTemplate;
