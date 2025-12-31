import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  EmptyState,
  MonthYearPicker,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface DateValue {
  month: number;
  year: number;
}

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

interface SectionSettings {
  showGPA?: boolean;
  showLocation?: boolean;
  showPeriod?: boolean;
}

interface EducationSectionProps {
  data?: EducationItem[];
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
 * Education Section for Basic template
 */
const EducationSection: React.FC<EducationSectionProps> = ({
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
    showGPA: true,
    showLocation: true,
    showPeriod: true,
    ...settings,
  };

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData("education", updatedData);
  };

  const handleAddItem = () => {
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
    updateSectionData("education", [...data, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Education Entry",
      message: "Are you sure you want to delete this education entry?",
      onConfirm: () => {
        updateSectionData(
          "education",
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
    updateSectionData("education", updatedData);
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
        <SectionHeader title="Education" />
        <EmptyState
          title="No education added"
          description="Click to add your educational background"
          onAdd={handleAddItem}
          icon={GraduationCap}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Education" />

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative group"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
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

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <EditableText
                  value={item.institution || ""}
                  onChange={(val) =>
                    handleFieldChange(item.id, "institution", val)
                  }
                  placeholder="Institution Name"
                  className="font-semibold text-gray-900"
                  as="h3"
                />
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
                {sectionSettings.showGPA && item.gpa && (
                  <div className="text-sm text-gray-600">GPA: {item.gpa}</div>
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
