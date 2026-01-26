import React from "react";
import { Plus, Type, Calendar, Trash2, Settings } from "lucide-react";
import { cn } from "../../../lib/utils";

type ToolbarPosition = "top" | "right" | "left";

interface ItemToolbarProps {
  onAddEntry?: () => void;
  onToggleText?: () => void;
  onOpenCalendar?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
  showAddEntry?: boolean;
  showToggleText?: boolean;
  showCalendar?: boolean;
  showDelete?: boolean;
  showSettings?: boolean;
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
  onSettings,
  showAddEntry = true,
  showToggleText = false,
  showCalendar = true,
  showDelete = true,
  showSettings = false,
  className = "",
  position = "top",
}) => {
  return (
    <div className={cn("absolute z-40", positionClasses[position], className)}>
      <div className="flex gap-0.5 bg-white border border-gray-200 rounded-lg shadow-md p-1">
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

        {/* Delete */}
        {showDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemToolbar;
