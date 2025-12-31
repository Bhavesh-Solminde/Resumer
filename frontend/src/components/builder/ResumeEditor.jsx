import React from "react";
import { useBuildStore } from "@/store/Build.store";
import { cn } from "@/lib/utils";
import {
  HeaderSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  GenericSection,
} from "./sections/SectionComponents";

const ResumeEditor = () => {
  const { resumeData } = useBuildStore();
  const { sections, theme } = resumeData;

  // Map theme values to actual CSS
  const marginMap = { 1: "px-6", 2: "px-10", 3: "px-14", 4: "px-20" };
  const spacingMap = {
    1: "space-y-2",
    2: "space-y-4",
    3: "space-y-6",
    4: "space-y-8",
  };
  const fontSizeMap = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const renderSection = (section) => {
    const props = {
      section,
      themeColor: theme.primaryColor,
    };

    switch (section.type) {
      case "header":
        return <HeaderSection key={section.id} {...props} />;
      case "summary":
        return <SummarySection key={section.id} {...props} />;
      case "experience":
        return <ExperienceSection key={section.id} {...props} />;
      case "education":
        return <EducationSection key={section.id} {...props} />;
      case "skills":
        return <SkillsSection key={section.id} {...props} />;
      case "projects":
        return <ProjectsSection key={section.id} {...props} />;
      default:
        return <GenericSection key={section.id} {...props} />;
    }
  };

  return (
    <div className="flex-1 bg-muted/50 dark:bg-muted/20 min-h-screen pt-20 pb-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* A4 Page Container */}
        <div
          className={cn(
            "relative bg-white dark:bg-card shadow-2xl rounded-sm mx-auto",
            "min-h-[297mm] w-full max-w-[210mm]",
            marginMap[theme.pageMargins] || "px-10",
            "py-8",
            fontSizeMap[theme.fontSize] || "text-base"
          )}
          style={{
            fontFamily: theme.fontFamily || "Inter",
            lineHeight: theme.lineHeight || 1.5,
          }}
        >
          {/* Background Pattern */}
          {theme.background !== "plain" && (
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
              spacingMap[theme.sectionSpacing] || "space-y-4",
              "relative"
            )}
          >
            {sections.map(renderSection)}
          </div>
        </div>

        {/* Page indicator */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Page 1 of 1
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
