/**
 * Resume Types
 * Types for resume data, theme, and settings
 */

import type { Section, SectionType } from "./sections.types.js";

// ============================================================================
// Theme Types
// ============================================================================

// export type FontSize = "small" | "medium" | "large";
export type BackgroundPattern = "plain" | "dots" | "lines" | "grid";

export interface IStyle {
  primaryColor: string;
  /** TODO: Add accentColor picker to DesignPanel - currently only used in ShraddhaHeader for highlight backgrounds */
  accentColor: string;
  fontFamily: string;
  fontSize: number; // Changed from FontSize enum to number
  pageMargins: number;
  sectionSpacing: number;
  lineHeight: number;
  background: BackgroundPattern;
}

export const DEFAULT_THEME: IStyle = {
  primaryColor: "#1e3a5f",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  fontSize: 11, // Default to 11pt
  pageMargins: 2,
  sectionSpacing: 2,
  lineHeight: 1.5,
  background: "plain",
};

// ============================================================================
// Section Settings
// ============================================================================

export interface BaseSectionSettings {
  /** TODO: Implement section visibility toggle - hide sections from PDF without deleting */
  isVisible?: boolean;
  /** TODO: Implement custom section title override in SectionSettings UI */
  title?: string;
}

export interface EducationSettings extends BaseSectionSettings {
  showGPA?: boolean;
  showLocation?: boolean;
  /** TODO: Implement showDates toggle in SectionSettings UI and Education section components */
  showDates?: boolean;
  showDescription?: boolean;
}

export interface ExperienceSettings extends BaseSectionSettings {
  showBullets?: boolean;
  showLocation?: boolean;
  /** TODO: Implement showDates toggle in SectionSettings UI and Experience section components */
  showDates?: boolean;
  showDescription?: boolean;
  /** TODO: Implement company logo upload/display feature in Experience section components */
  showCompanyLogo?: boolean;
}

export interface ProjectsSettings extends BaseSectionSettings {
  showDate?: boolean;
  showLink?: boolean;
  showBullets?: boolean;
  showTechnologies?: boolean;
}

export interface SkillsSettings extends BaseSectionSettings {
  showCategories?: boolean;
  /** TODO: Implement proficiency bars/indicators in Skills section templates */
  showProficiency?: boolean;
  /** TODO: Implement alternative layouts (list, tags) in Skills section - currently only grid is used */
  layout?: "grid" | "list" | "tags";
}

export interface HeaderSettings extends BaseSectionSettings {
  /** TODO: Implement photo upload and display in Header section components */
  showPhoto?: boolean;
  /** TODO: Implement social icons toggle - conditionally render LinkedIn/GitHub/Website icons in Header */
  showSocialIcons?: boolean;
  /** TODO: Implement header layout variations (left/center/right alignment) in templates */
  layout?: "left" | "center" | "right";
}

export interface CustomSectionSettings extends BaseSectionSettings {
  showDescription?: boolean;
  [key: string]: boolean | number | string | undefined;
}

export type AnySectionSettings =
  | EducationSettings
  | ExperienceSettings
  | ProjectsSettings
  | SkillsSettings
  | HeaderSettings
  | CustomSectionSettings;

// Alias for backward compatibility, but AnySectionSettings is preferred
export type ISectionSettings = AnySectionSettings;

export interface SectionSettingsMap {
  education: EducationSettings;
  experience: ExperienceSettings;
  projects: ProjectsSettings;
  skills: SkillsSettings;
  header: HeaderSettings;
  [key: string]: AnySectionSettings;
}

// ============================================================================
// Template Types
// ============================================================================

export type TemplateId =
  | "basic"
  | "modern"
  /** TODO: Create Professional template folder with section components (frontend/src/components/builder/templates/professional/) */
  | "professional"
  /** TODO: Create Elegant template folder with section components (frontend/src/components/builder/templates/elegant/) */
  | "elegant"
  /** TODO: Create Minimal template folder with section components (frontend/src/components/builder/templates/minimal/) */
  | "minimal"
  | "shraddha";
/** TODO: Implement two-column layout rendering in ResumePreview - currently all templates use single-column */
export type LayoutType = "single-column" | "two-column";
export type HeaderStyle = "left-aligned" | "centered" | "right-aligned";

export interface ITemplateConfig {
  id: TemplateId;
  name: string;
  preview: string;
  layout: LayoutType;
  headerStyle: HeaderStyle;
  description?: string;
}

export type TemplateConfigMap = Record<TemplateId, ITemplateConfig>;

// ============================================================================
// Template Theme Configuration
// ============================================================================

/**
 * Color palette for a template theme
 */
export interface ITemplateColors {
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
  headerBg: string;
}

/**
 * Layout configuration for a template
 */
export interface ITemplateLayout {
  headerAlign: "left" | "center";
  headerBorderStyle: "bottom" | "left" | "none";
  sectionBorderStyle: "bottom" | "none";
}

/**
 * Complete template theme definition
 */
export interface ITemplateTheme {
  id: TemplateId;
  name: string;
  colors: ITemplateColors;
  layout: ITemplateLayout;
}

/**
 * Pre-defined template themes matching editor templates
 * These serve as defaults when user hasn't customized primaryColor
 */
