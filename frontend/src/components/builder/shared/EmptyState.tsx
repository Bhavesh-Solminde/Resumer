import React from "react";
import { Plus, LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAdd?: () => void;
  icon?: LucideIcon;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items yet",
  description = "Click to add your first item",
  onAdd,
  icon: Icon,
  className = "",
}) => {
  return (
    <div
      onClick={onAdd}
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-lg p-6",
        "flex flex-col items-center justify-center text-center",
        "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        {Icon ? (
          <Icon className="w-5 h-5 text-gray-400" />
        ) : (
          <Plus className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-700 mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
