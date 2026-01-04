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
  professional: {
    id: "professional",
    name: "Professional",
    preview: "/templates/professional.png",
    layout: "single-column",
    headerStyle: "left-aligned",
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    preview: "/templates/elegant.png",
    layout: "single-column",
    headerStyle: "left-aligned",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    preview: "/templates/minimal.png",
    layout: "single-column",
    headerStyle: "left-aligned",
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
          credentialId: "",
        },
      ],
    },
  },
  languages: {
    type: "languages",
    label: "Languages",
    icon: "Globe",
    data: {
      items: [
        { id: uuidv4(), language: "English", proficiency: "Native" },
        { id: uuidv4(), language: "Spanish", proficiency: "Intermediate" },
      ],
    },
  },
  awards: {
    type: "awards",
    label: "Awards",
    icon: "Trophy",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Award Title",
          issuer: "Issuing Organization",
          date: "MM/YYYY",
          description: "",
        },
      ],
    },
  },
  references: {
    type: "references",
    label: "References",
    icon: "Users",
    data: {
      items: [
        {
          id: uuidv4(),
          name: "Reference Name",
          title: "Title",
          company: "Company",
          email: "email@example.com",
          phone: "",
        },
      ],
    },
  },
  publications: {
    type: "publications",
    label: "Publications",
    icon: "BookOpen",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Publication Title",
          publisher: "Publisher",
          date: "MM/YYYY",
          link: "",
        },
      ],
    },
  },
  socialLinks: {
    type: "socialLinks",
    label: "Find Me Online",
    icon: "Link",
    data: {
      items: [
        { id: uuidv4(), platform: "LinkedIn", url: "" },
        { id: uuidv4(), platform: "GitHub", url: "" },
        { id: uuidv4(), platform: "Portfolio", url: "" },
      ],
    },
  },
  strengths: {
    type: "strengths",
    label: "Strengths",
    icon: "Zap",
    data: {
      items: ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
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
  custom: {
    type: "custom",
    label: "Custom Section",
    icon: "Plus",
    data: {
      title: "Custom Section",
      content: "Add your custom content here.",
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
    // This will be implemented to load the full basic template data
    // For now, just set the template ID
    set({ template: "basic" });
  },

  // Load shraddha template
  loadShraddhaTemplate: () => {
    // This will be implemented to load the full shraddha template data
    set({ template: "shraddha" });
  },

  // Load template sample data
  loadTemplateSampleData: (templateId) => {
    // Placeholder - will integrate with getTemplateSampleData
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
