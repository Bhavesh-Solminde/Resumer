import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  themeColor?: string;
}

/**
 * Section Header for Basic template
 * Teal text with clean styling
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
  themeColor,
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wide mb-2",
        !themeColor && "text-teal-700",
        className
      )}
      style={themeColor ? { color: themeColor } : undefined}
    >
      {title}
    </h2>
  );
};

export default SectionHeader;
