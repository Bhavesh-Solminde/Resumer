/**
 * Styling Slice
 * Handles theme settings (colors, fonts, spacing, etc.)
 * This slice is tracked by temporal middleware for undo/redo
 */

import type { StateCreator } from "zustand";
import type {
  IStyle as IStyle,
  FontSize,
  BackgroundPattern,
} from "@resumer/shared-types";
import type { BuildState, BuildActions } from "../Build.store";

// ============================================================================
// State Interface
// ============================================================================

export interface StylingState {
  style: IStyle;
}

// ============================================================================
// Actions Interface
// ============================================================================

export interface StylingActions {
  updateStyle: (styleUpdates: Partial<IStyle>) => void;
  resetStyle: () => void;
}

// ============================================================================
// Default Theme
// ============================================================================

export const defaultStyle: IStyle = {
  primaryColor: "#1e3a5f",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  fontSize: "medium" as FontSize,
  pageMargins: 2,
  sectionSpacing: 2,
  lineHeight: 1.5,
  background: "plain" as BackgroundPattern,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createStylingSlice: StateCreator<
  BuildState & BuildActions,
  [],
  [],
  StylingActions
> = (set, get) => ({
  // Initial state removed to prevent overriding Build.store.ts defaults
  // style: { ...defaultStyle },

  // Update theme settings
  updateStyle: (styleUpdates) => {
    const { style } = get();

    set({
      style: { ...style, ...styleUpdates },
    });
  },

  // Reset theme to defaults
  resetStyle: () => {
    set({
      style: { ...defaultStyle },
    });
  },
});
