import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
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
}

interface HeaderSectionProps {
  data: HeaderData;
  sectionId?: string;
}

/**
 * Header Section for Basic template
 * Centered layout with teal border
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
    <div className="text-center mb-4 pb-3 border-b-2 border-teal-600">
      {/* Name */}
      <EditableText
        value={data.fullName || ""}
        onChange={(val) => handleChange("fullName", val)}
        placeholder="Your Name"
        className="text-2xl font-bold text-teal-700"
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

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-3 text-sm text-gray-600">
        {data.email && (
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-teal-600" />
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
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
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
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <EditableText
              value={data.location}
              onChange={(val) => handleChange("location", val)}
              placeholder="Location"
              className="text-sm"
              as="span"
            />
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex justify-center gap-4 mt-2 text-sm">
        {data.linkedin && (
          <div className="flex items-center gap-1 text-teal-600">
            <Linkedin className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-1 text-teal-600">
            <Github className="w-3.5 h-3.5" />
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
