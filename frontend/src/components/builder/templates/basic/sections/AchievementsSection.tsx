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
 * Achievements Section for Basic template
 */
const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  data = [],
  sectionId = "achievements",
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Filter items for pagination if indices are provided
  const itemsToRender = displayItemIndices
    ? data.filter((_, index) => displayItemIndices.includes(index))
    : data;

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item,
    );
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleAddItem = () => {
    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: "",
      description: "",
    };
    updateSectionData(sectionId, { items: [...data, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
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

  // Skip empty check if we are in pagination mode (controlled display)
  if (!displayItemIndices && (!data || data.length === 0)) {
    return (
      <div className="mb-4">
        {!hideHeader && (
          <SectionHeader title="Achievements" themeColor={themeColor} />
        )}
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
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader title="Achievements" themeColor={themeColor} />
        </div>
      )}

      <ul className="space-y-1 list-disc ml-4">
        {itemsToRender.map((item) => (
          <li
            key={item.id}
            className="relative group"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            data-pagination-item
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

            <EditableText
              value={item.title || ""}
              onChange={(val) => handleFieldChange(item.id, "title", val)}
              placeholder="Achievement"
              className="text-gray-800"
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
          </li>
        ))}
      </ul>

      <button
        onClick={handleAddItem}
        className="mt-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
      >
        + Add Achievement
      </button>
    </div>
  );
};

export default AchievementsSection;
