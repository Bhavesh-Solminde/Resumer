import React, { useState } from "react";
import { Users } from "lucide-react";
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

const parseDateString = (
  value: string | null | undefined,
): DateValue | null => {
  if (!value) return null;
  if (value === "Present") return null;

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

  const monthNameIndex = months.findIndex((m) => value.startsWith(m));
  if (monthNameIndex >= 0) {
    const yearPart = value.replace(months[monthNameIndex], "").trim();
    const year = Number(yearPart);
    if (!Number.isNaN(year)) {
      return { month: monthNameIndex, year };
    }
  }

  const parts = value.split("/");
  if (parts.length === 2) {
    const monthNum = Number(parts[0]) - 1;
    const year = Number(parts[1]);
    if (!Number.isNaN(monthNum) && !Number.isNaN(year)) {
      return { month: Math.max(0, Math.min(11, monthNum)), year };
    }
  }

  return null;
};

interface VolunteeringItem {
  id: string;
  title?: string;
  organization?: string;
  startDate?: DateValue | string | null;
  endDate?: DateValue | string | null;
  description?: string;
  bullets?: string[];
}

interface VolunteeringSectionSettings {
  showOrganization?: boolean;
  showPeriod?: boolean;
  showDescription?: boolean;
  showBullets?: boolean;
}

interface VolunteeringSectionProps {
  data?: VolunteeringItem[];
  sectionId?: string;
  sectionType?: string;
  settings?: VolunteeringSectionSettings;
  themeColor?: string;
  hideHeader?: boolean;
  displayItemIndices?: number[];
}

/**
 * Volunteering Section for Basic template
 */
const VolunteeringSection: React.FC<VolunteeringSectionProps> = ({
  data = [],
  sectionId = "volunteering",
  sectionType = "volunteering",
  settings = {},
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const removeSectionWithConfirm = useBuildStore((state) => state.removeSectionWithConfirm);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  const sectionSettings: Required<VolunteeringSectionSettings> = {
    showOrganization: true,
    showPeriod: true,
    showDescription: true,
    showBullets: true,
    ...settings,
  };

  // Filter items for pagination if indices are provided
  const itemsToRender = displayItemIndices
    ? data.filter((_, index) => displayItemIndices.includes(index))
    : data;

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
    const newItem: VolunteeringItem = {
      id: `vol-${Date.now()}`,
      title: "",
      organization: "",
      startDate: null,
      endDate: null,
      description: "",
      bullets: [],
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sectionId) return;
    setConfirmDialog?.({
      title: "Delete Volunteering Activity",
      message: "Are you sure you want to delete this activity?",
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

  // Skip empty check if we are in pagination mode (controlled display)
  if (!displayItemIndices && data.length === 0) {
    return (
      <div className="mb-4">
        {!hideHeader && (
          <SectionHeader
            title="Volunteering"
            themeColor={themeColor}
          />
        )}
        <EmptyState
          title="No activities added"
          description="Click to add volunteering activities"
          onAdd={handleAddItem}
          icon={Users}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader
            title="Volunteering"
            themeColor={themeColor}
          />
        </div>
      )}

      <div className="space-y-4">
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
                showCalendar={true}
                className="-left-1"
                onAddEntry={handleAddItem}
                onDelete={() => handleDeleteItem(item.id)}
                onDeleteSection={() => removeSectionWithConfirm(sectionId!, "volunteering")}
                onOpenCalendar={() =>
                  setCalendarOpen(calendarOpen === item.id ? null : item.id)
                }
              />
            )}

            {/* Title and Organization Row */}
            <div className="flex flex-wrap items-baseline gap-x-2">
              <EditableText
                value={item.title || ""}
                onChange={(val) => handleFieldChange(item.id, "title", val)}
                placeholder="Role/Position"
                className={`font-semibold ${themeColor ? "" : "text-gray-800"}`}
                as="span"
              />

              {sectionSettings.showOrganization && (
                <>
                  <span className="text-gray-400">at</span>
                  <EditableText
                    value={item.organization || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "organization", val)
                    }
                    placeholder="Organization"
                    className="text-gray-700"
                    as="span"
                  />
                </>
              )}

              {/* Date Range */}
              {sectionSettings.showPeriod && (
                <span className="text-gray-500 text-sm ml-auto">
                  <button
                    onClick={() =>
                      setCalendarOpen(calendarOpen === item.id ? null : item.id)
                    }
                    className="hover:text-gray-700 hover:underline"
                  >
                    {item.startDate || item.endDate
                      ? `${formatDate(item.startDate)} - ${formatDate(
                          item.endDate,
                        )}`
                      : "Add dates"}
                  </button>
                </span>
              )}
            </div>

            {/* Date Picker */}
            {calendarOpen === item.id && (
              <div className="absolute left-0 z-50 mt-1">
                <MonthYearPicker
                  value={{
                    from:
                      typeof item.startDate === "object"
                        ? item.startDate
                        : parseDateString(item.startDate),
                    to:
                      typeof item.endDate === "object" ||
                      item.endDate === "Present"
                        ? (item.endDate as DateValue | "Present")
                        : parseDateString(item.endDate),
                  }}
                  onChange={(dates) => handleDateChange(item.id, dates)}
                  onClose={() => setCalendarOpen(null)}
                  allowPresent
                />
              </div>
            )}

            {/* Description */}
            {sectionSettings.showDescription && (
              <EditableText
                value={item.description || ""}
                onChange={(val) =>
                  handleFieldChange(item.id, "description", val)
                }
                placeholder="Brief description of your role and responsibilities..."
                className="text-sm text-gray-600 mt-1"
                as="p"
              />
            )}

            {/* Bullet Points */}
            {sectionSettings.showBullets && (
              <BulletEditor
                bullets={item.bullets || []}
                onChange={(bullets) => handleBulletsChange(item.id, bullets)}
                className="mt-1"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-3 text-sm hover:underline text-teal-600"
      >
        + Add Activity
      </button>
    </div>
  );
};

export default VolunteeringSection;
