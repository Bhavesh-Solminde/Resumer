import React from "react";
import type { SectionType } from "@resumer/shared-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useBuildStore } from "../../../store/Build.store";
import { cn } from "../../../lib/utils";
import {
  Award,
  Globe,
  Heart,
  Trophy,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
  Link,
  Zap,
  Plus,
  Briefcase,
  Code,
  Target,
  Medal,
  User,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Award,
  Globe,
  Heart,
  Trophy,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
  Link,
  Zap,
  Plus,
  Briefcase,
  Code,
  Target,
  Medal,
  User,
};

interface SectionPreviewProps {
  type: string;
}

const SectionPreview: React.FC<SectionPreviewProps> = ({ type }) => {
  switch (type) {
    case "certifications":
      return (
        <div className="flex flex-col gap-1 w-full px-3">
          <div className="h-2 w-3/4 bg-primary/20 rounded" />
          <div className="h-1.5 w-1/2 bg-muted-foreground/20 rounded" />
        </div>
      );
    case "languages":
      return (
        <div className="flex gap-2 px-3">
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-12 bg-primary/20 rounded" />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-3 w-1.5 rounded-sm",
                    i < 4 ? "bg-primary/40" : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case "skills":
    case "strengths":
      return (
        <div className="flex flex-wrap gap-1 px-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 px-2 bg-primary/10 rounded-full border border-primary/20"
            />
          ))}
        </div>
      );
    case "achievements":
      return (
        <div className="flex flex-col gap-1 w-full px-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
            <div className="h-1.5 w-full bg-muted-foreground/20 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
            <div className="h-1.5 w-3/4 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex flex-col gap-1.5 w-full px-3">
          <div className="h-2 w-full bg-primary/20 rounded" />
          <div className="h-1.5 w-3/4 bg-muted-foreground/20 rounded" />
          <div className="h-1.5 w-1/2 bg-muted-foreground/20 rounded" />
        </div>
      );
  }
};

const AddSectionModal: React.FC = () => {
  const { activePanel, setActivePanel, sectionTemplates, addSection } =
    useBuildStore();

  const isOpen = activePanel === "addSection";

  const handleAddSection = (sectionType: SectionType) => {
    addSection(sectionType);
    setActivePanel(null);
  };

  const sectionCards = (
    Object.entries(sectionTemplates) as [
      SectionType,
      { label: string; icon: string; type: SectionType }
    ][]
  ).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={() => setActivePanel(null)}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Add a new section
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Click on a section to add it to your resume
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {sectionCards.map((section) => {
              const Icon = iconMap[section.icon] || Plus;

              return (
                <button
                  key={section.key}
                  onClick={() => handleAddSection(section.key)}
                  className={cn(
                    "group relative p-6 rounded-xl border-2 border-border bg-card",
                    "hover:border-primary hover:shadow-lg transition-all duration-200",
                    "flex flex-col items-center gap-3 text-center",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-muted group-hover:bg-primary/10 transition-colors"
                    )}
                  >
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-foreground">
                    {section.label}
                  </span>

                  <div className="w-full h-16 rounded-md bg-muted/50 flex items-center justify-center overflow-hidden">
                    <SectionPreview type={section.type} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionModal;
