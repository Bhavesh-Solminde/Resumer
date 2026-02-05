import React, { useState } from "react";
import { Code } from "lucide-react";
import {
  EditableText,
  EmptyState,
  SkillsToolbar,
  SkillPill,
} from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";
import SectionHeader from "./SectionHeader";

interface SkillCategory {
  name: string;
  items: string[];
  isVisible: boolean;
}

interface SkillsData {
  categories?: SkillCategory[];
}

interface SkillsSectionProps {
  data?: SkillsData;
  sectionId?: string;
  themeColor?: string;
  hideHeader?: boolean;
  displayItemIndices?: number[];
}

/**
 * Skills Section for Basic template
 * Features:
 * - Hidden "general" group for ungrouped skills
 * - "+ Skill" adds to focused group or general
 * - "+ Group" reveals general group first, then creates new groups
 * - Editable pill-style skills with auto-focus on add
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({
  data = {},
  sectionId = "skills",
  themeColor,
  hideHeader = false,
  displayItemIndices,
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);
  const removeSectionWithConfirm = useBuildStore((state) => state.removeSectionWithConfirm);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedSkill, setFocusedSkill] = useState<{
    groupIndex: number;
    skillIndex: number;
  } | null>(null);
  const [newSkillIndex, setNewSkillIndex] = useState<{
    groupIndex: number;
    skillIndex: number;
  } | null>(null);

  // Initialize with hidden general group if empty
  const categories: SkillCategory[] = data.categories?.length
    ? data.categories.map((cat) => ({
        ...cat,
        isVisible: cat.isVisible ?? true,
      }))
    : [{ name: "general", items: [], isVisible: false }];

  // Pagination logic: Using displayItemIndices as indices for categories
  // Note: logic below uses "categories" variable, so we must filter it before rendering or usage
  // However, local state (categories) includes visibility logic.
  // The 'categories' variable is derived from props.data.
  // If paginating, we slice the derived array.

  const categoriesToRender = displayItemIndices
    ? categories.filter((_, index) => displayItemIndices.includes(index))
    : categories;

  const handleCategoryNameChange = (index: number, name: string) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], name };
    updateSectionData(sectionId, { categories: newCategories });
  };

  const handleSkillChange = (
    groupIndex: number,
    skillIndex: number,
    value: string,
  ) => {
    const newCategories = [...categories];
    const newItems = [...(newCategories[groupIndex].items || [])];
    newItems[skillIndex] = value;
    newCategories[groupIndex] = {
      ...newCategories[groupIndex],
      items: newItems,
    };
    updateSectionData(sectionId, { categories: newCategories });
  };

  const handleAddSkill = () => {
    const newCategories = [...categories];
    // Add to focused group, or first group (general) if none focused
    const targetGroupIndex = focusedSkill?.groupIndex ?? 0;
    const newItems = [...(newCategories[targetGroupIndex].items || []), ""];
    newCategories[targetGroupIndex] = {
      ...newCategories[targetGroupIndex],
      items: newItems,
    };
    updateSectionData(sectionId, { categories: newCategories });
    // Set new skill for auto-focus
    setNewSkillIndex({
      groupIndex: targetGroupIndex,
      skillIndex: newItems.length - 1,
    });
    setFocusedSkill({
      groupIndex: targetGroupIndex,
      skillIndex: newItems.length - 1,
    });
  };

  const handleAddGroup = () => {
    const newCategories = [...categories];
    // Check if first group is hidden (general)
    if (newCategories.length === 1 && !newCategories[0].isVisible) {
      // Make the general group visible
      newCategories[0] = {
        ...newCategories[0],
        name: "Group Title",
        isVisible: true,
      };
    } else {
      // Add new group with one empty skill
      newCategories.push({ name: "New Group", items: [""], isVisible: true });
      // Auto-focus the new empty skill
      setNewSkillIndex({ groupIndex: newCategories.length - 1, skillIndex: 0 });
      setFocusedSkill({ groupIndex: newCategories.length - 1, skillIndex: 0 });
    }
    updateSectionData(sectionId, { categories: newCategories });
  };

  const handleDeleteFocusedSkill = () => {
    if (!focusedSkill) return;
    const { groupIndex, skillIndex } = focusedSkill;
    const newCategories = [...categories];
    const newItems = newCategories[groupIndex].items.filter(
      (_, i) => i !== skillIndex,
    );

    // If group becomes empty and it's not the only group, remove it
    if (newItems.length === 0 && newCategories.length > 1) {
      newCategories.splice(groupIndex, 1);
      // Focus last skill in previous group if exists
      const prevGroupIndex = Math.max(0, groupIndex - 1);
      const prevGroupItems = newCategories[prevGroupIndex]?.items || [];
      if (prevGroupItems.length > 0) {
        setFocusedSkill({
          groupIndex: prevGroupIndex,
          skillIndex: prevGroupItems.length - 1,
        });
        setNewSkillIndex({
          groupIndex: prevGroupIndex,
          skillIndex: prevGroupItems.length - 1,
        });
      } else {
        setFocusedSkill(null);
      }
    } else {
      newCategories[groupIndex] = {
        ...newCategories[groupIndex],
        items: newItems,
      };
      // Focus previous skill in same group
      if (newItems.length > 0) {
        const prevSkillIndex = Math.max(0, skillIndex - 1);
        setFocusedSkill({ groupIndex, skillIndex: prevSkillIndex });
        setNewSkillIndex({ groupIndex, skillIndex: prevSkillIndex });
      } else {
        setFocusedSkill(null);
      }
    }

    updateSectionData(sectionId, { categories: newCategories });
  };

  const handleSkillFocus = (groupIndex: number, skillIndex: number) => {
    setFocusedSkill({ groupIndex, skillIndex });
  };

  const handleSkillBlur = () => {
    // Clear newSkillIndex after blur to prevent re-focus
    setNewSkillIndex(null);
  };

  // Check if we have any skills at all
  const hasAnySkills = categories.some(
    (cat) => cat.items && cat.items.length > 0,
  );

  // Skip empty check if we are in pagination mode (controlled display)
  if (
    !displayItemIndices &&
    !hasAnySkills &&
    categories.every((cat) => !cat.isVisible)
  ) {
    return (
      <div
        className="mb-4 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <SkillsToolbar
            onAddSkill={handleAddSkill}
            onAddGroup={handleAddGroup}
            onDelete={handleDeleteFocusedSkill}
            onDeleteSection={() => removeSectionWithConfirm(sectionId!, "skills")}
            showDelete={false}
          />
        )}
        {!hideHeader && (
          <SectionHeader title="Skills" themeColor={themeColor} />
        )}
        <EmptyState
          title="No skills added"
          description="Click to add your skills"
          onAdd={handleAddSkill}
          icon={Code}
        />
      </div>
    );
  }

  return (
    <div
      className="mb-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <SkillsToolbar
          onAddSkill={handleAddSkill}
          onAddGroup={handleAddGroup}
          onDelete={handleDeleteFocusedSkill}
          onDeleteSection={() => removeSectionWithConfirm(sectionId!, "skills")}
          showDelete={focusedSkill !== null}
        />
      )}
      {!hideHeader && (
        <div data-pagination-header>
          <SectionHeader title="Skills" themeColor={themeColor} />
        </div>
      )}

      <div className="space-y-2">
        {categories.map((category, groupIndex) => {
          if (displayItemIndices && !displayItemIndices.includes(groupIndex))
            return null;

          return (
            <div
              key={groupIndex}
              className="relative group"
              data-pagination-item
            >
              <div className="flex items-start gap-2 flex-wrap">
                {/* Show group name only if visible */}
                {category.isVisible && (
                  <>
                    <EditableText
                      value={category.name}
                      onChange={(val) =>
                        handleCategoryNameChange(groupIndex, val)
                      }
                      placeholder="Group Title"
                      className="text-sm font-medium text-teal-700 min-w-[80px]"
                      as="span"
                    />
                    <span className="text-gray-400">:</span>
                  </>
                )}

                {/* Skills as comma-separated text */}
                <div className="flex flex-wrap items-center">
                  {(category.items || []).map((skill, skillIndex) => (
                    <React.Fragment key={skillIndex}>
                      <SkillPill
                        value={skill}
                        onChange={(val) =>
                          handleSkillChange(groupIndex, skillIndex, val)
                        }
                        onFocus={() => handleSkillFocus(groupIndex, skillIndex)}
                        onBlur={handleSkillBlur}
                        autoFocus={
                          newSkillIndex?.groupIndex === groupIndex &&
                          newSkillIndex?.skillIndex === skillIndex
                        }
                        isFocused={
                          focusedSkill?.groupIndex === groupIndex &&
                          focusedSkill?.skillIndex === skillIndex
                        }
                        placeholder="Skill"
                        className="bg-transparent px-0 py-0 text-gray-700 rounded-none hover:bg-gray-100 min-w-0"
                      />
                      {/* Separator comma */}
                      {skillIndex < (category.items?.length || 0) - 1 && (
                        <span className="text-gray-700 mr-1">,</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsSection;
