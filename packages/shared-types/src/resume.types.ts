/**
 * Resume Types
 * Types for resume data, theme, and settings
 */

import type { Section, SectionType } from "./sections.types.js";

// ============================================================================
// Theme Types
// ============================================================================

export type FontSize = "small" | "medium" | "large";
export type BackgroundPattern = "plain" | "dots" | "lines" | "grid";

export interface ITheme {
  primaryColor: string;
  /** TODO: Add accentColor picker to DesignPanel - currently only used in ShraddhaHeader for highlight backgrounds */
  accentColor: string;
  fontFamily: string;
  fontSize: FontSize;
  pageMargins: number;
  sectionSpacing: number;
  lineHeight: number;
  background: BackgroundPattern;
}

export const DEFAULT_THEME: ITheme = {
  primaryColor: "#1e3a5f",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  fontSize: "medium",
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
// Resume Data (Core State)
// ============================================================================

export interface IResumeData {
  sections: Section[];
  template: TemplateId;
  theme: ITheme;
  sectionSettings: SectionSettingsMap;
  sectionOrder: string[];
}

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
export interface IThemeState {
  theme: ITheme;
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
    IThemeState,
    ITemplatesState,
    IUIState {}
