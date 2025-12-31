import React, { useState } from "react";
import { useBuildStore } from "@/store/Build.store";
import { cn } from "@/lib/utils";
import { Trash2, GripVertical, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Editable Text Component
export const EditableText = ({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
  as: Component = "span",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing || multiline) {
    return multiline ? (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus={isEditing}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent border-none outline-none resize-none focus:ring-1 focus:ring-primary/50 rounded px-1",
          className
        )}
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        placeholder={placeholder}
        className={cn(
          "bg-transparent border-none outline-none focus:ring-1 focus:ring-primary/50 rounded px-1",
          className
        )}
      />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-text hover:bg-primary/5 rounded px-1 transition-colors",
        !value && "text-muted-foreground italic",
        className
      )}
    >
      {value || placeholder}
    </Component>
  );
};

// Section Wrapper with hover controls
export const SectionWrapper = ({
  section,
  children,
  className,
  showControls = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { removeSection, setSelectedSection, selectedSectionId } =
    useBuildStore();

  const isSelected = selectedSectionId === section.id;

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isHovered && !section.locked && "ring-2 ring-dashed ring-primary/50",
        isSelected && "ring-2 ring-primary",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedSection(section.id)}
    >
      {/* Controls */}
      {showControls && isHovered && !section.locked && (
        <div className="absolute -right-2 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              removeSection(section.id);
            }}
            className="h-7 w-7 shadow-md"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {children}
    </div>
  );
};

// Header Section
export const HeaderSection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const updateField = (field, value) => {
    updateSectionData(section.id, { [field]: value });
  };

  return (
    <SectionWrapper section={section} showControls={false}>
      <div className="text-center py-4">
        <EditableText
          value={data.fullName}
          onChange={(v) => updateField("fullName", v)}
          placeholder="Your Name"
          className="text-2xl font-bold block"
          style={{ color: themeColor }}
        />
        <EditableText
          value={data.title}
          onChange={(v) => updateField("title", v)}
          placeholder="Professional Title"
          className="text-lg block mt-1"
          style={{ color: themeColor }}
        />
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-muted-foreground">
          <EditableText
            value={data.email}
            onChange={(v) => updateField("email", v)}
            placeholder="email@example.com"
          />
          <span>•</span>
          <EditableText
            value={data.phone}
            onChange={(v) => updateField("phone", v)}
            placeholder="+1 234 567 890"
          />
          <span>•</span>
          <EditableText
            value={data.location}
            onChange={(v) => updateField("location", v)}
            placeholder="City, Country"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

// Summary Section
export const SummarySection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-2"
          style={{ color: themeColor }}
        >
          Summary
        </h3>
        <EditableText
          value={data.content}
          onChange={(v) => updateSectionData(section.id, { content: v })}
          placeholder="Write a brief professional summary..."
          multiline
          className="text-sm leading-relaxed"
        />
      </div>
    </SectionWrapper>
  );
};

// Experience Section
export const ExperienceSection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const updateItem = (itemId, field, value) => {
    const newItems = data.items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: themeColor }}
        >
          Experience
        </h3>
        <div className="space-y-4">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="border-l-2 pl-4"
              style={{ borderColor: themeColor }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <EditableText
                    value={item.title}
                    onChange={(v) => updateItem(item.id, "title", v)}
                    placeholder="Job Title"
                    className="font-semibold"
                  />
                  <EditableText
                    value={item.company}
                    onChange={(v) => updateItem(item.id, "company", v)}
                    placeholder="Company Name"
                    className="block"
                    style={{ color: themeColor }}
                  />
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <EditableText
                    value={`${item.startDate} - ${item.endDate}`}
                    onChange={(v) => {
                      const [start, end] = v.split(" - ");
                      updateItem(item.id, "startDate", start || "");
                      updateItem(item.id, "endDate", end || "Present");
                    }}
                    placeholder="MM/YYYY - Present"
                  />
                  <EditableText
                    value={item.location}
                    onChange={(v) => updateItem(item.id, "location", v)}
                    placeholder="Location"
                    className="block"
                  />
                </div>
              </div>
              <EditableText
                value={item.description}
                onChange={(v) => updateItem(item.id, "description", v)}
                placeholder="Describe your responsibilities and achievements..."
                multiline
                className="text-sm mt-2"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// Education Section
export const EducationSection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const updateItem = (itemId, field, value) => {
    const newItems = data.items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: themeColor }}
        >
          Education
        </h3>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <EditableText
                  value={item.degree}
                  onChange={(v) => updateItem(item.id, "degree", v)}
                  placeholder="Degree Name"
                  className="font-semibold"
                />
                <EditableText
                  value={item.institution}
                  onChange={(v) => updateItem(item.id, "institution", v)}
                  placeholder="University Name"
                  className="block"
                  style={{ color: themeColor }}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <EditableText
                  value={`${item.startDate} - ${item.endDate}`}
                  onChange={(v) => {
                    const [start, end] = v.split(" - ");
                    updateItem(item.id, "startDate", start || "");
                    updateItem(item.id, "endDate", end || "");
                  }}
                  placeholder="MM/YYYY - MM/YYYY"
                />
                <EditableText
                  value={item.location}
                  onChange={(v) => updateItem(item.id, "location", v)}
                  placeholder="Location"
                  className="block"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// Skills Section
export const SkillsSection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const handleSkillsChange = (value) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSectionData(section.id, { items: skills });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: themeColor }}
        >
          {data.title || "Skills"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.items.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full border"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <EditableText
            value={data.items.join(", ")}
            onChange={handleSkillsChange}
            placeholder="Add skills separated by commas..."
            className="text-xs text-muted-foreground"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

// Projects Section
export const ProjectsSection = ({ section, themeColor }) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const updateItem = (itemId, field, value) => {
    const newItems = data.items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: themeColor }}
        >
          Projects
        </h3>
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <EditableText
                  value={item.name}
                  onChange={(v) => updateItem(item.id, "name", v)}
                  placeholder="Project Name"
                  className="font-semibold"
                  style={{ color: themeColor }}
                />
                <EditableText
                  value={item.date}
                  onChange={(v) => updateItem(item.id, "date", v)}
                  placeholder="MM/YYYY"
                  className="text-sm text-muted-foreground"
                />
              </div>
              <EditableText
                value={item.subtitle}
                onChange={(v) => updateItem(item.id, "subtitle", v)}
                placeholder="Project Type"
                className="text-sm text-muted-foreground block"
              />
              <EditableText
                value={item.description}
                onChange={(v) => updateItem(item.id, "description", v)}
                placeholder="Brief description of the project..."
                multiline
                className="text-sm mt-1"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// Generic Section for additional types
export const GenericSection = ({ section, themeColor }) => {
  const sectionLabels = {
    certifications: "Certifications",
    languages: "Languages",
    volunteering: "Volunteering",
    awards: "Awards",
    interests: "Interests",
    references: "References",
    publications: "Publications",
    courses: "Training / Courses",
    socialLinks: "Find Me Online",
    strengths: "Strengths",
    custom: "Custom Section",
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: themeColor }}
        >
          {sectionLabels[section.type] || section.type}
        </h3>
        <div className="text-sm text-muted-foreground italic">
          Click to edit this section
        </div>
      </div>
    </SectionWrapper>
  );
};
