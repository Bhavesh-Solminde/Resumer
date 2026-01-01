/**
 * Theme Slice
 * Handles theme settings (colors, fonts, spacing, etc.)
 * This slice is tracked by temporal middleware for undo/redo
 */

import type { StateCreator } from "zustand";
import type {
  ITheme,
  FontSize,
  BackgroundPattern,
} from "@resumer/shared-types";
import type { BuildState, BuildActions } from "../Build.store";

// ============================================================================
// State Interface
// ============================================================================

export interface ThemeState {
  theme: ITheme;
}

// ============================================================================
// Actions Interface
// ============================================================================

export interface ThemeActions {
  updateTheme: (themeUpdates: Partial<ITheme>) => void;
  resetTheme: () => void;
}

// ============================================================================
// Default Theme
// ============================================================================

export const defaultTheme: ITheme = {
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

export const createThemeSlice: StateCreator<
  BuildState & BuildActions,
  [],
  [],
  ThemeActions
> = (set, get) => ({
  // Initial state removed to prevent overriding Build.store.ts defaults
  // theme: { ...defaultTheme },

  // Update theme settings
  updateTheme: (themeUpdates) => {
    const { theme } = get();

    set({
      theme: { ...theme, ...themeUpdates },
    });
  },

  // Reset theme to defaults
  resetTheme: () => {
    set({
      theme: { ...defaultTheme },
    });
  },
});
