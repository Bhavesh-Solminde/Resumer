/**
 * Templates Slice
 * Handles template registration, switching, and sample data loading
 */

import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import type {
  TemplateId,
  ITemplateConfig,
  TemplateConfigMap,
  SectionTemplateMap,
  Section,
  SectionType,
} from "@resumer/shared-types";
import type { BuildState, BuildActions } from "../Build.store";

// ============================================================================
// State Interface
// ============================================================================

export interface TemplatesState {
  template: TemplateId;
  registeredTemplates: TemplateConfigMap;
  sectionTemplates: SectionTemplateMap;
}

// ============================================================================
// Actions Interface
// ============================================================================

export interface TemplatesActions {
  changeTemplate: (templateId: TemplateId) => void;
  loadBasicTemplate: () => void;
  loadShraddhaTemplate: () => void;
  loadTemplateSampleData: (templateId: TemplateId) => void;
  resetResume: () => void;
}

// ============================================================================
// Default Templates Config
// ============================================================================

export const defaultTemplates: TemplateConfigMap = {
  basic: {
    id: "basic",
    name: "Basic",
    preview: "/templates/basic.png",
    layout: "single-column",
    headerStyle: "left-aligned",
    description: "Clean and simple template with teal accents",
  },
  modern: {
    id: "modern",
    name: "Modern",
    preview: "/templates/modern.png",
    layout: "single-column",
    headerStyle: "centered",
  },
  shraddha: {
    id: "shraddha",
    name: "Shraddha Khapra",
    preview: "/templates/shraddha.png",
    layout: "single-column",
    headerStyle: "centered",
    description: "Professional template with blue headers and yellow highlight",
  },
};

// ============================================================================
// Section Templates Factory
// ============================================================================

export const createSectionTemplates = (): SectionTemplateMap => ({
  summary: {
    type: "summary",
    label: "Professional Summary",
    icon: "User",
    data: {
      content: "A brief professional summary highlighting your key qualifications, experience, and career objectives.",
    },
  },
  experience: {
    type: "experience",
    label: "Work Experience",
    icon: "Briefcase",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Job Title",
          company: "Company Name",
          location: "City, Country",
          startDate: "MM/YYYY",
          endDate: "Present",
          description: "Describe your responsibilities and achievements in this role.",
          bullets: [],
        },
      ],
    },
  },
  education: {
    type: "education",
    label: "Education",
    icon: "GraduationCap",
    data: {
      items: [
        {
          id: uuidv4(),
          degree: "Degree Name",
          institution: "University/College Name",
          location: "City, Country",
          startDate: "MM/YYYY",
          endDate: "MM/YYYY",
          gpa: "",
          description: "",
        },
      ],
    },
  },
  projects: {
    type: "projects",
    label: "Projects",
    icon: "Code",
    data: {
      items: [
        {
          id: uuidv4(),
          name: "Project Name",
          subtitle: "Project Type",
          date: "MM/YYYY",
          description: "Brief description of the project and your role.",
          bullets: [],
          link: "",
        },
      ],
    },
  },
  skills: {
    type: "skills",
    label: "Skills",
    icon: "Zap",
    data: {
      title: "Skills",
      items: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    },
  },
  certifications: {
    type: "certifications",
    label: "Certifications",
    icon: "Award",
    data: {
      items: [
        {
          id: uuidv4(),
          name: "Certification Name",
          issuer: "Issuing Organization",
          date: "MM/YYYY",
          expiryDate: "",
          credentialId: "",
        },
      ],
    },
  },
  extracurricular: {
    type: "extracurricular",
    label: "Extracurricular Activities",
    icon: "Users",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Role/Position",
          organization: "Organization Name",
          startDate: "MM/YYYY",
          endDate: "MM/YYYY",
          description: "Brief description of your involvement",
          bullets: [],
        },
      ],
    },
  },
  achievements: {
    type: "achievements",
    label: "Achievements",
    icon: "Medal",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Achievement 1",
          description: "Description of achievement 1",
          date: "",
        },
        {
          id: uuidv4(),
          title: "Achievement 2",
          description: "Description of achievement 2",
          date: "",
        },
      ],
    },
  },
});

// ============================================================================
// Slice Creator
// ============================================================================

export const createTemplatesSlice: StateCreator<
  BuildState & BuildActions,
  [],
  [],
  TemplatesActions
> = (set, get) => ({
  // Initial state removed to prevent overriding Build.store.ts defaults
  // template: "basic",
  // registeredTemplates: defaultTemplates,
  // sectionTemplates: createSectionTemplates(),

  // Change template
  changeTemplate: (templateId) => {
    const { registeredTemplates } = get();
    if (!registeredTemplates[templateId]) return;

    // For specific templates, load their sample data
    if (templateId === "basic") {
      get().loadBasicTemplate();
    } else if (templateId === "shraddha") {
      get().loadShraddhaTemplate();
    } else {
      set({ template: templateId });
    }
  },

  // Load basic template
  loadBasicTemplate: () => {
    // TODO: Load unique sample data for basic template (different from shraddha)
    // Should call set({ sections: basicSampleSections, template: "basic" })
    set({ template: "basic" });
  },

  // Load shraddha template
  loadShraddhaTemplate: () => {
    // TODO: Load full shraddha template sample data with realistic content
    // Should call set({ sections: shraddhaSampleSections, template: "shraddha" })
    set({ template: "shraddha" });
  },

  // Load template sample data
  loadTemplateSampleData: (templateId) => {
    // TODO: Integrate with getTemplateSampleData() from templates/index.ts
    // Should load template-specific sections and styling
    set({ template: templateId });
  },

  // Reset resume to initial state
  resetResume: () => {
    set({
      sectionTemplates: createSectionTemplates(),
    });
    // The actual reset of sections/theme happens through other slices
  },
});
