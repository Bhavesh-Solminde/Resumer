import React from "react";
import { X, Settings } from "lucide-react";
import { cn } from "../../../lib/utils";

interface Setting {
  key: string;
  label: string;
  value: boolean;
  description?: string;
}

interface SectionSettingsProps {
  isOpen: boolean;
  title?: string;
  settings?: Setting[];
  onChange: (key: string, value: boolean) => void;
  onClose: () => void;
  className?: string;
}

const SectionSettings: React.FC<SectionSettingsProps> = ({
  isOpen,
  title = "Section Settings",
  settings = [],
  onChange,
  onClose,
  className = "",
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: string, currentValue: boolean) => {
    onChange(key, !currentValue);
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Settings list */}
      <div className="p-3 space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-start justify-between gap-3"
          >
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                {setting.label}
              </label>
              {setting.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {setting.description}
                </p>
              )}
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => handleToggle(setting.key, setting.value)}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                setting.value ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  setting.value ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500">
          Toggle options to show or hide fields in this section
        </p>
      </div>
    </div>
  );
};

export default SectionSettings;

/**
 * Predefined settings configurations for common sections
 */
export const EDUCATION_SETTINGS: Setting[] = [
  {
    key: "showGPA",
    label: "GPA / Grade",
    value: true,
    description: "Show GPA or grade field",
  },
  {
    key: "showInstitution",
    label: "Institution",
    value: true,
    description: "Show school/university name",
  },
  {
    key: "showLocation",
    label: "Location",
    value: true,
    description: "Show city, country",
  },
  {
    key: "showPeriod",
    label: "Date Period",
    value: true,
    description: "Show start and end dates",
  },
  {
    key: "showBullets",
    label: "Bullet Points",
    value: false,
    description: "Show additional details as bullets",
  },
];

export const EXPERIENCE_SETTINGS: Setting[] = [
  {
    key: "showCompany",
    label: "Company",
    value: true,
    description: "Show company/organization name",
  },
  {
    key: "showLocation",
    label: "Location",
    value: true,
    description: "Show city, country",
  },
  {
    key: "showPeriod",
    label: "Date Period",
    value: true,
    description: "Show start and end dates",
  },
  {
    key: "showBullets",
    label: "Bullet Points",
    value: true,
    description: "Show responsibilities as bullets",
  },
  {
    key: "showLogo",
    label: "Company Logo",
    value: false,
    description: "Show company logo if available",
  },
];

export const PROJECT_SETTINGS: Setting[] = [
  {
    key: "showTechnologies",
    label: "Technologies",
    value: true,
    description: "Show tech stack used",
  },
  {
    key: "showLink",
    label: "Project Link",
    value: true,
    description: "Show URL/link to project",
  },
  {
    key: "showPeriod",
    label: "Date Period",
    value: false,
    description: "Show project dates",
  },
  {
    key: "showBullets",
    label: "Bullet Points",
    value: true,
    description: "Show project details as bullets",
  },
];

export const SKILLS_SETTINGS: Setting[] = [
  {
    key: "showProficiency",
    label: "Proficiency Level",
    value: false,
    description: "Show skill level bars",
  },
  {
    key: "showCategories",
    label: "Categories",
    value: true,
    description: "Group skills by category",
  },
];
