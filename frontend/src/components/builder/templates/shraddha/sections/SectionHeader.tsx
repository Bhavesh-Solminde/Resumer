import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

/**
 * Section Header for Shraddha template
 * Blue text with blue underline (no yellow highlight)
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wide text-blue-600 border-b border-blue-600 pb-1 mb-2",
        className
      )}
    >
      {title}
    </h2>
  );
};

export default SectionHeader;
