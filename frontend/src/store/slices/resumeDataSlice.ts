/**
 * Resume Data Slice
 * Handles sections, section order, and section settings
 * This slice is tracked by temporal middleware for undo/redo
 */

import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import type {
  Section,
  SectionType,
  SectionSettingsMap,
} from "@resumer/shared-types";
import type { BuildState, BuildActions } from "../Build.store";

// ============================================================================
// State Interface
// ============================================================================

export interface ResumeDataState {
  sections: Section[];
  sectionOrder: string[];
  sectionSettings: SectionSettingsMap;
}

// ============================================================================
// Actions Interface
// ============================================================================

export interface ResumeDataActions {
  // Section CRUD
  addSection: (sectionType: SectionType) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  updateSectionData: (
    sectionId: string,
    newData: Record<string, unknown>
  ) => void;

  // Section Settings
  updateSectionSettings: <K extends keyof SectionSettingsMap>(
    sectionType: K,
    settings: Partial<SectionSettingsMap[K]>
  ) => void;
  getSectionSettings: <K extends keyof SectionSettingsMap>(
    sectionType: K
  ) => SectionSettingsMap[K];

  // Item management within sections
  addItemToSection: (sectionType: string, newItem: unknown) => void;
  removeItemFromSection: (sectionType: string, itemId: string) => void;

  // Bullet management
  addBulletToItem: (sectionType: string, itemId: string) => void;
  removeBulletFromItem: (
    sectionType: string,
    itemId: string,
    bulletIndex: number
  ) => void;

  // Date updates
  updateItemDate: (
    sectionType: string,
    itemId: string,
    field: string,
    value: string
  ) => void;
}

// ============================================================================
// Default State Factory
// ============================================================================

export const createDefaultSectionSettings = (): SectionSettingsMap => ({
  header: {
    showPhoto: false,
    showSocialIcons: true,
    layout: "left",
  },
  education: {
    showGPA: true,
    showLocation: true,
    showDescription: false,
  },
  experience: {
    showLocation: true,
    showBullets: true,
    showDescription: true,
  },
  projects: {
    showDate: true,
    showLink: true,
    showBullets: true,
    showTechnologies: true,
  },
  skills: {
    showCategories: true,
    showProficiency: false,
  },
});

// ============================================================================
// Slice Creator
// ============================================================================

export const createResumeDataSlice: StateCreator<
  BuildState & BuildActions,
  [],
  [],
  ResumeDataActions
> = (set, get) => ({
  // Initial state removed to prevent overriding Build.store.ts defaults
  // sections: [],
  // sectionOrder: [],
  // sectionSettings: createDefaultSectionSettings(),

  // Add a new section
  addSection: (sectionType) => {
    const { sections, sectionOrder, sectionTemplates } = get();
    const template = sectionTemplates[sectionType];
    if (!template) return;

    const newSection = {
      id: uuidv4(),
      type: template.type,
      data: JSON.parse(JSON.stringify(template.data)),
    } as Section;

    set({
      sections: [...sections, newSection],
      sectionOrder: [...sectionOrder, newSection.id],
    });
  },

  // Remove a section
  removeSection: (sectionId) => {
    const { sections, sectionOrder } = get();
    const section = sections.find((s) => s.id === sectionId);
    if (section?.locked) return;

    set({
      sections: sections.filter((s) => s.id !== sectionId),
      sectionOrder: sectionOrder.filter((id) => id !== sectionId),
    });
  },

  // Reorder sections
  reorderSections: (newOrder) => {
    const { sections } = get();
    const reorderedSections = newOrder
      .map((id) => sections.find((s) => s.id === id))
      .filter(Boolean) as Section[];

    set({
      sections: reorderedSections,
      sectionOrder: newOrder,
    });
  },

  // Update section data
  updateSectionData: (sectionId, newData) => {
    const { sections } = get();

    set({
      sections: sections.map((section) =>
        section.id === sectionId
          ? { ...section, data: { ...section.data, ...newData } }
          : section
      ) as Section[],
    });
  },

  // Update section settings
  updateSectionSettings: (sectionType, settings) => {
    const { sectionSettings } = get();

    set({
      sectionSettings: {
        ...sectionSettings,
        [sectionType]: {
          ...(sectionSettings[sectionType] || {}),
          ...settings,
        },
      },
    });
  },

  // Get section settings
  getSectionSettings: <K extends keyof SectionSettingsMap>(sectionType: K) => {
    const { sectionSettings } = get();
    return (sectionSettings[sectionType] || {}) as SectionSettingsMap[K];
  },

  // Add item to a section
  addItemToSection: (sectionType, newItem) => {
    const { sections } = get();

    set({
      sections: sections.map((section) => {
        if (section.type === sectionType && "items" in section.data) {
          return {
            ...section,
            data: {
              ...section.data,
              items: [...(section.data as { items: unknown[] }).items, newItem],
            },
          };
        }
        return section;
      }) as Section[],
    });
  },

  // Remove item from a section
  removeItemFromSection: (sectionType, itemId) => {
    const { sections } = get();

    set({
      sections: sections.map((section) => {
        if (section.type === sectionType && "items" in section.data) {
          return {
            ...section,
            data: {
              ...section.data,
              items: (section.data as { items: { id: string }[] }).items.filter(
                (item) => item.id !== itemId
              ),
            },
          };
        }
        return section;
      }) as Section[],
    });
  },

  // Add bullet to an item
  addBulletToItem: (sectionType, itemId) => {
    const { sections } = get();

    set({
      sections: sections.map((section) => {
        if (section.type === sectionType && "items" in section.data) {
          return {
            ...section,
            data: {
              ...section.data,
              items: (
                section.data as { items: { id: string; bullets?: string[] }[] }
              ).items.map((item) => {
                if (item.id === itemId) {
                  return {
                    ...item,
                    bullets: [...(item.bullets || []), ""],
                  };
                }
                return item;
              }),
            },
          };
        }
        return section;
      }) as Section[],
    });
  },

  // Remove bullet from an item
  removeBulletFromItem: (sectionType, itemId, bulletIndex) => {
    const { sections } = get();

    set({
      sections: sections.map((section) => {
        if (section.type === sectionType && "items" in section.data) {
          return {
            ...section,
            data: {
              ...section.data,
              items: (
                section.data as { items: { id: string; bullets?: string[] }[] }
              ).items.map((item) => {
                if (item.id === itemId) {
                  const newBullets = [...(item.bullets || [])];
                  newBullets.splice(bulletIndex, 1);
                  return { ...item, bullets: newBullets };
                }
                return item;
              }),
            },
          };
        }
        return section;
      }) as Section[],
    });
  },

  // Update item date
  updateItemDate: (sectionType, itemId, field, value) => {
    const { sections } = get();

    set({
      sections: sections.map((section) => {
        if (section.type === sectionType && "items" in section.data) {
          const sectionData = section.data as { items: Array<{ id: string }> };
          return {
            ...section,
            data: {
              ...section.data,
              items: sectionData.items.map((item) => {
                if (item.id === itemId) {
                  return { ...item, [field]: value };
                }
                return item;
              }),
            },
          };
        }
        return section;
      }) as Section[],
    });
  },
});
