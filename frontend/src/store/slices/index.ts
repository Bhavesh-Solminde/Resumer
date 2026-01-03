/**
 * Slices barrel export
 */

export {
  createResumeDataSlice,
  createDefaultSectionSettings,
} from "./resumeDataSlice";
export type { ResumeDataState, ResumeDataActions } from "./resumeDataSlice";

export { createStylingSlice, defaultStyle } from "./stylingSlice";
export type { StylingState, StylingActions } from "./stylingSlice";

export {
  createTemplatesSlice,
  defaultTemplates,
  createSectionTemplates,
} from "./templatesSlice";
export type { TemplatesState, TemplatesActions } from "./templatesSlice";

export { createUISlice } from "./uiSlice";
export type { UIState, UIActions } from "./uiSlice";
