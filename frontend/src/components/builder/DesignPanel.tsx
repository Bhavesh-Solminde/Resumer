import React from "react";
import { Button } from "../ui/button";
import { useBuildStore, useResumeData } from "../../store/Build.store";
import { cn } from "../../lib/utils";
import { X, Check } from "lucide-react";
import type { BackgroundPattern as BackgroundPatternType } from "@resumer/shared-types";

interface ColorOption {
  id: string;
  value: string;
  label: string;
}

interface FontOption {
  id: string;
  value: string;
  label: string;
}

interface BackgroundPatternOption {
  id: BackgroundPatternType;
  label: string;
}

const colorOptions: ColorOption[] = [
  { id: "blue600", value: "#2563eb", label: "Blue" },
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

const fontOptions: FontOption[] = [
  { id: "inter", value: "Inter", label: "Inter" },
  { id: "roboto", value: "Roboto", label: "Roboto" },
  { id: "opensans", value: "Open Sans", label: "Open Sans" },
  { id: "lato", value: "Lato", label: "Lato" },
  { id: "montserrat", value: "Montserrat", label: "Montserrat" },
  { id: "poppins", value: "Poppins", label: "Poppins" },
  { id: "playfair", value: "Playfair Display", label: "Playfair" },
  { id: "merriweather", value: "Merriweather", label: "Merriweather" },
];

const backgroundPatterns: BackgroundPatternOption[] = [
  { id: "plain", label: "Plain" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
];

interface BackgroundPreviewProps {
  type: string;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({ type }) => {
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

const DesignPanel: React.FC = () => {
  const { activePanel, setActivePanel, updateStyle } = useBuildStore();
  const { style } = useResumeData();

  const isOpen = activePanel === "design";

  if (!isOpen) return null;

  // Guard against undefined style during initial render
  if (!style) return null;

  return (
    <div className="fixed left-20 top-1/2 -translate-y-1/2 z-30 w-72 max-h-[80vh] bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Design & Font</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActivePanel(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Margins */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>PAGE MARGINS (mm)</span>
            <span className="text-xs text-muted-foreground">
              {typeof style.pageMargins === "number" && style.pageMargins >= 10
                ? style.pageMargins
                : 20}
              mm
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={
                typeof style.pageMargins === "number" && style.pageMargins >= 10
                  ? style.pageMargins
                  : 20
              }
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    pageMargins: Math.max(10, Math.min(50, val)),
                  });
                }
              }}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input
              type="number"
              min="10"
              max="50"
              value={
                typeof style.pageMargins === "number" && style.pageMargins >= 10
                  ? style.pageMargins
                  : 20
              }
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    pageMargins: Math.max(10, Math.min(50, val)),
                  });
                }
              }}
              className="w-14 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Section Spacing */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>SECTION SPACING (px)</span>
            <span className="text-xs text-muted-foreground">
              {typeof style.sectionSpacing === "number" &&
              style.sectionSpacing >= 0
                ? style.sectionSpacing
                : 16}
              px
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={
                typeof style.sectionSpacing === "number" &&
                style.sectionSpacing >= 0
                  ? style.sectionSpacing
                  : 16
              }
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    sectionSpacing: Math.max(0, Math.min(50, val)),
                  });
                }
              }}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input
              type="number"
              min="0"
              max="50"
              value={
                typeof style.sectionSpacing === "number" &&
                style.sectionSpacing >= 0
                  ? style.sectionSpacing
                  : 16
              }
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    sectionSpacing: Math.max(0, Math.min(50, val)),
                  });
                }
              }}
              className="w-14 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">COLORS</label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => updateStyle({ primaryColor: color.value })}
                className={cn(
                  "w-10 h-10 rounded-full transition-all duration-200",
                  "ring-offset-2 ring-offset-background",
                  "hover:scale-110 focus:outline-none",
                  style.primaryColor === color.value &&
                    "ring-2 ring-primary scale-110",
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {style.primaryColor === color.value && (
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
            value={style.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
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
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>FONT SIZE (pt)</span>
            <span className="text-xs text-muted-foreground">
              {typeof style.fontSize === "number"
                ? style.fontSize
                : style.fontSize === "large"
                  ? 12
                  : style.fontSize === "small"
                    ? 9
                    : 11}
              pt
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="8"
              max="24"
              step="0.5"
              value={
                typeof style.fontSize === "number"
                  ? style.fontSize
                  : style.fontSize === "large"
                    ? 12
                    : style.fontSize === "small"
                      ? 9
                      : 11
              }
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    fontSize: Math.max(8, Math.min(24, val)),
                  });
                }
              }}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input
              type="number"
              min="8"
              max="24"
              step="0.5"
              value={
                typeof style.fontSize === "number"
                  ? style.fontSize
                  : style.fontSize === "large"
                    ? 12
                    : style.fontSize === "small"
                      ? 9
                      : 11
              }
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    fontSize: Math.max(8, Math.min(24, val)),
                  });
                }
              }}
              className="w-14 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>LINE HEIGHT</span>
            <span className="text-xs text-muted-foreground">
              {style.lineHeight}
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={style.lineHeight}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    lineHeight: Math.max(1.0, Math.min(2.5, val)),
                  });
                }
              }}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input
              type="number"
              min="1.0"
              max="2.5"
              step="0.1"
              value={style.lineHeight}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  updateStyle({
                    lineHeight: Math.max(1.0, Math.min(2.5, val)),
                  });
                }
              }}
              className="w-14 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
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
                onClick={() => updateStyle({ background: pattern.id })}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all duration-200",
                  "focus:outline-none",
                  style.background === pattern.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted hover:border-primary/50",
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

export default DesignPanel;
