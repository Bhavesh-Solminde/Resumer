import React, { useState } from "react";
import { Award } from "lucide-react";
import { EditableText, ItemToolbar, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface AchievementItem {
  id: string;
  title?: string;
  description?: string;
}

interface AchievementsSectionProps {
  data?: AchievementItem[];
  sectionId?: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Achievements Section for Shraddha template
 */
const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  data = [],
  sectionId,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    if (!sectionId) return;
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleAddItem = () => {
    if (!sectionId) return;
    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: "",
      description: "",
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!sectionId) return;
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Achievement",
      message: "Are you sure you want to delete this achievement?",
      onConfirm: () => {
        updateSectionData(sectionId, {
          items: data.filter((item) => item.id !== itemId),
        });
        setConfirmDialog?.({ isOpen: false });
      },
      onCancel: () => setConfirmDialog?.({ isOpen: false }),
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Achievements" />
        <EmptyState
          title="No achievements added"
          description="Click to add achievements"
          onAdd={handleAddItem}
          icon={Award}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Achievements" />

      <ul className="space-y-1">
        {data.map((item) => (
          <li
            key={item.id}
            className="relative group flex items-start gap-2"
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

            <span className="text-blue-600">•</span>
            <div className="flex-1">
              <EditableText
                value={item.title || ""}
                onChange={(val) => handleFieldChange(item.id, "title", val)}
                placeholder="Achievement"
                className="font-medium text-gray-800"
                as="span"
              />
              {item.description && (
                <>
                  <span className="text-gray-500"> - </span>
                  <EditableText
                    value={item.description}
                    onChange={(val) =>
                      handleFieldChange(item.id, "description", val)
                    }
                    placeholder="Description"
                    className="text-sm text-gray-600"
                    as="span"
                  />
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        + Add Achievement
      </button>
    </div>
  );
};

export default AchievementsSection;
