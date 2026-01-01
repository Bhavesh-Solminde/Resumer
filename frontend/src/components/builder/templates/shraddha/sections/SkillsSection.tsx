import React from "react";
import { Code, Plus, X } from "lucide-react";
import { EditableText, EmptyState } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface SkillCategory {
  name: string;
  items?: string[];
}

interface SkillsData {
  categories?: SkillCategory[];
}

interface SkillsSectionProps {
  data?: SkillsData;
  sectionId?: string;
}

/**
 * Skills Section for Shraddha template
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({
  data = {},
  sectionId = "skills",
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
        <SectionHeader title="Skills" />
        <EmptyState
          title="No skills added"
          description="Click to add skills"
          onAdd={handleAddCategory}
          icon={Code}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <SectionHeader title="Skills" />

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="relative group">
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1 min-w-[120px]">
                <EditableText
                  value={category.name}
                  onChange={(val) => handleCategoryNameChange(index, val)}
                  placeholder="Category"
                  className="text-sm font-medium text-gray-700"
                  as="span"
                />
                <span className="text-gray-500">:</span>
                <button
                  onClick={() => handleRemoveCategory(index)}
                  className="p-0.5 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(category.items || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-sm bg-gray-100 text-gray-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <EditableText
              value={(category.items || []).join(", ")}
              onChange={(val) => handleSkillsChange(index, val)}
              placeholder="Add skills (comma separated)"
              className="text-xs text-gray-500 italic mt-1 block"
              as="span"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAddCategory}
        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Category
      </button>
    </div>
  );
};

export default SkillsSection;
