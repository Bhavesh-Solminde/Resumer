import React, { useState } from "react";
import { FolderKanban, ExternalLink } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  BulletEditor,
  EmptyState,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface ProjectItem {
  id: string;
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
  bullets?: string[];
}

interface SectionSettings {
  showTechnologies?: boolean;
  showLink?: boolean;
  showBullets?: boolean;
}

interface ProjectsSectionProps {
  data?: ProjectItem[];
  sectionId?: string;
  settings?: SectionSettings;
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
  settings = {},
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const sectionSettings: Required<SectionSettings> = {
    showTechnologies: true,
    showLink: true,
    showBullets: true,
    ...settings,
  };

  const handleFieldChange = (
    itemId: string,
    field: string,
    value: string | string[]
  ) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData("projects", updatedData);
  };

  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      link: "",
      bullets: [""],
    };
    updateSectionData("projects", [...data, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Project",
      message: "Are you sure you want to delete this project?",
      onConfirm: () => {
        updateSectionData(
          "projects",
          data.filter((item) => item.id !== itemId)
        );
        setConfirmDialog?.({ isOpen: false });
      },
      onCancel: () => setConfirmDialog?.({ isOpen: false }),
    });
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

  if (!data || data.length === 0) {
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
      <SectionHeader title="Projects" />

      <div className="grid grid-cols-1 gap-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative group p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition-colors"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="top"
                showCalendar={false}
                onAddEntry={handleAddItem}
                onDelete={() => handleDeleteItem(item.id)}
              />
            )}

            <div className="flex items-center gap-2 mb-1">
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
