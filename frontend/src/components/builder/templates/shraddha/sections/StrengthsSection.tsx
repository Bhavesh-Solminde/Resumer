import React, { useState } from "react";
import { Star, Plus } from "lucide-react";
import { EditableText, ItemToolbar, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface StrengthsSectionProps {
  data?: string[];
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
 * Strengths Section for Shraddha template
 * Lists key strengths/soft skills
 */
const StrengthsSection: React.FC<StrengthsSectionProps> = ({
  data = [],
  sectionId = "strengths",
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const setConfirmDialog = useBuildStore((state) => state.setConfirmDialog) as
    | ((dialog: ConfirmDialogState) => void)
    | undefined;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleChange = (index: number, value: string) => {
    const updatedData = [...data];
    updatedData[index] = value;
    updateSectionData(sectionId, { items: updatedData });
  };

  const handleAdd = () => {
    updateSectionData(sectionId, { items: [...data, ""] });
  };

  const handleRemove = (index: number) => {
    setConfirmDialog?.({
      isOpen: true,
      title: "Delete Strength",
      message: "Are you sure you want to delete this strength?",
      onConfirm: () => {
        updateSectionData(sectionId, {
          items: data.filter((_, i) => i !== index),
        });
        setConfirmDialog?.({ isOpen: false });
      },
      onCancel: () => setConfirmDialog?.({ isOpen: false }),
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Strengths" />
        <EmptyState
          title="No strengths added"
          description="Click to add your key strengths"
          onAdd={handleAdd}
          icon={Star}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Strengths" />

      <div className="flex flex-wrap gap-2">
        {data.map((strength, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <EditableText
                value={strength}
                onChange={(val) => handleChange(index, val)}
                placeholder="Strength"
                className="text-sm"
                as="span"
              />
              {hoveredIndex === index && (
                <button
                  onClick={() => handleRemove(index)}
                  className="ml-1 text-blue-500 hover:text-red-500"
                >
                  x
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add More Button */}
      <button
        onClick={handleAdd}
        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Strength
      </button>
    </div>
  );
};

export default StrengthsSection;
