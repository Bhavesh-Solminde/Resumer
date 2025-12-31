import React, { useState, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Settings } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ConfirmDialogContext {
  show: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  onDelete?: () => void;
  onSettings?: () => void;
  showSettings?: boolean;
  className?: string;
  confirmDialog?: ConfirmDialogContext;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children,
  onDelete,
  onSettings,
  showSettings = false,
  className = "",
  confirmDialog,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = () => {
    if (confirmDialog) {
      confirmDialog.show({
        title: "Delete Section",
        message:
          "Are you sure you want to delete this section? This action cannot be undone.",
        onConfirm: () => {
          onDelete?.();
        },
      });
    } else {
      setShowConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50 z-50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowConfirm(false);
      }}
    >
      {/* Section Toolbar - appears on hover */}
      {isHovered && (
        <div className="absolute -left-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-gray-200 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-gray-500" />
          </button>

          {/* Settings Button */}
          {showSettings && onSettings && (
            <button
              onClick={onSettings}
              className="p-1 rounded hover:bg-gray-200"
              title="Section settings"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded hover:bg-red-100"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Inline Confirm Delete */}
      {showConfirm && (
        <div className="absolute -left-48 top-0 bg-white border border-red-200 rounded-lg shadow-lg p-3 z-50 w-44">
          <p className="text-xs text-gray-700 mb-2">Delete this section?</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default SectionWrapper;
