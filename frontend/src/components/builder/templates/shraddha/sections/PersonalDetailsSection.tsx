import React from "react";
import { User } from "lucide-react";
import { EditableText, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface PersonalDetailsData {
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  languages?: string;
  passport?: string;
  [key: string]: string | undefined;
}

interface PersonalDetailsSectionProps {
  data?: PersonalDetailsData;
  sectionId?: string;
}

interface FieldConfig {
  key: keyof PersonalDetailsData;
  label: string;
}

/**
 * Personal Details Section for Shraddha template
 * Shows personal information like DOB, nationality, etc.
 */
const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  data = {},
  sectionId = "personalDetails",
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);

  const handleChange = (field: string, value: string) => {
    updateSectionData(sectionId, { ...data, [field]: value });
  };

  const fields: FieldConfig[] = [
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "nationality", label: "Nationality" },
    { key: "gender", label: "Gender" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "languages", label: "Languages" },
    { key: "passport", label: "Passport No." },
  ];

  const hasData = Object.values(data).some((v) => v);

  if (!hasData) {
    return (
      <div className="mb-4">
        <SectionHeader title="Personal Details" />
        <EmptyState
          title="No personal details added"
          description="Click to add personal information"
          onAdd={() => handleChange("dateOfBirth", "")}
          icon={User}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Personal Details" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 min-w-[100px]">{field.label}:</span>
            <EditableText
              value={data[field.key] || ""}
              onChange={(val) => handleChange(field.key as string, val)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="text-gray-700"
              as="span"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
