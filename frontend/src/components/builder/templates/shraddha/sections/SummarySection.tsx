import React from "react";
import { FileText } from "lucide-react";
import { EditableText, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

type SectionType = "summary" | "objective";

interface SummarySectionProps {
  data?: string;
  sectionId?: string;
  sectionType?: SectionType;
}

/**
 * Summary/Objective Section for Shraddha template
 */
const SummarySection: React.FC<SummarySectionProps> = ({
  data = "",
  sectionId = "summary",
  sectionType = "summary",
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);

  const title = sectionType === "objective" ? "Objective" : "Summary";

  const handleChange = (value: string) => {
    updateSectionData(sectionId, { content: value });
  };

  if (!data) {
    return (
      <div className="mb-4">
        <SectionHeader title={title} />
        <EmptyState
          title={`No ${title.toLowerCase()} added`}
          description={`Click to add your ${title.toLowerCase()}`}
          onAdd={() => handleChange(" ")}
          icon={FileText}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title={title} />
      <EditableText
        value={data}
        onChange={handleChange}
        placeholder={`Write your ${title.toLowerCase()}...`}
        className="text-sm text-gray-700 leading-relaxed"
        multiline
        as="p"
      />
    </div>
  );
};

export default SummarySection;
