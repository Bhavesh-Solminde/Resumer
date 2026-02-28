import React, { useState, useRef, useCallback } from "react";
import { FolderKanban, ExternalLink, Github } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  BulletEditor,
  EmptyState,
  MonthYearPicker,
  SectionSettings,
  PROJECT_SETTINGS,
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
  githubLink?: string;
  liveLink?: string;
  bullets?: string[];
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
}

interface ProjectsSectionSettings {
  showTechnologies?: boolean;
  showLink?: boolean;
  showPeriod?: boolean;
  showBullets?: boolean;
}

interface ProjectsSectionProps {
  data?: ProjectItem[];
  sectionId?: string;
  settings?: ProjectsSectionSettings;
  themeColor?: string;
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
 * Projects Section for Shraddha template
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data = [],
  sectionId = "projects",
  settings = {},
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const updateSectionSettings = useBuildStore(
    (state) => state.updateSectionSettings,
  );
  const removeSectionWithConfirm = useBuildStore(
    (state) => state.removeSectionWithConfirm,
  );
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{ itemId: string; type: "github" | "live" } | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((itemId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredItemId(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredItemId(null), 150);
  }, []);

  const sectionSettings: Required<ProjectsSectionSettings> = {
    showTechnologies: true,
    showLink: true,
    showPeriod: true,
    showBullets: true,
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
      githubLink: "",
      liveLink: "",
      bullets: [""],
      startDate: null,
      endDate: null,
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    if (!sectionId) return;
    updateSectionSettings(sectionId, { [key]: value } as any);
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
    if (!sectionId) return;
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

  if ((!data || data.length === 0) && !displayItemIndices) {
    return (
      <div className="mb-4">
        <SectionHeader title="Projects" themeColor={themeColor} />
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
          <SectionHeader title="Projects" themeColor={themeColor} />
        </div>
      )}

      <div className="space-y-3">
        {itemsToRender.map((item) => (
          <div
            key={item.id}
            data-pagination-item
            className="relative group"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
                onAddEntry={handleAddItem}
                onOpenCalendar={() => setCalendarOpen(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                onDeleteSection={() =>
                  removeSectionWithConfirm(sectionId!, "projects")
                }
                onSettings={() => setSettingsOpen(item.id)}
                onGithubLink={() => setEditingLink({ itemId: item.id, type: "github" })}
                onLiveLink={() => setEditingLink({ itemId: item.id, type: "live" })}
                showSettings={true}
                showGithubLink={true}
                showLiveLink={true}
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

            {settingsOpen === item.id && (
              <div className="absolute left-8 top-8 z-50">
                <SectionSettings
                  isOpen={true}
                  title="Project Settings"
                  settings={PROJECT_SETTINGS}
                  onChange={handleSettingsChange}
                  onClose={() => setSettingsOpen(null)}
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <EditableText
                    value={item.name || ""}
                    onChange={(val) => handleFieldChange(item.id, "name", val)}
                    placeholder="Project Name"
                    className="font-semibold text-gray-900"
                    as="h3"
                  />
                  {sectionSettings.showLink && (
                    <div className="flex items-center gap-2">
                      {/* GitHub Link */}
                      {(item.githubLink || editingLink?.itemId === item.id && editingLink?.type === "github") && (
                        editingLink?.itemId === item.id && editingLink?.type === "github" ? (
                          <input
                            autoFocus
                            type="text"
                            value={item.githubLink || ""}
                            onChange={(e) => handleFieldChange(item.id, "githubLink", e.target.value)}
                            onBlur={() => setEditingLink(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingLink(null)}
                            placeholder="GitHub URL"
                            className="text-xs border border-blue-300 rounded px-1.5 py-0.5 w-40 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        ) : (
                          <a
                            href={item.githubLink!.startsWith("http") ? item.githubLink! : `https://${item.githubLink!}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => { e.preventDefault(); setEditingLink({ itemId: item.id, type: "github" }); }}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            <Github className="w-3 h-3" />
                            <span>GitHub</span>
                          </a>
                        )
                      )}
                      {/* Live Link */}
                      {(item.liveLink || editingLink?.itemId === item.id && editingLink?.type === "live") && (
                        editingLink?.itemId === item.id && editingLink?.type === "live" ? (
                          <input
                            autoFocus
                            type="text"
                            value={item.liveLink || ""}
                            onChange={(e) => handleFieldChange(item.id, "liveLink", e.target.value)}
                            onBlur={() => setEditingLink(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingLink(null)}
                            placeholder="Live URL"
                            className="text-xs border border-blue-300 rounded px-1.5 py-0.5 w-40 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        ) : (
                          <a
                            href={item.liveLink!.startsWith("http") ? item.liveLink! : `https://${item.liveLink!}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => { e.preventDefault(); setEditingLink({ itemId: item.id, type: "live" }); }}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live</span>
                          </a>
                        )
                      )}
                    </div>
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
                onChange={(val) =>
                  handleFieldChange(item.id, "description", val)
                }
                placeholder="Project description"
                className="text-sm text-gray-600"
                as="p"
              />

              {sectionSettings.showTechnologies &&
                (item.technologies || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

              {sectionSettings.showBullets && (
                <BulletEditor
                  bullets={item.bullets}
                  onChange={(bullets) => handleBulletsChange(item.id, bullets)}
                  className="mt-2"
                  placeholder="Describe your contribution..."
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsSection;
