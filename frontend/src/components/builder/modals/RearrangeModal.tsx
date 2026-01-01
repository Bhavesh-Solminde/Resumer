import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useBuildStore } from "../../../store/Build.store";
import { cn } from "../../../lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Lock } from "lucide-react";

interface Section {
  id: string;
  type: string;
  locked?: boolean;
}

interface SortableItemProps {
  section: Section;
}

const getSectionLabel = (type: string): string => {
  const labels: Record<string, string> = {
    header: "Header",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    volunteering: "Volunteering",
    awards: "Awards",
    interests: "Interests",
    references: "References",
    publications: "Publications",
    courses: "Training / Courses",
    socialLinks: "Find Me Online",
    strengths: "Strengths",
    custom: "Custom Section",
  };
  return labels[type] || type;
};

const SortableItem: React.FC<SortableItemProps> = ({ section }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: section.locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-4 bg-card border border-border rounded-lg",
        "transition-all duration-200",
        isDragging && "shadow-xl ring-2 ring-primary z-50 opacity-90",
        section.locked && "opacity-60"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted",
          section.locked && "cursor-not-allowed"
        )}
      >
        {section.locked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <span className="font-medium text-foreground">
        {getSectionLabel(section.type)}
      </span>
    </div>
  );
};

const RearrangeModal: React.FC = () => {
  const {
    activePanel,
    setActivePanel,
    sections,
    sectionOrder,
    reorderSections,
  } = useBuildStore();

  const isOpen = activePanel === "rearrange";

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !over.id) return;

    if (active.id !== over.id) {
      const currentSectionOrder = sectionOrder as string[];
      const oldIndex = currentSectionOrder.indexOf(active.id as string);
      const newIndex = currentSectionOrder.indexOf(over.id as string);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(currentSectionOrder, oldIndex, newIndex);
      reorderSections(newOrder);
    }
  };

  const typedSections = (sections || []) as Section[];
  const typedSectionOrder = (sectionOrder || []) as string[];

  // Create a map for quick lookup
  const sectionMap = new Map(typedSections.map((s) => [s.id, s]));

  // Build ordered sections based on typedSectionOrder
  const orderedSections = typedSectionOrder
    .map((id) => sectionMap.get(id))
    .filter((s): s is Section => !!s);

  // Add any sections that might be missing from the order (fallback)
  typedSections.forEach((s) => {
    if (!typedSectionOrder.includes(s.id)) {
      orderedSections.push(s);
    }
  });

  const sectionsPerPage = 6;
  const pages: Section[][] = [];
  for (let i = 0; i < orderedSections.length; i += sectionsPerPage) {
    pages.push(orderedSections.slice(i, i + sectionsPerPage));
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setActivePanel(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Hold & Drag the boxes to rearrange
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Drag sections to reorder them on your resume
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={typedSectionOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {pages.map((pageSections, pageIndex) => (
                  <div key={pageIndex}>
                    <div className="text-sm text-muted-foreground text-center mb-3">
                      Page {pageIndex + 1} of {pages.length}
                    </div>
                    <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/30">
                      <div className="space-y-2">
                        {pageSections.map((section) => (
                          <SortableItem key={section.id} section={section} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-center pt-4 border-t border-border">
          <Button
            onClick={() => setActivePanel(null)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RearrangeModal;
