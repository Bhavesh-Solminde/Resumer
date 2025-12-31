import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Factory function for default section templates
const createDefaultSections = () => ({
  header: {
    id: "header",
    type: "header",
    locked: true,
    data: {
      fullName: "Your Name",
      title: "Professional Title",
      email: "email@example.com",
      phone: "+1 234 567 890",
      location: "City, Country",
      linkedin: "",
      website: "",
    },
  },
  summary: {
    id: "summary",
    type: "summary",
    data: {
      content:
        "A brief professional summary highlighting your key qualifications, experience, and career objectives.",
    },
  },
  experience: {
    id: "experience",
    type: "experience",
    data: {
      items: [
        {
          id: uuidv4(),
          title: "Job Title",
          company: "Company Name",
          location: "City, Country",
          startDate: "MM/YYYY",
          endDate: "Present",
          description:
            "Describe your responsibilities and achievements in this role.",
          bullets: [],
        },
      ],
    },
  },
  education: {
    id: "education",
    type: "education",
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
  skills: {
    id: "skills",
    type: "skills",
    data: {
      title: "Skills",
      items: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    },
  },
  projects: {
    id: "projects",
    type: "projects",
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
});

// Factory function for additional section templates
const createSectionTemplates = () => ({
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
  volunteering: {
    type: "volunteering",
    label: "Volunteering",
    icon: "Heart",
    data: {
      items: [
        {
          id: uuidv4(),
          role: "Volunteer Role",
          organization: "Organization Name",
          date: "MM/YYYY - MM/YYYY",
          description: "Description of your volunteer work.",
        },
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
  interests: {
    type: "interests",
    label: "Interests",
    icon: "Sparkles",
    data: {
      items: ["Interest 1", "Interest 2", "Interest 3"],
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
  courses: {
    type: "courses",
    label: "Training / Courses",
    icon: "GraduationCap",
    data: {
      items: [
        {
          id: uuidv4(),
          name: "Course Name",
          provider: "Provider",
          date: "MM/YYYY",
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

// Template layouts
const templates = {
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
};

// Default theme settings
const defaultTheme = {
  primaryColor: "#1e3a5f",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  fontSize: "medium",
  pageMargins: 2,
  sectionSpacing: 2,
  lineHeight: 1.5,
  background: "plain",
};

// Factory function for initial resume state
const createInitialResumeData = () => {
  const defaultSections = createDefaultSections();
  const sections = [
    { ...defaultSections.header },
    { ...defaultSections.summary, id: uuidv4() },
    { ...defaultSections.experience, id: uuidv4() },
    { ...defaultSections.education, id: uuidv4() },
    { ...defaultSections.skills, id: uuidv4() },
    { ...defaultSections.projects, id: uuidv4() },
  ];
  return {
    sections,
    sectionOrder: sections.map((s) => s.id),
    template: "modern",
    theme: { ...defaultTheme },
  };
};

const MAX_HISTORY = 50;

export const useBuildStore = create((set, get) => ({
  // Resume Data
  resumeData: createInitialResumeData(),

  // History for undo/redo
  history: [],
  historyIndex: -1,

  // UI State
  activePanel: null, // 'addSection' | 'rearrange' | 'templates' | 'design' | null
  selectedSectionId: null,
  isLoading: false,

  // Available templates and section templates
  templates,
  sectionTemplates: createSectionTemplates(),

  // Save state to history
  saveToHistory: () => {
    const { resumeData, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(resumeData)));

    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // Undo action
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        resumeData: JSON.parse(JSON.stringify(history[historyIndex - 1])),
      });
    }
  },

  // Redo action
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        resumeData: JSON.parse(JSON.stringify(history[historyIndex + 1])),
      });
    }
  },

  // Check if can undo/redo
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // Add a new section
  addSection: (sectionType) => {
    const { resumeData, saveToHistory } = get();
    saveToHistory();

    // Get fresh template with new UUIDs
    const freshTemplates = createSectionTemplates();
    const template = freshTemplates[sectionType];
    if (!template) return;

    const newSection = {
      id: uuidv4(),
      type: template.type,
      data: JSON.parse(JSON.stringify(template.data)),
    };

    set({
      resumeData: {
        ...resumeData,
        sections: [...resumeData.sections, newSection],
        sectionOrder: [...resumeData.sectionOrder, newSection.id],
      },
    });
  },

  // Remove a section
  removeSection: (sectionId) => {
    const { resumeData, saveToHistory } = get();
    const section = resumeData.sections.find((s) => s.id === sectionId);
    if (section?.locked) return; // Can't remove locked sections

    saveToHistory();

    set({
      resumeData: {
        ...resumeData,
        sections: resumeData.sections.filter((s) => s.id !== sectionId),
        sectionOrder: resumeData.sectionOrder.filter((id) => id !== sectionId),
      },
    });
  },

  // Reorder sections
  reorderSections: (newOrder) => {
    const { resumeData, saveToHistory } = get();
    saveToHistory();

    // Reorder sections array based on new order
    const reorderedSections = newOrder.map((id) =>
      resumeData.sections.find((s) => s.id === id)
    );

    set({
      resumeData: {
        ...resumeData,
        sections: reorderedSections,
        sectionOrder: newOrder,
      },
    });
  },

  // Update section data
  updateSectionData: (sectionId, newData) => {
    const { resumeData, saveToHistory } = get();
    saveToHistory();

    set({
      resumeData: {
        ...resumeData,
        sections: resumeData.sections.map((section) =>
          section.id === sectionId
            ? { ...section, data: { ...section.data, ...newData } }
            : section
        ),
      },
    });
  },

  // Update theme settings
  updateTheme: (themeUpdates) => {
    const { resumeData, saveToHistory } = get();
    saveToHistory();

    set({
      resumeData: {
        ...resumeData,
        theme: { ...resumeData.theme, ...themeUpdates },
      },
    });
  },

  // Change template
  changeTemplate: (templateId) => {
    const { resumeData, saveToHistory, templates } = get();
    if (!templates[templateId]) return;

    saveToHistory();

    set({
      resumeData: {
        ...resumeData,
        template: templateId,
      },
    });
  },

  // Set active panel
  setActivePanel: (panel) => {
    set({ activePanel: panel });
  },

  // Set selected section
  setSelectedSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },

  // Reset to default
  resetResume: () => {
    const { saveToHistory } = get();
    saveToHistory();

    set({
      resumeData: createInitialResumeData(),
      sectionTemplates: createSectionTemplates(),
    });
  },

  // Initialize history with current state
  initializeHistory: () => {
    const { resumeData } = get();
    set({
      history: [JSON.parse(JSON.stringify(resumeData))],
      historyIndex: 0,
    });
  },
}));

export default useBuildStore;
