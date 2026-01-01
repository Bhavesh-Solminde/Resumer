import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

/**
 * Section Header for Basic template
 * Teal text with clean styling
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wide text-teal-700 mb-2",
        className
      )}
    >
      {title}
    </h2>
  );
};

export default SectionHeader;
