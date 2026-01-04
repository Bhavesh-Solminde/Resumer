import React from "react";
import { Code, Plus, X } from "lucide-react";
import { EditableText, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsData {
  categories?: SkillCategory[];
}

interface SkillsSectionProps {
  data?: SkillsData;
  sectionId?: string;
  themeColor?: string;
}

/**
 * Skills Section for Basic template
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({
  data = {},
  sectionId = "skills",
  themeColor,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);

  const categories = data.categories || [];

  const handleCategoryNameChange = (index: number, name: string) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], name };
    updateSectionData(sectionId, { ...data, categories: newCategories });
  };

  const handleSkillsChange = (index: number, skillsString: string) => {
    const items = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], items };
    updateSectionData(sectionId, { ...data, categories: newCategories });
  };

  const handleAddCategory = () => {
    const newCategories = [...categories, { name: "New Category", items: [] }];
    updateSectionData(sectionId, { ...data, categories: newCategories });
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    updateSectionData(sectionId, { ...data, categories: newCategories });
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="mb-4">
        <SectionHeader title="Skills" themeColor={themeColor} />
        <EmptyState
          title="No skills added"
          description="Click to add your skills"
          onAdd={handleAddCategory}
          icon={Code}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Skills" themeColor={themeColor} />

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="relative group flex items-start gap-2">
            <EditableText
              value={category.name}
              onChange={(val) => handleCategoryNameChange(index, val)}
              placeholder="Category"
              className="text-sm font-medium text-teal-700 min-w-[100px]"
              as="span"
            />
            <span className="text-gray-400">:</span>
            <div className="flex-1 flex flex-wrap gap-1">
              {(category.items || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-sm bg-gray-100 text-gray-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleRemoveCategory(index)}
              className="p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddCategory}
        className="mt-2 flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 hover:underline"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Category
      </button>
    </div>
  );
};

export default SkillsSection;
