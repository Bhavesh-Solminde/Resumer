import React, { useState } from "react";
import { Award, Plus } from "lucide-react";
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
 * Achievements Section for Modern template
 */
const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  data = [],
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleFieldChange = (itemId: string, field: string, value: string) => {
    const updatedData = data.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData("achievements", updatedData);
  };

  const handleAddItem = () => {
    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: "",
      description: "",
    };
    updateSectionData("achievements", [...data, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Achievement",
      message: "Are you sure you want to delete this achievement?",
      onConfirm: () => {
        updateSectionData(
          "achievements",
          data.filter((item) => item.id !== itemId)
        );
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

      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative group flex items-start gap-2 pl-4 border-l-2 border-gray-200 hover:border-indigo-400"
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <ItemToolbar
                position="left"
                showCalendar={false}
                className="-left-16"
                onAddEntry={handleAddItem}
                onDelete={() => handleDeleteItem(item.id)}
              />
            )}

            <Award className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <EditableText
                value={item.title || ""}
                onChange={(val) => handleFieldChange(item.id, "title", val)}
                placeholder="Achievement"
                className="font-medium text-gray-800"
                as="span"
              />
              {item.description && (
                <EditableText
                  value={item.description}
                  onChange={(val) =>
                    handleFieldChange(item.id, "description", val)
                  }
                  placeholder="Description"
                  className="text-sm text-gray-600 block"
                  as="span"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Achievement
      </button>
    </div>
  );
};

export default AchievementsSection;
