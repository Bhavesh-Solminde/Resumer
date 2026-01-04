import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  themeColor?: string;
}

/**
 * Section Header for Modern template
 * Indigo text with modern styling
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
  themeColor,
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2",
        !themeColor && "text-indigo-600",
        className
      )}
      style={themeColor ? { color: themeColor } : undefined}
    >
      <span
        className={cn("w-8 h-0.5", !themeColor && "bg-indigo-600")}
        style={themeColor ? { backgroundColor: themeColor } : undefined}
      ></span>
      {title}
    </h2>
  );
};

export default SectionHeader;
