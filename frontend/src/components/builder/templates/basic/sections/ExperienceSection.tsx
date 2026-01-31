import React, { useState } from "react";
import { Briefcase } from "lucide-react";
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

interface ExperienceItem {
  id: string;
  company?: string;
  position?: string;
  location?: string;
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
  bullets?: string[];
}

interface ExperienceSectionSettings {
  showCompany?: boolean;
  showLocation?: boolean;
  showPeriod?: boolean;
  showBullets?: boolean;
}

interface ExperienceSectionProps {
  data?: ExperienceItem[];
  sectionId?: string;
  settings?: ExperienceSectionSettings;
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
 * Experience Section for Basic template
 */
const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data = [],
  sectionId = "experience",
  settings = {},
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const removeSection = useBuildStore((state) => state.removeSection);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  // Filter items for pagination if indices are provided
  const itemsToRender = displayItemIndices
    ? data.filter((_, index) => displayItemIndices.includes(index))
    : data;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  const sectionSettings: Required<ExperienceSectionSettings> = {
    showCompany: true,
    showLocation: true,
    showPeriod: true,
    showBullets: true,
    ...settings,
  };

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    if (!sectionId) return;
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item,
    );
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleBulletsChange = (itemId: string, bullets: string[]) => {
    if (!sectionId) return;
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, bullets } : item,
    );
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleAddItem = () => {
    if (!sectionId) return;
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: null,
      endDate: null,
      bullets: [""],
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sectionId) return;
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Experience Entry",
      message: "Are you sure you want to delete this entry?",
      onConfirm: () => {
        updateSectionData(sectionId, {
          items: data.filter((item) => item.id !== itemId),
        });
        setConfirmDialog?.({ isOpen: false });
      },
      onCancel: () => setConfirmDialog?.({ isOpen: false }),
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

  // Skip empty check if we are in pagination mode (controlled display)
  if (!displayItemIndices && (!data || data.length === 0)) {
    return (
      <div className="mb-4">
        {!hideHeader && (
          <SectionHeader title="Experience" themeColor={themeColor} />
        )}
        <EmptyState
          title="No experience added"
          description="Click to add your work experience"
          onAdd={handleAddItem}
          icon={Briefcase}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader title="Experience" themeColor={themeColor} />
        </div>
      )}

      <div className="space-y-4">
        {itemsToRender.map((item) => (
          <div
            key={item.id}
            className="group relative"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            data-pagination-item
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
                onAddEntry={handleAddItem}
                onOpenCalendar={() => setCalendarOpen(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                onDeleteSection={() => removeSection(sectionId!)}
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
                  allowPresent
                />
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <EditableText
                  value={item.position || ""}
                  onChange={(val) =>
                    handleFieldChange(item.id, "position", val)
                  }
                  placeholder="Job Title"
                  className="font-semibold text-gray-900"
                  as="h3"
                />
                {sectionSettings.showCompany && (
                  <EditableText
                    value={item.company || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "company", val)
                    }
                    placeholder="Company Name"
                    className="text-sm text-teal-700"
                    as="p"
                  />
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                {sectionSettings.showPeriod && (
                  <div>
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </div>
                )}
                {sectionSettings.showLocation && (
                  <EditableText
                    value={item.location || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "location", val)
                    }
                    placeholder="Location"
                    as="span"
                  />
                )}
              </div>
            </div>

            {sectionSettings.showBullets && (
              <BulletEditor
                bullets={item.bullets}
                onChange={(bullets) => handleBulletsChange(item.id, bullets)}
                className="mt-2"
                placeholder="Describe your achievement..."
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
