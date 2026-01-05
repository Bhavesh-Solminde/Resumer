/**
 * Build Store - TypeScript version with slice composition and temporal middleware
 *
 * This store manages the resume builder state with:
 * - Slice-based architecture for maintainability
 * - Temporal middleware (zundo) for undo/redo on resumeData + theme
 * - Type-safe state and actions
 */

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { temporal } from "zundo";
import { v4 as uuidv4 } from "uuid";
import type {
  Section,
  SectionType,
  IStyle,
  ISectionSettings,
  SectionSettingsMap,
  TemplateId,
  TemplateConfigMap,
  SectionTemplateMap,
  IConfirmDialog,
  PanelId,
} from "@resumer/shared-types";

import {
  createResumeDataSlice,
  createStylingSlice,
  createTemplatesSlice,
  createUISlice,
  createDefaultSectionSettings,
  defaultStyle,
  defaultTemplates,
  createSectionTemplates,
  type ResumeDataState,
  type ResumeDataActions,
  type StylingState,
  type StylingActions,
  type TemplatesState,
  type TemplatesActions,
  type UIState,
  type UIActions,
} from "./slices";

// ============================================================================
// Combined State & Actions Types
// ============================================================================

export type BuildState = ResumeDataState &
  StylingState &
  TemplatesState &
  UIState;
export type BuildActions = ResumeDataActions &
  StylingActions &
  TemplatesActions &
  UIActions;

// ============================================================================
// Temporal State (what gets tracked for undo/redo)
// ============================================================================

type TemporalState = Pick<
  BuildState,
  "sections" | "sectionOrder" | "sectionSettings" | "style"
>;

// ============================================================================
// Default Sections Factory
// ============================================================================

const generateStarterSections = (): Section[] => {
  const headerSection: Section = {
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
  };

  const summarySection: Section = {
    id: uuidv4(),
    type: "summary",
    data: {
      content:
        "A brief professional summary highlighting your key qualifications, experience, and career objectives.",
    },
  };

  const experienceSection: Section = {
    id: uuidv4(),
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
  };

  const educationSection: Section = {
    id: uuidv4(),
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
  };

  const skillsSection: Section = {
    id: uuidv4(),
    type: "skills",
    data: {
      title: "Skills",
      items: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    },
  };

  const projectsSection: Section = {
    id: uuidv4(),
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
  };

  return [
    headerSection,
    educationSection,
    projectsSection,
    skillsSection,
    experienceSection,
  ];
};

// ============================================================================
// Initial State Factory
// ============================================================================

const initializeBuilderState = (): BuildState => {
  const sections = generateStarterSections();
  return {
    // Resume Data
    sections,
    sectionOrder: sections.map((s) => s.id),
    sectionSettings: createDefaultSectionSettings(),

    // Theme
    style: { ...defaultStyle },

    // Templates
    template: "basic",
    registeredTemplates: defaultTemplates,
    sectionTemplates: createSectionTemplates(),

    // UI
    activePanel: null,
    selectedSectionId: null,
    isLoading: false,
    isExporting: false,
    confirmDialog: null,
  };
};

// ============================================================================
// Backward Compatibility Types
// ============================================================================

interface ResumeDataComputed {
  sections: Section[];
  sectionOrder: string[];
  sectionSettings: SectionSettingsMap;
  style: IStyle;
  template: TemplateId;
}

interface UndoActions {
  /** @deprecated Use useTemporalStore().undo() */
  undo: () => void;
  /** @deprecated Use useTemporalStore().redo() */
  redo: () => void;
  /** @deprecated Use useTemporalStore() */
  canUndo: () => boolean;
  /** @deprecated Use useTemporalStore() */
  canRedo: () => boolean;
}

// ============================================================================
// Store Creation with Temporal Middleware
// ============================================================================

export const useBuildStore = create<BuildState & BuildActions & UndoActions>()(
  temporal(
    (set, get, api) => {
      // Get initial state
      const initialState = initializeBuilderState();

      // Create slices (they use the same set/get)
      const resumeDataSlice = createResumeDataSlice(set, get, api);
      const stylingSlice = createStylingSlice(set, get, api);
      const templatesSlice = createTemplatesSlice(set, get, api);
      const uiSlice = createUISlice(set, get, api);

      return {
        // Spread initial state
        ...initialState,

        // Spread slice actions (override initial state values)
        ...resumeDataSlice,
        ...stylingSlice,
        ...templatesSlice,
        ...uiSlice,

        // Backward compatibility: undo/redo functions
        // Note: These will be replaced after store creation
        undo: () => {},
        redo: () => {},
        canUndo: (): boolean => false,
        canRedo: (): boolean => false,
      };
    },
    {
      // Only track these fields for undo/redo
      partialize: (state): TemporalState => ({
        sections: state.sections,
        sectionOrder: state.sectionOrder,
        sectionSettings: state.sectionSettings,
        style: state.style,
      }),
      // Limit history size
      limit: 50,
      // Equality function for diffing
      equality: (pastState, currentState) =>
        JSON.stringify(pastState) === JSON.stringify(currentState),
    }
  )
);

// Now that the store is created, update the undo/redo functions
useBuildStore.setState({
  undo: () => {
    useBuildStore.temporal?.getState()?.undo?.();
  },
  redo: () => {
    useBuildStore.temporal?.getState()?.redo?.();
  },
  canUndo: (): boolean => {
    return (useBuildStore.temporal?.getState()?.pastStates?.length ?? 0) > 0;
  },
  canRedo: (): boolean => {
    return (useBuildStore.temporal?.getState()?.futureStates?.length ?? 0) > 0;
  },
});

// ============================================================================
// Temporal Store Hook (for undo/redo)
// ============================================================================

/**
 * Access the temporal store for undo/redo functionality.
 * The temporal store tracks changes to resumeData (sections, sectionOrder, sectionSettings) and theme.
 */
export const useTemporalStore = () => useBuildStore.temporal.getState();

// ============================================================================
// Convenience Hooks
// ============================================================================

export const useCanUndo = () =>
  useBuildStore.temporal.getState().pastStates.length > 0;
export const useCanRedo = () =>
  useBuildStore.temporal.getState().futureStates.length > 0;
export const useUndo = () => useBuildStore.temporal.getState().undo;
export const useRedo = () => useBuildStore.temporal.getState().redo;

// ============================================================================
// Backward Compatibility Hooks
// ============================================================================

/**
 * Hook to get resumeData object (backward compatibility)
 * Uses useShallow to prevent infinite re-renders when returning an object
 * @deprecated Use flat state properties directly
 */
export const useResumeData = () =>
  useBuildStore(
    useShallow((state: BuildState) => ({
      sections: state.sections,
      sectionOrder: state.sectionOrder,
      sectionSettings: state.sectionSettings,
      style: state.style,
      template: state.template,
    }))
  );

/**
 * Hook to get templates (backward compatibility)
 * @deprecated Use registeredTemplates directly
 */
export const useTemplates = () =>
  useBuildStore((state: BuildState) => state.registeredTemplates);

// ============================================================================
// Default Export for backward compatibility
// ============================================================================

export default useBuildStore;
