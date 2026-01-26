import React, { useState } from "react";
import { BadgeCheck } from "lucide-react";
import {
  EditableText,
  ItemToolbar,
  EmptyState,
  MonthYearPicker,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";
import { formatDate, DateValue } from "../../../../../lib/dateUtils";
import type { ICertificationItem } from "@resumer/shared-types";

type CertificationItem = Omit<ICertificationItem, "date" | "expiryDate"> & {
  date?: DateValue | string | null;
  expiryDate?: DateValue | string | null;
};

interface CertificationsSectionSettings {
  showIssuer?: boolean;
  showDate?: boolean;
  showExpiryDate?: boolean;
  showCredentialId?: boolean;
}

interface CertificationsSectionProps {
  data?: CertificationItem[];
  sectionId?: string;
  sectionType?: string;
  settings?: CertificationsSectionSettings;
  themeColor?: string;
}

/**
 * Certifications Section for Basic template
 */
const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  data = [],
  sectionId = "certifications",
  sectionType = "certifications",
  settings = {},
  themeColor,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  const sectionSettings: Required<CertificationsSectionSettings> = {
    showIssuer: true,
    showDate: true,
    showExpiryDate: true,
    showCredentialId: true,
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
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: null,
      expiryDate: null,
      credentialId: "",
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sectionId) return;
    setConfirmDialog?.({
      title: "Delete Certification",
      message: "Are you sure you want to delete this certification?",
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
    field: "date" | "expiryDate",
    dates: { from: DateValue | null; to: DateValue | "Present" | null },
  ) => {
    if (!sectionId) return;
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: dates.from } : item,
    );
    updateSectionData(sectionId, { items: updatedData });
    setCalendarOpen(null);
  };

  if (data.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Certifications" themeColor={themeColor} />
        <EmptyState
          title="No certifications added"
          description="Click to add your certifications"
          onAdd={handleAddItem}
          icon={BadgeCheck}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Certifications" themeColor={themeColor} />

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative group border-l-2 border-gray-200 pl-3 py-1"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
                showCalendar={false}
                className="-left-14"
                onAddEntry={handleAddItem}
                onDelete={() => handleDeleteItem(item.id)}
              />
            )}

            {/* Certification Name */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <EditableText
                value={item.name || ""}
                onChange={(val) => handleFieldChange(item.id, "name", val)}
                placeholder="Certification Name"
                className={`font-semibold ${themeColor ? "" : "text-gray-800"}`}
                as="span"
              />

              {/* Issuer */}
              {sectionSettings.showIssuer && (
                <>
                  <span className="text-gray-400">|</span>
                  <EditableText
                    value={item.issuer || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "issuer", val)
                    }
                    placeholder="Issuing Organization"
                    className="text-gray-600"
                    as="span"
                  />
                </>
              )}
            </div>

            {/* Dates Row */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
              {/* Issue Date */}
              {sectionSettings.showDate && (
                <div className="relative flex items-center gap-1">
                  <span className="text-gray-400">Issued:</span>
                  <button
                    onClick={() =>
                      setCalendarOpen(
                        calendarOpen === `${item.id}-date`
                          ? null
                          : `${item.id}-date`,
                      )
                    }
                    className="hover:text-gray-700 hover:underline"
                  >
                    {item.date ? formatDate(item.date) : "Add date"}
                  </button>
                  {calendarOpen === `${item.id}-date` && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <MonthYearPicker
                        value={{
                          from:
                            typeof item.date === "object" ? item.date : null,
                          to: null,
                        }}
                        onChange={(dates) =>
                          handleDateChange(item.id, "date", dates)
                        }
                        onClose={() => setCalendarOpen(null)}
                        allowPresent={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Expiry Date */}
              {sectionSettings.showExpiryDate && (
                <div className="relative flex items-center gap-1">
                  <span className="text-gray-400">Expires:</span>
                  <button
                    onClick={() =>
                      setCalendarOpen(
                        calendarOpen === `${item.id}-expiry`
                          ? null
                          : `${item.id}-expiry`,
                      )
                    }
                    className="hover:text-gray-700 hover:underline"
                  >
                    {item.expiryDate
                      ? formatDate(item.expiryDate)
                      : "No expiry"}
                  </button>
                  {calendarOpen === `${item.id}-expiry` && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <MonthYearPicker
                        value={{
                          from:
                            typeof item.expiryDate === "object"
                              ? item.expiryDate
                              : null,
                          to: null,
                        }}
                        onChange={(dates) =>
                          handleDateChange(item.id, "expiryDate", dates)
                        }
                        onClose={() => setCalendarOpen(null)}
                        allowPresent={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Credential ID */}
              {sectionSettings.showCredentialId && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">ID:</span>
                  <EditableText
                    value={item.credentialId || ""}
                    onChange={(val) =>
                      handleFieldChange(item.id, "credentialId", val)
                    }
                    placeholder="Credential ID"
                    className="text-gray-600"
                    as="span"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-3 text-sm hover:underline text-teal-600"
      >
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsSection;
