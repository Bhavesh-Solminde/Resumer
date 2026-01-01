import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
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
}

interface HeaderSectionProps {
  data: HeaderData;
  sectionId?: string;
}

/**
 * Header Section for Modern template
 * Left-aligned with accent border
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({
  data,
  sectionId = "header",
}) => {
  const updateSectionData = useBuildStore((state) => state.updateSectionData);

  const handleChange = (field: string, value: string) => {
    updateSectionData(sectionId, { [field]: value });
  };

  return (
    <div className="mb-6 pb-4 border-l-4 border-indigo-600 pl-4">
      {/* Name */}
      <EditableText
        value={data.fullName || ""}
        onChange={(val) => handleChange("fullName", val)}
        placeholder="Your Name"
        className="text-3xl font-bold text-gray-900"
        as="h1"
      />

      {/* Title */}
      <EditableText
        value={data.title || ""}
        onChange={(val) => handleChange("title", val)}
        placeholder="Professional Title"
        className="text-lg text-indigo-600 mt-1"
        as="p"
      />

      {/* Contact Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.email}
              onChange={(val) => handleChange("email", val)}
              placeholder="Email"
              className="text-sm"
              as="span"
            />
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.phone}
              onChange={(val) => handleChange("phone", val)}
              placeholder="Phone"
              className="text-sm"
              as="span"
            />
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.location}
              onChange={(val) => handleChange("location", val)}
              placeholder="Location"
              className="text-sm"
              as="span"
            />
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.website}
              onChange={(val) => handleChange("website", val)}
              placeholder="Website"
              className="text-sm"
              as="span"
            />
          </div>
        )}
        {data.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.linkedin}
              onChange={(val) => handleChange("linkedin", val)}
              placeholder="LinkedIn"
              className="text-sm"
              as="span"
            />
          </div>
        )}
        {data.github && (
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-indigo-500" />
            <EditableText
              value={data.github}
              onChange={(val) => handleChange("github", val)}
              placeholder="GitHub"
              className="text-sm"
              as="span"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
