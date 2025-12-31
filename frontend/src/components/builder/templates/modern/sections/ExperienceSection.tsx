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

interface DateValue {
  month: number;
  year: number;
}

interface ExperienceItem {
  id: string;
  company?: string;
  position?: string;
  title?: string;
  location?: string;
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
  bullets?: string[];
}

interface SectionSettings {
  showCompany?: boolean;
  showLocation?: boolean;
  showPeriod?: boolean;
  showBullets?: boolean;
}

interface ExperienceSectionProps {
  data?: ExperienceItem[];
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
 * Experience Section for Modern template
 */
const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data = [],
  settings = {},
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  const sectionSettings: Required<SectionSettings> = {
    showCompany: true,
    showLocation: true,
    showPeriod: true,
    showBullets: true,
    ...settings,
  };

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData("experience", updatedData);
  };

  const handleBulletsChange = (itemId: string, bullets: string[]) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, bullets } : item
    );
    updateSectionData("experience", updatedData);
  };

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: null,
      endDate: null,
      bullets: [""],
    };
    updateSectionData("experience", [...data, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Experience Entry",
      message: "Are you sure you want to delete this entry?",
      onConfirm: () => {
        updateSectionData(
          "experience",
          data.filter((item) => item.id !== itemId)
        );
        setConfirmDialog?.({ isOpen: false });
      },
      onCancel: () => setConfirmDialog?.({ isOpen: false }),
    });
  };

  const handleDateChange = (
    itemId: string,
    dates: { from: DateValue | null; to: DateValue | "Present" | null }
  ) => {
    const updatedData = data.map((item) =>
      item.id === itemId
        ? { ...item, startDate: dates.from, endDate: dates.to }
        : item
    );
    updateSectionData("experience", updatedData);
    setCalendarOpen(null);
  };

  const formatDate = (date: DateValue | string | null | undefined): string => {
    if (!date) return "";
    if (date === "Present") return "Present";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (
      typeof date === "object" &&
      date.month !== undefined &&
      date.year !== undefined
    ) {
      return `${months[date.month]} ${date.year}`;
    }

    if (typeof date === "string") {
      if (months.some((m) => date.startsWith(m))) return date;
      const parts = date.split("/");
      if (parts.length === 2) {
        const monthNum = parseInt(parts[0], 10) - 1;
        if (monthNum >= 0 && monthNum < 12)
          return `${months[monthNum]} ${parts[1]}`;
      }
      return date;
    }

    return "";
  };

  if (!data || data.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Experience" />
        <EmptyState
          title="No experience added"
          description="Click to add work experience"
          onAdd={handleAddItem}
          icon={Briefcase}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Experience" />

      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative group pl-4 border-l-2 border-gray-200 hover:border-indigo-400 transition-colors"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
                className="-left-16"
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
                  allowPresent
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <EditableText
                    value={item.position || item.title || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "position", val)
                    }
                    placeholder="Job Title"
                    className="font-semibold text-gray-900"
                    as="h3"
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {sectionSettings.showCompany && (
                      <EditableText
                        value={item.company || ""}
                        onChange={(val) =>
                          handleFieldChange(item.id, "company", val)
                        }
                        placeholder="Company"
                        className="text-indigo-600"
                        as="span"
                      />
                    )}
                    {sectionSettings.showLocation && item.location && (
                      <>
                        <span className="text-gray-400">|</span>
                        <EditableText
                          value={item.location}
                          onChange={(val) =>
                            handleFieldChange(item.id, "location", val)
                          }
                          placeholder="Location"
                          as="span"
                        />
                      </>
                    )}
                  </div>
                </div>
                {sectionSettings.showPeriod && (
                  <div className="text-sm text-gray-500">
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </div>
                )}
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
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