export const templateThemes: Record<string, ITemplateTheme> = {
  basic: {
    id: "basic",
    name: "Basic",
    colors: {
      primary: "#0d9488",    // teal-600
      accent: "#0f766e",     // teal-700
      text: "#1f2937",       // gray-800
      muted: "#6b7280",      // gray-500
      border: "#0d9488",     // teal-600
      headerBg: "transparent",
    },
    layout: {
      headerAlign: "center",
      headerBorderStyle: "bottom",
      sectionBorderStyle: "bottom",
    },
  },
  modern: {
    id: "modern",
    name: "Modern",
    colors: {
      primary: "#4f46e5",    // indigo-600
      accent: "#4338ca",     // indigo-700
      text: "#111827",       // gray-900
      muted: "#6b7280",      // gray-500
      border: "#e5e7eb",     // gray-200
      headerBg: "transparent",
    },
    layout: {
      headerAlign: "left",
      headerBorderStyle: "left",
      sectionBorderStyle: "bottom",
    },
  },
  shraddha: {
    id: "shraddha",
    name: "Shraddha Khapra",
    colors: {
      primary: "#0ea5e9",    // sky-500
      accent: "#0284c7",     // sky-600
      text: "#0f172a",       // slate-900
      muted: "#64748b",      // slate-500
      border: "#e2e8f0",     // slate-200
      headerBg: "#f0f9ff",   // sky-50
    },
    layout: {
      headerAlign: "center",
      headerBorderStyle: "bottom",
      sectionBorderStyle: "bottom",
    },
  },
  professional: {
    id: "professional",
    name: "Professional",
    colors: {
      primary: "#1e3a5f",
      accent: "#3b82f6",
      text: "#1f2937",
      muted: "#6b7280",
      border: "#1e3a5f",
      headerBg: "transparent",
    },
    layout: {
      headerAlign: "left",
      headerBorderStyle: "bottom",
      sectionBorderStyle: "bottom",
    },
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    colors: {
      primary: "#7c3aed",    // violet-600
      accent: "#6d28d9",     // violet-700
      text: "#1f2937",
      muted: "#6b7280",
      border: "#7c3aed",
      headerBg: "transparent",
    },
    layout: {
      headerAlign: "center",
      headerBorderStyle: "bottom",
      sectionBorderStyle: "bottom",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#374151",    // gray-700
      accent: "#4b5563",     // gray-600
      text: "#111827",
      muted: "#9ca3af",
      border: "#d1d5db",
      headerBg: "transparent",
    },
    layout: {
      headerAlign: "left",
      headerBorderStyle: "none",
      sectionBorderStyle: "bottom",
    },
  },
};

/**
 * Get template theme by ID with fallback to basic
 */
export const getTemplateTheme = (templateId?: string): ITemplateTheme => {
  return templateThemes[templateId || "basic"] || templateThemes.basic;
};

// ============================================================================
// Resume Data (Core State)
// ============================================================================

/**
 * ⚠️ ISSUE: Exported but never imported in frontend or backend
 * Frontend uses Zustand slices (resumeDataSlice) instead of this monolithic interface
 * TODO: Use this as the source of truth for the store shape OR delete if redundant
 */
// export interface IResumeData {
//   sections: Section[];
//   template: TemplateId;
//   theme: IStyle;
//   sectionSettings: SectionSettingsMap;
//   sectionOrder: string[];
// }

// ============================================================================
// Confirm Dialog
// ============================================================================

export interface IConfirmDialog {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "danger" | "warning" | "info";
}

// ============================================================================
// Active Panels (UI State)
// ============================================================================

export type PanelId =
  /** TODO: Create SectionsPanel component for section management (currently inline in ResumeEditor) */
  | "sections"
  | "design"
  | "templates"
  /** TODO: Create SettingsPanel component - see IActivePanels.settings */
  | "settings"
  /** TODO: Create AIPanel component for AI-powered resume optimization suggestions */
  | "ai"
  | "addSection"
  | "rearrange"
  /** TODO: Create BrandingPanel component content - panel exists but needs implementation */
  | "branding";

export interface IActivePanels {
  sections: boolean;
  design: boolean;
  templates: boolean;
  /** TODO: Create SettingsPanel component for global settings (PDF export options, paper size, dark mode toggle) */
  settings: boolean;
  // TODO: Add ai: boolean for AI integration panel
}

// ============================================================================
// Build Store State Types
// ============================================================================

/**
 * Resume data slice state (tracked by temporal middleware)
 */
export interface IResumeDataState {
  sections: Section[];
  sectionOrder: string[];
  sectionSettings: SectionSettingsMap;
}

/**
 * Theme slice state (tracked by temporal middleware)
 */
export interface IStyleState {
  theme: IStyle;
}

/**
 * Templates slice state
 */
export interface ITemplatesState {
  template: TemplateId;
  registeredTemplates: TemplateConfigMap;
}

/**
 * UI slice state (NOT tracked by temporal)
 */
export interface IUIState {
  activePanels: IActivePanels;
  selectedSectionId: string | null;
  confirmDialog: IConfirmDialog | null;
  isExporting: boolean;
}

/**
 * Combined build store state
 */
export interface IBuildState
  extends IResumeDataState,
    IStyleState,
    ITemplatesState,
    IUIState {}
