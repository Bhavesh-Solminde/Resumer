import React from "react";
import type { TemplateId } from "@resumer/shared-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useBuildStore } from "../../../store/Build.store";
import { cn } from "../../../lib/utils";
import { Check } from "lucide-react";

interface Template {
  id: TemplateId;
  name: string;
}

interface TemplatePreviewProps {
  templateId: TemplateId;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId }) => {
  const baseClasses = "w-full h-full p-4 flex flex-col gap-3";

  switch (templateId) {
    case "basic":
      return (
        <div className={baseClasses}>
          <div className="space-y-0.5">
            <div className="h-3 w-28 bg-slate-800 rounded" />
            <div className="h-1 w-24 bg-slate-400 rounded" />
            <div className="h-1 w-32 bg-slate-300 rounded" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-20 bg-teal-600 rounded" />
                <div className="h-0.5 flex-1 bg-teal-600/30" />
              </div>
              <div className="h-1 w-full bg-slate-200 rounded" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-16 bg-teal-600 rounded" />
                <div className="h-0.5 flex-1 bg-teal-600/30" />
              </div>
              <div className="space-y-0.5">
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-slate-400 rounded-full" />
                  <div className="h-1 w-full bg-slate-200 rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-slate-400 rounded-full" />
                  <div className="h-1 w-3/4 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-14 bg-teal-600 rounded" />
                <div className="h-0.5 flex-1 bg-teal-600/30" />
              </div>
              <div className="h-1 w-full bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      );

    case "modern":
      return (
        <div className={baseClasses}>
          <div className="text-center space-y-1">
            <div className="h-3 w-24 bg-slate-800 rounded mx-auto" />
            <div className="h-2 w-16 bg-blue-500 rounded mx-auto" />
            <div className="h-1.5 w-32 bg-slate-300 rounded mx-auto" />
          </div>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <div className="h-2 w-16 bg-blue-500 rounded" />
              <div className="h-1 w-full bg-slate-200 rounded" />
              <div className="h-1 w-3/4 bg-slate-200 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-20 bg-blue-500 rounded" />
              <div className="h-1 w-full bg-slate-200 rounded" />
              <div className="h-1 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      );

    case "shraddha":
      return (
        <div className={baseClasses}>
          <div className="text-center space-y-1">
            <div className="h-4 w-28 bg-blue-600 rounded mx-auto" />
            <div className="h-1.5 w-32 bg-slate-300 rounded mx-auto" />
            <div className="h-1 w-24 bg-blue-400 rounded mx-auto" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="space-y-1">
              <div className="relative">
                <div className="h-4 w-full bg-yellow-300/50 absolute top-1/2 -translate-y-1/2" />
                <div className="h-3 w-16 bg-blue-600 rounded relative z-10" />
              </div>
              <div className="h-1 w-full bg-slate-200 rounded" />
            </div>
            <div className="space-y-1">
              <div className="relative">
                <div className="h-4 w-full bg-yellow-300/50 absolute top-1/2 -translate-y-1/2" />
                <div className="h-3 w-14 bg-blue-600 rounded relative z-10" />
              </div>
              <div className="space-y-0.5">
                <div className="flex gap-1">
                  <div className="h-0.5 w-0.5 bg-slate-400 rounded-full mt-0.5" />
                  <div className="h-1 w-full bg-slate-200 rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="h-0.5 w-0.5 bg-slate-400 rounded-full mt-0.5" />
                  <div className="h-1 w-3/4 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={baseClasses}>
          <div className="h-4 w-24 bg-slate-300 rounded" />
          <div className="h-2 w-16 bg-slate-200 rounded" />
        </div>
      );
  }
};

const TemplatesModal: React.FC = () => {
  const {
    activePanel,
    setActivePanel,
    registeredTemplates,
    template,
    changeTemplate,
  } = useBuildStore();

  const isOpen = activePanel === "templates";

  const handleSelectTemplate = (templateId: TemplateId) => {
    changeTemplate(templateId);
  };

  const templateList = Object.values(
    (registeredTemplates || {}) as Record<TemplateId, Template>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => setActivePanel(null)}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Select a template
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Choose a template that best fits your style
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {templateList.map((tmpl) => {
              const isSelected = template === tmpl.id;

              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={cn(
                    "group relative rounded-xl overflow-hidden border-2 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isSelected
                      ? "border-primary shadow-lg"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  )}
                >
                  <div className="aspect-[3/4] bg-white relative">
                    <TemplatePreview templateId={tmpl.id} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "py-3 text-center font-medium transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {tmpl.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-border">
          <Button
            onClick={() => setActivePanel(null)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue Editing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesModal;
