/**
 * Slices barrel export
 */

export {
  createResumeDataSlice,
  createDefaultSectionSettings,
} from "./resumeDataSlice";
export type { ResumeDataState, ResumeDataActions } from "./resumeDataSlice";

export { createThemeSlice, defaultTheme } from "./themeSlice";
export type { ThemeState, ThemeActions } from "./themeSlice";

export {
  createTemplatesSlice,
  defaultTemplates,
  createSectionTemplates,
} from "./templatesSlice";
export type { TemplatesState, TemplatesActions } from "./templatesSlice";

export { createUISlice } from "./uiSlice";
export type { UIState, UIActions } from "./uiSlice";
