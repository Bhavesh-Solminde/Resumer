import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useBuildStore } from "../../store/Build.store";
import { cn } from "../../lib/utils";
import { getSectionComponent, DEFAULT_TEMPLATE } from "./templates";
import { ConfirmDialog } from "./shared";

// Fallback imports for legacy section types
import { GenericSection } from "./sections/SectionComponents";

interface Section {
  id: string;
  type: string;
  data: unknown;
}

interface Theme {
  pageMargins?: number;
  sectionSpacing?: number;
  fontSize?: string;
  fontFamily?: string;
  lineHeight?: number;
  primaryColor?: string;
  background?: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const marginMap: Record<number, string> = {
  1: "px-6",
  2: "px-10",
  3: "px-14",
  4: "px-20",
};

const spacingMap: Record<number, string> = {
  1: "space-y-2",
  2: "space-y-4",
  3: "space-y-6",
  4: "space-y-8",
};

const fontSizeMap: Record<string, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

const ResumeEditor: React.FC = () => {
  const { confirmDialog, setConfirmDialog } = useBuildStore();

  const {
    sections,
    theme,
    template = DEFAULT_TEMPLATE,
    sectionSettings = {},
  } = useBuildStore(
    useShallow((state) => ({
      sections: state.sections,
      theme: state.theme,
      template: state.template,
      sectionSettings: state.sectionSettings,
    }))
  );

  // Normalize data format for template sections
  const normalizeData = (sectionType: string, rawData: unknown): unknown => {
    if (!rawData) return rawData;

    // Handle header section (has direct fields like fullName, email, etc.)
    if (sectionType === "header") {
      return rawData;
    }

    const data = rawData as Record<string, unknown>;

    // Handle skills section (expects object with categories or flat array)
    if (sectionType === "skills") {
      if (data.categories !== undefined) {
        return rawData;
      }
      if (data.items !== undefined && Array.isArray(data.items)) {
        // Transform flat items to a default category for templates that expect categories
        return {
          categories: [
            {
              name: "General",
              items: data.items,
            },
          ],
        };
      }
      return rawData;
    }

    // Handle sections with content string (summary, objective)
    if (data.content !== undefined) {
      return data.content;
    }

    // Handle sections with items array (experience, education, projects, etc.)
    if (data.items !== undefined) {
      return data.items;
    }

    return rawData;
  };

  const renderSection = (section: Section) => {
    const SectionComponent = getSectionComponent(template, section.type);

    if (SectionComponent) {
      const rawData = section.data;
      const sectionData = normalizeData(section.type, rawData);
      const settings = sectionSettings[section.type] || {};

      return (
        <SectionComponent
          key={section.id}
          data={sectionData}
          sectionId={section.id}
          sectionType={section.type}
          settings={settings}
          themeColor={theme?.primaryColor}
        />
      );
    }

    // Fallback for legacy/unknown section types
    return (
      <GenericSection
        key={section.id}
        section={section}
        themeColor={theme?.primaryColor}
      />
    );
  };

  return (
    <div className="flex-1 bg-muted/50 dark:bg-muted/20 min-h-screen pt-20 pb-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* A4 Page Container */}
        <div
          className={cn(
            "relative bg-white dark:bg-card shadow-2xl rounded-sm mx-auto",
            "min-h-[297mm] w-full max-w-[210mm]",
            marginMap[theme?.pageMargins ?? 2] || "px-10",
            "py-8",
            fontSizeMap[theme?.fontSize ?? "medium"] || "text-base"
          )}
          style={{
            fontFamily: theme?.fontFamily || "Inter",
            lineHeight: theme?.lineHeight || 1.5,
          }}
        >
          {/* Background Pattern */}
          {theme?.background !== "plain" && theme?.background && (
            <div
              className={cn(
                "absolute inset-0 pointer-events-none opacity-5",
                theme.background === "dots" &&
                  "bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:20px_20px]",
                theme.background === "lines" &&
                  "bg-[linear-gradient(to_bottom,_#000_1px,_transparent_1px)] bg-[length:100%_20px]",
                theme.background === "grid" &&
                  "bg-[linear-gradient(#000_1px,_transparent_1px),_linear-gradient(90deg,_#000_1px,_transparent_1px)] bg-[length:20px_20px]"
              )}
            />
          )}

          {/* Sections */}
          <div
            className={cn(
              spacingMap[theme?.sectionSpacing ?? 2] || "space-y-4",
              "relative"
            )}
          >
            {sections?.map(renderSection)}
          </div>
        </div>

        {/* Page indicator */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Page 1 of 1
        </div>
      </div>

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={(confirmDialog as ConfirmDialogState)?.isOpen ?? false}
        title={(confirmDialog as ConfirmDialogState)?.title}
        message={(confirmDialog as ConfirmDialogState)?.message}
        onConfirm={() => {
          (confirmDialog as ConfirmDialogState)?.onConfirm?.();
          setConfirmDialog({ isOpen: false });
        }}
        onCancel={() => {
          (confirmDialog as ConfirmDialogState)?.onCancel?.();
          setConfirmDialog({ isOpen: false });
        }}
      />
    </div>
  );
};

export default ResumeEditor;
