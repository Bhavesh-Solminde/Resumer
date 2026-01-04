import React, { useState, CSSProperties, ElementType } from "react";
import { useBuildStore, useResumeData } from "../../../store/Build.store";
import { cn } from "../../../lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

// ============================================================================
// Type Definitions
// ============================================================================

interface Theme {
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

interface SectionData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  content?: string;
  items?:
    | ExperienceItem[]
    | EducationItem[]
    | ProjectItem[]
    | AchievementItem[]
    | string[];
  categories?: SkillCategory[];
  dob?: string;
  languages?: string;
  hobbies?: string;
  address?: string;
}

interface Section {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  locked?: boolean;
}

interface ExperienceItem {
  id: string;
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  bullets?: string[];
}

interface EducationItem {
  id: string;
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

interface ProjectItem {
  id: string;
  name?: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

interface AchievementItem {
  id: string;
  description?: string;
}

interface SkillCategory {
  id: string;
  name?: string;
  skills?: string;
}

interface ResumeData {
  template?: string;
  theme?: Theme;
}

interface SectionProps {
  section: Section;
  themeColor?: string;
}

interface ShraddhaHeaderProps {
  title: string;
  themeColor?: string;
  accentColor?: string;
}

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  as?: ElementType;
  style?: CSSProperties;
}

interface SectionWrapperProps {
  section: Section;
  children: React.ReactNode;
  className?: string;
  showControls?: boolean;
}

// ============================================================================
// Shraddha-style Section Header (blue text with yellow highlight)
// ============================================================================

export const ShraddhaHeader: React.FC<ShraddhaHeaderProps> = ({
  title,
  themeColor,
  accentColor,
}) => (
  <div className="relative mb-4">
    <div
      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4"
      style={{ backgroundColor: `${accentColor || "#eab308"}40` }}
    />
    <h3
      className="relative text-base font-bold uppercase tracking-wider py-1"
      style={{ color: themeColor }}
    >
      {title}
    </h3>
  </div>
);

// ============================================================================
// Editable Text Component
// ============================================================================

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
  as: Component = "span",
  style,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
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
      style={style}
    >
      {value || placeholder}
    </Component>
  );
};

// ============================================================================
// Section Wrapper with hover controls
// ============================================================================

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
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

// ============================================================================
// Header Section
// ============================================================================

