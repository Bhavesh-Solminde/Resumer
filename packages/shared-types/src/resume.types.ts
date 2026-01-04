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
  isVisible?: boolean;
  title?: string;
}

export interface EducationSettings extends BaseSectionSettings {
  showGPA?: boolean;
  showLocation?: boolean;
  showDates?: boolean;
  showDescription?: boolean;
}

export interface ExperienceSettings extends BaseSectionSettings {
  showBullets?: boolean;
  showLocation?: boolean;
  showDates?: boolean;
  showDescription?: boolean;
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
  showProficiency?: boolean;
  layout?: "grid" | "list" | "tags";
}

export interface HeaderSettings extends BaseSectionSettings {
  showPhoto?: boolean;
  showSocialIcons?: boolean;
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
  | "professional"
  | "elegant"
  | "minimal"
  | "shraddha";
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
  | "sections"
  | "design"
  | "templates"
  | "settings"
  | "ai"
  | "addSection"
  | "rearrange"
  | "branding";

export interface IActivePanels {
  sections: boolean;
  design: boolean;
  templates: boolean;
  settings: boolean;
  ai: boolean;
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
