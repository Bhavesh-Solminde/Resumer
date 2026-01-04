import React from "react";
import { cn } from "../../../../../lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  themeColor?: string;
}

/**
 * Section Header for Shraddha template
 * Colored text with matching underline
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className = "",
  themeColor,
}) => {
  return (
    <h2
      className={cn(
        "text-sm font-bold uppercase tracking-wide pb-1 mb-2",
        !themeColor && "text-blue-600 border-b border-blue-600",
        className
      )}
      style={
        themeColor
          ? { color: themeColor, borderBottom: `1px solid ${themeColor}` }
          : undefined
      }
    >
      {title}
    </h2>
  );
};

export default SectionHeader;