export const HeaderSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const resumeData = useResumeData();
  const { data } = section;
  const typedResumeData = resumeData as ResumeData;
  const isBasicTemplate = typedResumeData.template === "basic";
  const isShraddhaTemplate = typedResumeData.template === "shraddha";

  const updateField = (field: string, value: string) => {
    updateSectionData(section.id, { [field]: value });
  };

  // Basic template: Left-aligned header with name, mobile, email
  if (isBasicTemplate) {
    return (
      <SectionWrapper section={section} showControls={false}>
        <div className="py-4">
          <EditableText
            value={data.fullName || ""}
            onChange={(v) => updateField("fullName", v)}
            placeholder="Your Name"
            className="text-2xl font-bold block uppercase tracking-wide"
            style={{ color: themeColor }}
          />
          <div className="mt-2 space-y-0.5 text-sm">
            <div>
              <span className="text-muted-foreground">Mobile No: </span>
              <EditableText
                value={data.phone || ""}
                onChange={(v) => updateField("phone", v)}
                placeholder="91234XXXXX"
                className="inline"
              />
            </div>
            <div>
              <span className="text-muted-foreground">Email id: </span>
              <EditableText
                value={data.email || ""}
                onChange={(v) => updateField("email", v)}
                placeholder="youremail@gmail.com"
                className="inline"
                style={{ color: themeColor }}
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Shraddha template: Centered with large name, contact line, and links line
  if (isShraddhaTemplate) {
    return (
      <SectionWrapper section={section} showControls={false}>
        <div
          className="text-center py-6 border-b-2"
          style={{ borderColor: themeColor }}
        >
          <EditableText
            value={data.fullName || ""}
            onChange={(v) => updateField("fullName", v)}
            placeholder="YOUR NAME"
            className="text-3xl font-bold block uppercase tracking-wider"
            style={{ color: themeColor }}
          />
          <div className="flex flex-wrap justify-center gap-1 mt-2 text-sm">
            <EditableText
              value={data.email || ""}
              onChange={(v) => updateField("email", v)}
              placeholder="email@example.com"
              style={{ color: themeColor }}
            />
            <span className="text-muted-foreground">|</span>
            <EditableText
              value={data.phone || ""}
              onChange={(v) => updateField("phone", v)}
              placeholder="+91 98765-43210"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1 text-sm">
            <EditableText
              value={data.website || "Portfolio"}
              onChange={(v) => updateField("website", v)}
              placeholder="Portfolio"
              style={{ color: themeColor }}
            />
            <span className="text-muted-foreground">|</span>
            <EditableText
              value={data.linkedin || "LinkedIn"}
              onChange={(v) => updateField("linkedin", v)}
              placeholder="LinkedIn"
              style={{ color: themeColor }}
            />
            <span className="text-muted-foreground">|</span>
            <EditableText
              value={data.github || "GitHub"}
              onChange={(v) => updateField("github", v)}
              placeholder="GitHub"
              style={{ color: themeColor }}
            />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Default: Centered header
  return (
    <SectionWrapper section={section} showControls={false}>
      <div className="text-center py-4">
        <EditableText
          value={data.fullName || ""}
          onChange={(v) => updateField("fullName", v)}
          placeholder="Your Name"
          className="text-2xl font-bold block"
          style={{ color: themeColor }}
        />
        <EditableText
          value={data.title || ""}
          onChange={(v) => updateField("title", v)}
          placeholder="Professional Title"
          className="text-lg block mt-1"
          style={{ color: themeColor }}
        />
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-muted-foreground">
          <EditableText
            value={data.email || ""}
            onChange={(v) => updateField("email", v)}
            placeholder="email@example.com"
          />
          <span>•</span>
          <EditableText
            value={data.phone || ""}
            onChange={(v) => updateField("phone", v)}
            placeholder="+1 234 567 890"
          />
          <span>•</span>
          <EditableText
            value={data.location || ""}
            onChange={(v) => updateField("location", v)}
            placeholder="City, Country"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Summary Section
// ============================================================================

export const SummarySection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
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
          value={data.content || ""}
          onChange={(v) => updateSectionData(section.id, { content: v })}
          placeholder="Write a brief professional summary..."
          multiline
          className="text-sm leading-relaxed"
        />
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Experience Section
// ============================================================================

export const ExperienceSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const resumeData = useResumeData();
  const { data } = section;
  const typedResumeData = resumeData as ResumeData;
  const isShraddhaTemplate = typedResumeData.template === "shraddha";
  const items = (data.items || []) as ExperienceItem[];

  const updateItem = (itemId: string, field: string, value: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  const updateBullet = (itemId: string, bulletIndex: number, value: string) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        const newBullets = [...(item.bullets || [])];
        newBullets[bulletIndex] = value;
        return { ...item, bullets: newBullets };
      }
      return item;
    });
    updateSectionData(section.id, { items: newItems });
  };

  // Shraddha template
  if (isShraddhaTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <ShraddhaHeader
            title="Experience"
            themeColor={themeColor}
            accentColor={typedResumeData.theme?.accentColor}
          />
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold">
                      <EditableText
                        value={item.title || ""}
                        onChange={(v) => updateItem(item.id, "title", v)}
                        placeholder="Job Title"
                        className="inline font-bold"
                      />
                    </span>
                    <span className="text-muted-foreground"> | </span>
                    <EditableText
                      value={item.company || ""}
                      onChange={(v) => updateItem(item.id, "company", v)}
                      placeholder="Company Name"
                      className="inline italic text-muted-foreground"
                    />
                  </div>
                  <EditableText
                    value={`${item.startDate || ""} - ${item.endDate || ""}`}
                    onChange={(v) => {
                      const separatorRegex = /\s*(?:–|—|-|\bto\b)\s*/i;
                      const parts = v
                        .split(separatorRegex)
                        .map((p) => p.trim());
                      if (parts.length >= 2) {
                        updateItem(item.id, "startDate", parts[0] || "");
                        updateItem(item.id, "endDate", parts[1] || "Present");
                      } else if (parts.length === 1) {
                        updateItem(item.id, "startDate", parts[0]);
                        updateItem(item.id, "endDate", "Present");
                      }
                    }}
                    placeholder="Jun 2024 - Jul 2024"
                    className="text-sm text-muted-foreground"
                  />
                </div>
                {/* Bullet points */}
                <ul className="mt-2 space-y-1 list-disc list-outside ml-5">
                  {(item.bullets || []).map((bullet, idx) => (
                    <li key={idx} className="text-sm">
                      <EditableText
                        value={bullet}
                        onChange={(v) => updateBullet(item.id, idx, v)}
                        placeholder="Describe your achievement..."
                        className="inline"
                      />
                    </li>
                  ))}
                </ul>
                {(!item.bullets || item.bullets.length === 0) && (
                  <EditableText
                    value={item.description || ""}
                    onChange={(v) => updateItem(item.id, "description", v)}
                    placeholder="Describe your responsibilities..."
                    multiline
                    className="text-sm mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Default style
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
          {items.map((item) => (
            <div
              key={item.id}
              className="border-l-2 pl-4"
              style={{ borderColor: themeColor }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <EditableText
                    value={item.title || ""}
                    onChange={(v) => updateItem(item.id, "title", v)}
                    placeholder="Job Title"
                    className="font-semibold"
                  />
                  <EditableText
                    value={item.company || ""}
                    onChange={(v) => updateItem(item.id, "company", v)}
                    placeholder="Company Name"
                    className="block"
                    style={{ color: themeColor }}
                  />
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <EditableText
                    value={`${item.startDate || ""} - ${item.endDate || ""}`}
                    onChange={(v) => {
                      if (v.trim() === "") {
                        updateItem(item.id, "startDate", "");
                        updateItem(item.id, "endDate", "");
                        return;
                      }
                      const separatorRegex = /\s*(?:–|—|-|\bto\b)\s*/i;
                      const parts = v
                        .split(separatorRegex)
                        .map((p) => p.trim());
                      let parsedStart = "";
                      let parsedEnd = "Present";
                      if (parts.length >= 2) {
                        parsedStart = parts[0] || "";
                        parsedEnd = parts[1] || "Present";
                      } else if (parts.length === 1 && parts[0]) {
                        parsedStart = parts[0];
                        parsedEnd = "Present";
                      }
                      updateItem(item.id, "startDate", parsedStart);
                      updateItem(item.id, "endDate", parsedEnd);
                    }}
                    placeholder="MM/YYYY - Present"
                  />
                  <EditableText
                    value={item.location || ""}
                    onChange={(v) => updateItem(item.id, "location", v)}
                    placeholder="Location"
                    className="block"
                  />
                </div>
              </div>
              <EditableText
                value={item.description || ""}
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

// ============================================================================
// Education Section
// ============================================================================

export const EducationSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const resumeData = useResumeData();
  const { data } = section;
  const typedResumeData = resumeData as ResumeData;
  const isBasicTemplate = typedResumeData.template === "basic";
  const isShraddhaTemplate = typedResumeData.template === "shraddha";
  const items = (data.items || []) as EducationItem[];

  const updateItem = (itemId: string, field: string, value: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  // Shraddha template
  if (isShraddhaTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <ShraddhaHeader
            title="Education"
            themeColor={themeColor}
            accentColor={typedResumeData.theme?.accentColor}
          />
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <EditableText
                    value={item.degree || ""}
                    onChange={(v) => updateItem(item.id, "degree", v)}
                    placeholder="Degree Name"
                    className="font-bold"
                  />
                  <EditableText
                    value={item.institution || ""}
                    onChange={(v) => updateItem(item.id, "institution", v)}
                    placeholder="Institution Name"
                    className="block text-sm italic text-muted-foreground"
                  />
                </div>
                <EditableText
                  value={item.endDate || ""}
                  onChange={(v) => updateItem(item.id, "endDate", v)}
                  placeholder="Present"
                  className="text-sm text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Basic template
  if (isBasicTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <div className="flex items-center gap-2 mb-3">
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: themeColor }}
            >
              Education
            </h3>
            <div
              className="flex-1 h-0.5"
              style={{ backgroundColor: `${themeColor}30` }}
            />
          </div>
          <ul className="space-y-1.5 list-disc list-inside">
            {items.map((item) => (
              <li
                key={item.id}
                className="text-sm flex justify-between items-start"
              >
                <span className="flex-1">
                  <EditableText
                    value={item.degree || ""}
                    onChange={(v) => updateItem(item.id, "degree", v)}
                    placeholder="Degree Name"
                    className="inline"
                  />
                  {", "}
                  <EditableText
                    value={item.institution || ""}
                    onChange={(v) => updateItem(item.id, "institution", v)}
                    placeholder="Institution Name"
                    className="inline"
                  />
                  {item.gpa && (
                    <>
                      {", "}
                      <EditableText
                        value={item.gpa}
                        onChange={(v) => updateItem(item.id, "gpa", v)}
                        placeholder="GPA/Percentage"
                        className="inline"
                      />
                    </>
                  )}
                </span>
                <EditableText
                  value={item.endDate || ""}
                  onChange={(v) => updateItem(item.id, "endDate", v)}
                  placeholder="Year"
                  className="text-sm font-medium ml-4"
                />
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>
    );
  }

  // Default style
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
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <EditableText
                  value={item.degree || ""}
                  onChange={(v) => updateItem(item.id, "degree", v)}
                  placeholder="Degree Name"
                  className="font-semibold"
                />
                <EditableText
                  value={item.institution || ""}
                  onChange={(v) => updateItem(item.id, "institution", v)}
                  placeholder="University Name"
                  className="block"
                  style={{ color: themeColor }}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <EditableText
                  value={`${item.startDate || ""} - ${item.endDate || ""}`}
                  onChange={(v) => {
                    const separatorRegex = /\s*(?:–|—|-|\bto\b)\s*/i;
                    const parts = v
                      .split(separatorRegex, 2)
                      .map((p) => p.trim());
                    let parsedStart = "";
                    let parsedEnd = "";
                    if (parts.length >= 2) {
                      parsedStart = parts[0] || "";
                      parsedEnd = parts[1] || "";
                    } else if (parts.length === 1 && parts[0]) {
                      parsedStart = parts[0];
                      parsedEnd = "";
                    }
                    updateItem(item.id, "startDate", parsedStart);
                    updateItem(item.id, "endDate", parsedEnd);
                  }}
                  placeholder="MM/YYYY - MM/YYYY"
                />
                <EditableText
                  value={item.location || ""}
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

// ============================================================================
// Skills Section
// ============================================================================

export const SkillsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;
  const items = (data.items || []) as string[];

  const handleSkillsChange = (value: string) => {
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
          {(data as { title?: string }).title || "Skills"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((skill, index) => (
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
            value={items.join(", ")}
            onChange={handleSkillsChange}
            placeholder="Add skills separated by commas..."
            className="text-xs text-muted-foreground"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Projects Section
// ============================================================================

export const ProjectsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const resumeData = useResumeData();
  const { data } = section;
  const typedResumeData = resumeData as ResumeData;
  const isBasicTemplate = typedResumeData.template === "basic";
  const isShraddhaTemplate = typedResumeData.template === "shraddha";
  const items = (data.items || []) as ProjectItem[];

  const updateItem = (itemId: string, field: string, value: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  const updateBullet = (itemId: string, bulletIndex: number, value: string) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        const newBullets = [...(item.bullets || [])];
        newBullets[bulletIndex] = value;
        return { ...item, bullets: newBullets };
      }
      return item;
    });
    updateSectionData(section.id, { items: newItems });
  };

  // Shraddha template
  if (isShraddhaTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <ShraddhaHeader
            title="Projects"
            themeColor={themeColor}
            accentColor={typedResumeData.theme?.accentColor}
          />
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <EditableText
                      value={item.name || ""}
                      onChange={(v) => updateItem(item.id, "name", v)}
                      placeholder="Project Name"
                      className="font-bold"
                    />
                    {item.subtitle && (
                      <>
                        <span className="text-muted-foreground"> - </span>
                        <EditableText
                          value={item.subtitle}
                          onChange={(v) => updateItem(item.id, "subtitle", v)}
                          placeholder="Project Description"
                          className="inline text-muted-foreground"
                        />
                      </>
                    )}
                  </div>
                  <EditableText
                    value={item.date || ""}
                    onChange={(v) => updateItem(item.id, "date", v)}
                    placeholder="Present"
                    className="text-sm text-muted-foreground"
                  />
                </div>
                {/* Bullet points */}
                <ul className="mt-2 space-y-1 list-disc list-outside ml-5">
                  {(item.bullets || []).map((bullet, idx) => (
                    <li key={idx} className="text-sm">
                      <EditableText
                        value={bullet}
                        onChange={(v) => updateBullet(item.id, idx, v)}
                        placeholder="Describe your achievement..."
                        className="inline"
                      />
                    </li>
                  ))}
                </ul>
                {(!item.bullets || item.bullets.length === 0) &&
                  item.description && (
                    <EditableText
                      value={item.description}
                      onChange={(v) => updateItem(item.id, "description", v)}
                      placeholder="Brief description of the project..."
                      multiline
                      className="text-sm mt-2"
                    />
                  )}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Basic template
  if (isBasicTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <div className="flex items-center gap-2 mb-3">
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: themeColor }}
            >
              Project Work
            </h3>
            <div
              className="flex-1 h-0.5"
              style={{ backgroundColor: `${themeColor}30` }}
            />
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline gap-2">
                  <EditableText
                    value={item.name || ""}
                    onChange={(v) => updateItem(item.id, "name", v)}
                    placeholder="Project Name"
                    className="font-bold"
                  />
                  <span className="text-sm text-muted-foreground">
                    (
                    <EditableText
                      value={item.date || ""}
                      onChange={(v) => updateItem(item.id, "date", v)}
                      placeholder="Month Year"
                      className="inline"
                    />
                    )
                  </span>
                </div>
                <EditableText
                  value={item.subtitle || ""}
                  onChange={(v) => updateItem(item.id, "subtitle", v)}
                  placeholder="Team size: X | Front End: Tech | Back End: Tech"
                  className="text-sm italic text-muted-foreground block"
                />
                <div className="mt-1">
                  <span className="font-medium text-sm">
                    Project Description:{" "}
                  </span>
                  <EditableText
                    value={item.description || ""}
                    onChange={(v) => updateItem(item.id, "description", v)}
                    placeholder="Brief description of the project..."
                    multiline
                    className="text-sm inline"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Default style
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
          {items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <EditableText
                  value={item.name || ""}
                  onChange={(v) => updateItem(item.id, "name", v)}
                  placeholder="Project Name"
                  className="font-semibold"
                  style={{ color: themeColor }}
                />
                <EditableText
                  value={item.date || ""}
                  onChange={(v) => updateItem(item.id, "date", v)}
                  placeholder="MM/YYYY"
                  className="text-sm text-muted-foreground"
                />
              </div>
              <EditableText
                value={item.subtitle || ""}
                onChange={(v) => updateItem(item.id, "subtitle", v)}
                placeholder="Project Type"
                className="text-sm text-muted-foreground block"
              />
              <EditableText
                value={item.description || ""}
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

// ============================================================================
// Generic Section for additional types
// ============================================================================

const sectionLabels: Record<string, string> = {
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

export const GenericSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
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

// ============================================================================
// Objective / Career Objective Section
// ============================================================================

export const ObjectiveSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Career Objective
          </h3>
          <div
            className="flex-1 h-0.5"
            style={{ backgroundColor: `${themeColor}30` }}
          />
        </div>
        <EditableText
          value={data.content || ""}
          onChange={(v) => updateSectionData(section.id, { content: v })}
          placeholder="Write your career objective..."
          multiline
          className="text-sm leading-relaxed"
        />
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Technical Skills Section (with categories)
// ============================================================================

export const TechnicalSkillsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const resumeData = useResumeData();
  const { data } = section;
  const typedResumeData = resumeData as ResumeData;
  const isShraddhaTemplate = typedResumeData.template === "shraddha";
  const categories = (data.categories || []) as SkillCategory[];

  const updateCategory = (categoryId: string, field: string, value: string) => {
    const newCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    );
    updateSectionData(section.id, { categories: newCategories });
  };

  // Shraddha template
  if (isShraddhaTemplate) {
    return (
      <SectionWrapper section={section}>
        <div className="py-3">
          <ShraddhaHeader
            title="Technical Skills"
            themeColor={themeColor}
            accentColor={typedResumeData.theme?.accentColor}
          />
          <ul className="space-y-1 list-disc list-outside ml-5">
            {categories.map((category) => (
              <li key={category.id} className="text-sm">
                <EditableText
                  value={category.name || ""}
                  onChange={(v) => updateCategory(category.id, "name", v)}
                  placeholder="Category"
                  className="font-bold inline"
                />
                {": "}
                <EditableText
                  value={category.skills || ""}
                  onChange={(v) => updateCategory(category.id, "skills", v)}
                  placeholder="Skill 1, Skill 2, Skill 3"
                  className="inline"
                />
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>
    );
  }

  // Default/Basic style
  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-3">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Technical Skills
          </h3>
          <div
            className="flex-1 h-0.5"
            style={{ backgroundColor: `${themeColor}30` }}
          />
        </div>
        <ul className="space-y-1.5 list-disc list-inside">
          {categories.map((category) => (
            <li key={category.id} className="text-sm">
              <EditableText
                value={category.name || ""}
                onChange={(v) => updateCategory(category.id, "name", v)}
                placeholder="Category"
                className="font-medium inline"
              />
              {": "}
              <EditableText
                value={category.skills || ""}
                onChange={(v) => updateCategory(category.id, "skills", v)}
                placeholder="Skill 1, Skill 2, Skill 3"
                className="inline"
              />
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Strengths Section (bullet list)
// ============================================================================

export const StrengthsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;
  const items = (data.items || []) as string[];

  const handleStrengthsChange = (value: string) => {
    const strengths = value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateSectionData(section.id, { items: strengths });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-3">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Strengths
          </h3>
          <div
            className="flex-1 h-0.5"
            style={{ backgroundColor: `${themeColor}30` }}
          />
        </div>
        <ul className="space-y-1 list-disc list-inside">
          {items.map((strength, index) => (
            <li key={index} className="text-sm">
              {strength}
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <EditableText
            value={items.join("\n")}
            onChange={handleStrengthsChange}
            placeholder="Add strengths (one per line)..."
            multiline
            className="text-xs text-muted-foreground"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Achievements Section (bullet list)
// ============================================================================

export const AchievementsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;
  const items = (data.items || []) as AchievementItem[];

  const updateItem = (itemId: string, value: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, description: value } : item
    );
    updateSectionData(section.id, { items: newItems });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-3">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Achievements
          </h3>
          <div
            className="flex-1 h-0.5"
            style={{ backgroundColor: `${themeColor}30` }}
          />
        </div>
        <ul className="space-y-1.5 list-disc list-inside">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              <EditableText
                value={item.description || ""}
                onChange={(v) => updateItem(item.id, v)}
                placeholder="Describe your achievement..."
                className="inline"
              />
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
};

// ============================================================================
// Personal Details Section
// ============================================================================

export const PersonalDetailsSection: React.FC<SectionProps> = ({
  section,
  themeColor,
}) => {
  const { updateSectionData } = useBuildStore();
  const { data } = section;

  const updateField = (field: string, value: string) => {
    updateSectionData(section.id, { [field]: value });
  };

  return (
    <SectionWrapper section={section}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-3">
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Personal Details
          </h3>
          <div
            className="flex-1 h-0.5"
            style={{ backgroundColor: `${themeColor}30` }}
          />
        </div>
        <ul className="space-y-1.5 list-disc list-inside text-sm">
          <li>
            <span className="font-medium">Date of Birth: </span>
            <EditableText
              value={data.dob || ""}
              onChange={(v) => updateField("dob", v)}
              placeholder="DD Month YYYY"
              className="inline"
            />
          </li>
          <li>
            <span className="font-medium">Languages Known: </span>
            <EditableText
              value={data.languages || ""}
              onChange={(v) => updateField("languages", v)}
              placeholder="English, Hindi, etc."
              className="inline"
            />
          </li>
          <li>
            <span className="font-medium">Hobbies: </span>
            <EditableText
              value={data.hobbies || ""}
              onChange={(v) => updateField("hobbies", v)}
              placeholder="Reading, Sports, etc."
              className="inline"
            />
          </li>
          <li>
            <span className="font-medium">Address: </span>
            <EditableText
              value={data.address || ""}
              onChange={(v) => updateField("address", v)}
              placeholder="City, State, PIN"
              className="inline"
            />
          </li>
        </ul>
      </div>
    </SectionWrapper>
  );
};
