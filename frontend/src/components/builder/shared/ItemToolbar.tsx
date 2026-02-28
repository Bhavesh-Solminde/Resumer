import React from "react";
import { Plus, Type, Calendar, Trash2, Settings, Github, ExternalLink } from "lucide-react";
import { cn } from "../../../lib/utils";

type ToolbarPosition = "top" | "right" | "left";

interface ItemToolbarProps {
  onAddEntry?: () => void;
  onToggleText?: () => void;
  onOpenCalendar?: () => void;
  onDelete?: () => void;
  onDeleteSection?: () => void;
  onSettings?: () => void;
  onGithubLink?: () => void;
  onLiveLink?: () => void;
  showAddEntry?: boolean;
  showToggleText?: boolean;
  showCalendar?: boolean;
  showDelete?: boolean;
  showDeleteSection?: boolean;
  showSettings?: boolean;
  showGithubLink?: boolean;
  showLiveLink?: boolean;
  className?: string;
  position?: ToolbarPosition;
}

const positionClasses: Record<ToolbarPosition, string> = {
  top: "left-1/2 -translate-x-1/2 bottom-full flex-row pb-1",
  right: "right-0 top-1/2 -translate-y-1/2 translate-x-full flex-col pl-2",
  left: "left-0 top-1/2 -translate-y-1/2 -translate-x-full flex-col pr-2",
};

const ItemToolbar: React.FC<ItemToolbarProps> = ({
  onAddEntry,
  onToggleText,
  onOpenCalendar,
  onDelete,
  onDeleteSection,
  onSettings,
  onGithubLink,
  onLiveLink,
  showAddEntry = true,
  showToggleText = false,
  showCalendar = true,
  showDelete = true,
  showDeleteSection = true,
  showSettings = false,
  showGithubLink = false,
  showLiveLink = false,
  className = "",
  position = "top",
}) => {
  return (
    <div className={cn("absolute z-40", positionClasses[position], className)}>
      <div className={cn("flex gap-0.5 bg-white border border-gray-200 rounded-lg shadow-md p-1", (position === "right" || position === "left") && "flex-col")}>
        {/* Add Entry */}
        {showAddEntry && (
          <button
            onClick={onAddEntry}
            className="p-1.5 rounded hover:bg-blue-50"
            title="Add new entry"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
          </button>
        )}

        {/* Toggle Text / Bullet */}
        {showToggleText && (
          <button
            onClick={onToggleText}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Toggle text format"
          >
            <Type className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* Calendar / Date Picker */}
        {showCalendar && (
          <button
            onClick={onOpenCalendar}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Edit dates"
          >
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* GitHub Link */}
        {showGithubLink && (
          <button
            onClick={onGithubLink}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Edit GitHub link"
          >
            <Github className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* Live Link */}
        {showLiveLink && (
          <button
            onClick={onLiveLink}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Edit live link"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* Settings */}
        {showSettings && (
          <button
            onClick={onSettings}
            className="p-1.5 rounded hover:bg-gray-100"
            title="Item settings"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* Delete Item */}
        {showDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-50"
            title="Delete Item"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        )}

        {/* Delete Section */}
        {onDeleteSection && showDeleteSection && (
          <>
             <div className={cn("bg-gray-200 block", (position === "right" || position === "left") ? "h-px w-full my-1" : "min-h-[16px] w-px self-center mx-1")} />
            <button
              onClick={onDeleteSection}
              className="p-1.5 rounded hover:bg-red-50 group border border-transparent hover:border-red-100"
              title="Delete Entire Section"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-700 fill-red-50" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemToolbar;
