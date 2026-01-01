import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  LucideIcon,
} from "lucide-react";
import { EditableText } from "../../../shared";
import useBuildStore from "../../../../../store/Build.store";

interface HeaderData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

interface HeaderSectionProps {
  data: HeaderData;
  sectionId?: string;
}

interface ContactItem {
  key: keyof HeaderData;
  icon: LucideIcon;
  value: string | undefined;
}

/**
 * Header Section for Shraddha template
 * Clean centered layout with contact info in a row
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({
  data,
  sectionId = "header",
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);

  const handleChange = (field: string, value: string) => {
    updateSectionData(sectionId, { [field]: value });
  };

  const contactItems: ContactItem[] = [
    { key: "email", icon: Mail, value: data.email },
    { key: "phone", icon: Phone, value: data.phone },
    { key: "location", icon: MapPin, value: data.location },
    { key: "linkedin", icon: Linkedin, value: data.linkedin },
    { key: "github", icon: Github, value: data.github },
    { key: "website", icon: Globe, value: data.website },
  ].filter((item): item is ContactItem & { value: string } =>
    Boolean(item.value)
  );

  return (
    <div className="text-center mb-4">
      {/* Name */}
      <EditableText
        value={data.fullName || ""}
        onChange={(val) => handleChange("fullName", val)}
        placeholder="Your Name"
        className="text-2xl font-bold text-gray-900"
        as="h1"
      />

      {/* Title */}
      <EditableText
        value={data.title || ""}
        onChange={(val) => handleChange("title", val)}
        placeholder="Professional Title"
        className="text-base text-gray-600 mt-1"
        as="p"
      />

      {/* Contact Info Row */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
        {contactItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center gap-1">
              <Icon className="w-3.5 h-3.5 text-gray-500" />
              <EditableText
                value={item.value || ""}
                onChange={(val) => handleChange(item.key, val)}
                placeholder={item.key}
                className="text-sm"
                as="span"
              />
            </div>
          );
        })}
      </div>

      {/* Summary (if present) */}
      {data.summary !== undefined && (
        <div className="mt-3 text-sm text-gray-700 text-left">
          <EditableText
            value={data.summary}
            onChange={(val) => handleChange("summary", val)}
            placeholder="Brief professional summary..."
            className="text-sm leading-relaxed"
            multiline
            as="p"
          />
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
