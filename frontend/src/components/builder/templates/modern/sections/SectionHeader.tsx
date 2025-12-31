import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

/**
 * Section Header for Modern template
 * Indigo text with modern styling
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2",
        className
      )}
    >
      <span className="w-8 h-0.5 bg-indigo-600"></span>
      {title}
    </h2>
  );
};

export default SectionHeader;
