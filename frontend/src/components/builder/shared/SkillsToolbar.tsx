import React from "react";
import { Plus, GripVertical, Trash2, Settings } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SkillsToolbarProps {
  onAddSkill: () => void;
  onAddGroup: () => void;
  onDelete?: () => void;
  onDeleteSection?: () => void;
  onSettings?: () => void;
  showDelete?: boolean;
  showSettings?: boolean;
  className?: string;
}

/**
 * Specialized toolbar for Skills section with "+ Skill" and "+ Group" buttons
 * Appears on hover of the skills section
 */
const SkillsToolbar: React.FC<SkillsToolbarProps> = ({
  onAddSkill,
  onAddGroup,
  onDelete,
  onDeleteSection,
  onSettings,
  showDelete = true,
  showSettings = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 bottom-full pb-1 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-md p-1">
        {/* Add Skill Button - Green */}
        <button
          onClick={onAddSkill}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
          title="Add new skill"
        >
          <Plus className="w-3 h-3" />
          Skill
        </button>

        {/* Add Group Button - Purple */}
        <button
          onClick={onAddGroup}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-purple-500 hover:bg-purple-600 rounded transition-colors"
          title="Add new group"
        >
          <Plus className="w-3 h-3" />
          Group
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Move Handle */}
        <button
          className="p-1.5 rounded hover:bg-gray-100 cursor-grab"
          title="Move section"
        >
          <GripVertical className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* Delete */}
        {showDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-50"
            title="Delete focused skill"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        )}

        {/* Delete Section */}
        {onDeleteSection && (
          <>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={onDeleteSection}
              className="p-1.5 rounded hover:bg-red-50 group border border-transparent hover:border-red-100"
              title="Delete Entire Section"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-700 fill-red-50" />
            </button>
          </>
        )}

        {/* Settings */}
        {showSettings && (
          <button
            onClick={onSettings}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsToolbar;
