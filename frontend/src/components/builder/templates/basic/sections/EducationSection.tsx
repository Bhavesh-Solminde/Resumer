import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  EmptyState,
  MonthYearPicker,
  SectionSettings,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";
import { formatDate, DateValue } from "../../../../../lib/dateUtils";

interface EducationItem {
  id: string;
  institution?: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
  gpa?: string;
  bullets?: string[];
}

interface EducationSectionSettings {
  showGPA?: boolean;
  showInstitution?: boolean;
  showLocation?: boolean;
  showPeriod?: boolean;
  showBullets?: boolean;
}

interface EducationSectionProps {
  data?: EducationItem[];
  sectionId?: string;
  sectionType?: string;
  settings?: EducationSectionSettings;
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
 * Education Section for Basic template
 */
const EducationSection: React.FC<EducationSectionProps> = ({
  data = [],
  sectionId = "education",
  sectionType = "education",
  settings = {},
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const removeSectionWithConfirm = useBuildStore((state) => state.removeSectionWithConfirm);
  const updateSectionSettings = useBuildStore(
    (state) => state.updateSectionSettings,
  );
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog);

  // Filter items for pagination if indices are provided
  const itemsToRender = displayItemIndices
    ? data.filter((_, index) => displayItemIndices.includes(index))
    : data;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<string | null>(null);

  const sectionSettings: Required<EducationSectionSettings> = {
    showGPA: true,
    showInstitution: true,
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

  const handleAddItem = () => {
    if (!sectionId) return;
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: null,
      endDate: null,
      gpa: "",
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sectionId) return;
    setConfirmDialog?.({
      title: "Delete Education Entry",
      message: "Are you sure you want to delete this education entry?",
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

  const handleSettingsChange = (key: string, value: boolean) => {
    if (!sectionType) return;
    // Cast key to specific settings key for type safety
    updateSectionSettings("education", { [key]: value } as any);
  };

  if (data.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Education" themeColor={themeColor} />
        <EmptyState
          title="No education added"
          description="Click to add your educational background"
          onAdd={handleAddItem}
          icon={GraduationCap}
        />
      </div>
    );
  }

  const settingsConfig = [
    {
      key: "showGPA",
      label: "Show GPA",
      value: sectionSettings.showGPA,
    },
    {
      key: "showInstitution",
      label: "Show Institution",
      value: sectionSettings.showInstitution,
    },
    {
      key: "showPeriod",
      label: "Show Date",
      value: sectionSettings.showPeriod,
    },
    {
      key: "showBullets",
      label: "Show Bullets",
      value: sectionSettings.showBullets,
    },
  ];

  // Skip empty check if we are in pagination mode (controlled display)
  if (!displayItemIndices && (!data || data.length === 0)) {
    return (
      <div className="mb-4">
        {!hideHeader && (
          <SectionHeader title="Education" themeColor={themeColor} />
        )}
        <EmptyState
          title="No education added"
          description="Click to add your education"
          onAdd={handleAddItem}
          icon={GraduationCap}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader title="Education" themeColor={themeColor} />
        </div>
      )}

      <div className="space-y-3">
        {itemsToRender.map((item) => (
          <div
            key={item.id}
            className="relative group"
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
                onDeleteSection={() => removeSectionWithConfirm(sectionId!, "education")}
                showSettings={true}
                onSettings={() => setSettingsOpen(item.id)}
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
                  title="Education Settings"
                  settings={settingsConfig}
                  onChange={handleSettingsChange}
                  onClose={() => setSettingsOpen(null)}
                />
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                {sectionSettings.showInstitution && (
                  <EditableText
                    value={item.institution || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "institution", val)
                    }
                    placeholder="Institution Name"
                    className="font-semibold text-gray-900"
                    as="h3"
                  />
                )}
                <div className="flex items-baseline gap-1 text-sm text-gray-700">
                  <EditableText
                    value={item.degree || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "degree", val)
                    }
                    placeholder="Degree"
                    as="span"
                  />
                  {item.field && (
                    <>
                      <span>in</span>
                      <EditableText
                        value={item.field}
                        onChange={(val) =>
                          handleFieldChange(item.id, "field", val)
                        }
                        placeholder="Field"
                        as="span"
                      />
                    </>
                  )}
                </div>
                {sectionSettings.showGPA && (
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <span>GPA:</span>
                    <EditableText
                      value={item.gpa || ""}
                      onChange={(val) => handleFieldChange(item.id, "gpa", val)}
                      placeholder="4.0"
                      as="span"
                    />
                  </div>
                )}
              </div>
              {sectionSettings.showPeriod && (
                <div className="text-sm text-gray-500">
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationSection;
