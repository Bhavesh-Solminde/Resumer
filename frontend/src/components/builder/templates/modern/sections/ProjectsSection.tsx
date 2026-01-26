import React, { useState } from "react";
import { FolderKanban, ExternalLink } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  BulletEditor,
  EmptyState,
  MonthYearPicker,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";
import { formatDate, DateValue } from "../../../../../lib/dateUtils";

interface ProjectItem {
  id: string;
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
  bullets?: string[];
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
}

interface ProjectsSectionSettings {
  showTechnologies?: boolean;
  showLink?: boolean;
  showBullets?: boolean;
  showPeriod?: boolean;
}

interface ProjectsSectionProps {
  data?: ProjectItem[];
  sectionId?: string;
  settings?: ProjectsSectionSettings;
  hideHeader?: boolean;
  displayItemIndices?: number[];
}

interface ConfirmDialogState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Projects Section for Modern template
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data = [],
  sectionId = "projects",
  settings = {},
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  const sectionSettings: Required<ProjectsSectionSettings> = {
    showTechnologies: true,
    showLink: true,
    showBullets: true,
    showPeriod: true,
    ...settings,
  };

  const itemsToRender = displayItemIndices
    ? data.filter((_, idx) => displayItemIndices.includes(idx))
    : data;

  const handleFieldChange = (
    itemId: string,
    field: string,
    value: string | string[],
  ) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item,
    );
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      link: "",
      bullets: [""],
      startDate: null,
      endDate: null,
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog?.({
      title: "Delete Project",
      message: "Are you sure you want to delete this project?",
      onConfirm: () => {
        updateSectionData(sectionId, {
          items: data.filter((item) => item.id !== itemId),
        });
        setConfirmDialog?.(null);
      },
      onCancel: () => setConfirmDialog?.(null),
    });
  };

  const handleDateChange = (
    itemId: string,
    dates: { from: DateValue | null; to: DateValue | "Present" | null },
  ) => {
    const updatedData = data.map((item) =>
      item.id === itemId
        ? { ...item, startDate: dates.from, endDate: dates.to }
        : item,
    );
    updateSectionData(sectionId, { items: updatedData });
    setCalendarOpen(null);
  };

  const handleTechChange = (itemId: string, techString: string) => {
    const technologies = techString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    handleFieldChange(itemId, "technologies", technologies);
  };

  const handleBulletsChange = (itemId: string, bullets: string[]) => {
    handleFieldChange(itemId, "bullets", bullets);
  };

  // Skip empty check if we are rendering specific indices (pagination case)
  // Otherwise show empty state if no data
  if ((!data || data.length === 0) && !displayItemIndices) {
    return (
      <div className="mb-4">
        <SectionHeader title="Projects" />
        <EmptyState
          title="No projects added"
          description="Click to add projects"
          onAdd={handleAddItem}
          icon={FolderKanban}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader title="Projects" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {itemsToRender.map((item) => (
          <div
            key={item.id}
            data-pagination-item
            className="relative group p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition-colors"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="top"
                onAddEntry={handleAddItem}
                onOpenCalendar={() => setCalendarOpen(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            )}

            {calendarOpen === item.id && (
              <div className="absolute left-0 top-full z-50 mt-1">
                <MonthYearPicker
                  value={{
                    from:
                      typeof item.startDate === "object"
                        ? item.startDate
                        : null,
                    to:
                      typeof item.endDate === "object" ||
                      item.endDate === "Present"
                        ? (item.endDate as DateValue | "Present")
                        : null,
                  }}
                  onChange={(dates) => handleDateChange(item.id, dates)}
                  onClose={() => setCalendarOpen(null)}
                />
              </div>
            )}

            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <EditableText
                  value={item.name || ""}
                  onChange={(val) => handleFieldChange(item.id, "name", val)}
                  placeholder="Project Name"
                  className="font-semibold text-gray-900"
                  as="h3"
                />
                {sectionSettings.showLink && item.link && (
                  <a
                    href={
                      item.link.startsWith("http")
                        ? item.link
                        : `https://${item.link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              {sectionSettings.showPeriod && (
                <div className="text-sm text-gray-500 whitespace-nowrap ml-2">
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </div>
              )}
            </div>

            <EditableText
              value={item.description || ""}
              onChange={(val) => handleFieldChange(item.id, "description", val)}
              placeholder="Description"
              className="text-sm text-gray-600"
              as="p"
            />

            {sectionSettings.showTechnologies &&
              (item.technologies || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

            {sectionSettings.showBullets &&
              item.bullets &&
              item.bullets.length > 0 && (
                <BulletEditor
                  bullets={item.bullets}
                  onChange={(bullets) => handleBulletsChange(item.id, bullets)}
                  className="mt-2"
                  placeholder="Describe your contribution..."
                />
              )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
      >
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsSection;
