import React from "react";
import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/store/Build.store";
import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";

const colorOptions = [
  { id: "blue", value: "#1e3a5f", label: "Navy Blue" },
  { id: "slate", value: "#334155", label: "Slate" },
  { id: "emerald", value: "#047857", label: "Emerald" },
  { id: "orange", value: "#c2410c", label: "Orange" },
  { id: "sky", value: "#0284c7", label: "Sky Blue" },
  { id: "indigo", value: "#4338ca", label: "Indigo" },
  { id: "purple", value: "#7c3aed", label: "Purple" },
  { id: "rose", value: "#be123c", label: "Rose" },
  { id: "teal", value: "#0d9488", label: "Teal" },
  { id: "amber", value: "#d97706", label: "Amber" },
];

const fontOptions = [
  { id: "inter", value: "Inter", label: "Inter" },
  { id: "roboto", value: "Roboto", label: "Roboto" },
  { id: "opensans", value: "Open Sans", label: "Open Sans" },
  { id: "lato", value: "Lato", label: "Lato" },
  { id: "montserrat", value: "Montserrat", label: "Montserrat" },
  { id: "poppins", value: "Poppins", label: "Poppins" },
  { id: "playfair", value: "Playfair Display", label: "Playfair" },
  { id: "merriweather", value: "Merriweather", label: "Merriweather" },
];

const backgroundPatterns = [
  { id: "plain", label: "Plain" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
];

const DesignPanel = () => {
  const { activePanel, setActivePanel, resumeData, updateTheme } =
    useBuildStore();

  const isOpen = activePanel === "design";

  if (!isOpen) return null;

  const { theme } = resumeData;

  return (
    <div className="fixed left-20 top-1/2 -translate-y-1/2 z-30 w-72 max-h-[80vh] bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Design & Font</h3>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setActivePanel(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Margins */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            PAGE MARGINS: {theme.pageMargins}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">narrow</span>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={theme.pageMargins}
              onChange={(e) =>
                updateTheme({ pageMargins: parseInt(e.target.value) })
              }
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs text-muted-foreground">wide</span>
          </div>
        </div>

        {/* Section Spacing */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            SECTION SPACING: {theme.sectionSpacing}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">compact</span>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={theme.sectionSpacing}
              onChange={(e) =>
                updateTheme({ sectionSpacing: parseInt(e.target.value) })
              }
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs text-muted-foreground">spacious</span>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">COLORS</label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => updateTheme({ primaryColor: color.value })}
                className={cn(
                  "w-10 h-10 rounded-full transition-all duration-200",
                  "ring-offset-2 ring-offset-background",
                  "hover:scale-110 focus:outline-none",
                  theme.primaryColor === color.value &&
                    "ring-2 ring-primary scale-110"
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {theme.primaryColor === color.value && (
                  <Check className="h-4 w-4 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            FONT STYLE
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {fontOptions.map((font) => (
              <option key={font.id} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            FONT SIZE: {theme.fontSize.toUpperCase()}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">A</span>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={Math.max(
                0,
                ["small", "medium", "large"].indexOf(theme.fontSize) !== -1
                  ? ["small", "medium", "large"].indexOf(theme.fontSize)
                  : 1
              )}
              onChange={(e) =>
                updateTheme({
                  fontSize:
                    ["small", "medium", "large"][parseInt(e.target.value)] ||
                    "medium",
                })
              }
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-base text-muted-foreground">A</span>
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            LINE HEIGHT: {theme.lineHeight}
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">condensed</span>
            <input
              type="range"
              min="1.2"
              max="2"
              step="0.1"
              value={theme.lineHeight}
              onChange={(e) =>
                updateTheme({ lineHeight: parseFloat(e.target.value) })
              }
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs text-muted-foreground">spacious</span>
          </div>
        </div>

        {/* Background Patterns */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            BACKGROUNDS
          </label>
          <div className="grid grid-cols-4 gap-2">
            {backgroundPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => updateTheme({ background: pattern.id })}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all duration-200",
                  "focus:outline-none",
                  theme.background === pattern.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted hover:border-primary/50"
                )}
                title={pattern.label}
              >
                <BackgroundPreview type={pattern.id} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Background pattern previews
const BackgroundPreview = ({ type }) => {
  switch (type) {
    case "dots":
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-muted-foreground/30 rounded-full"
              />
            ))}
          </div>
        </div>
      );
    case "lines":
      return (
        <div className="w-full h-full flex flex-col justify-center gap-1 px-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-px bg-muted-foreground/20" />
          ))}
        </div>
      );
    case "grid":
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-muted-foreground/10" />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default DesignPanel;
