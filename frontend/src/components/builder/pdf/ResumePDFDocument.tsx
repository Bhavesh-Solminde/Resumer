import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "../../../lib/dateUtils";

// Style type for react-pdf
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Style = any;

// Theme interface
interface Theme {
  pageMargins?: number;
  fontSize?: "small" | "medium" | "large";
  lineHeight?: number;
  primaryColor?: string;
  sectionSpacing?: number;
}

type DateLike = { month: number; year: number } | string | null | undefined;

// Data interfaces
interface HeaderData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface SummaryData {
  content?: string;
}

interface ExperienceItem {
  id?: string;
  title?: string;
  company?: string;
  startDate?: DateLike;
  endDate?: DateLike;
  location?: string;
  description?: string;
  bullets?: string[];
}

interface ExperienceData {
  items?: ExperienceItem[];
}

interface EducationItem {
  id?: string;
  degree?: string;
  institution?: string;
  startDate?: DateLike;
  endDate?: DateLike;
  location?: string;
  description?: string;
}

interface EducationData {
  items?: EducationItem[];
}

interface SkillsData {
  title?: string;
  items?: string[];
  categories?: Array<{
    name: string;
    items: string[];
    isVisible?: boolean;
  }>;
}

interface ProjectItem {
  id?: string;
  name?: string;
  date?: string;
  startDate?: DateLike;
  endDate?: DateLike;
  subtitle?: string;
  description?: string;
  technologies?: string[];
  bullets?: string[];
  link?: string;
}

interface ProjectsData {
  items?: ProjectItem[];
}

type SectionData =
  | HeaderData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | ProjectsData;

interface Section {
  id: string;
  type:
    | "header"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects";
  data: SectionData;
}

interface ResumeData {
  sections: Section[];
  style: Theme;
  sectionOrder?: string[];
  sectionSettings?: Record<string, Record<string, boolean>>;
}

interface SectionSettingsMap {
  [sectionType: string]: Record<string, boolean> | undefined;
}

interface PDFStyles {
  page: Style;
  header: Style;
  name: Style;
  title: Style;
  contactInfo: Style;
  contactItem: Style;
  section: Style;
  sectionTitle: Style;
  paragraph: Style;
  bulletList: Style;
  bulletItem: Style;
  bulletSymbol: Style;
  bulletText: Style;
  experienceItem: Style;
  experienceHeader: Style;
  experienceTitle: Style;
  experienceCompany: Style;
  experienceDate: Style;
  experienceLocation: Style;
  skillsContainer: Style;
  skillBadge: Style;
  skillGroupTitle: Style;
  inlineMeta: Style;
  projectItem: Style;
  projectName: Style;
  projectSubtitle: Style;
}

interface SectionComponentProps {
  data: SectionData;
  styles: PDFStyles;
  settings?: Record<string, boolean>;
}

// Create styles
const createStyles = (theme: Theme): PDFStyles =>
  StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: (theme.pageMargins || 1) * 15 + 20,
      fontFamily: "Helvetica",
      fontSize:
        theme.fontSize === "small" ? 10 : theme.fontSize === "large" ? 14 : 12,
      lineHeight: theme.lineHeight || 1.5,
    },
    header: {
      textAlign: "center",
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primaryColor || "#1e3a5f",
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: theme.primaryColor || "#1e3a5f",
      marginBottom: 8,
    },
    contactInfo: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 8,
      fontSize: 10,
      color: "#666666",
    },
    contactItem: {
      marginHorizontal: 6,
    },
    section: {
      marginBottom: (theme.sectionSpacing || 1) * 6 + 8,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: theme.primaryColor || "#1e3a5f",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryColor || "#1e3a5f",
    },
    paragraph: {
      fontSize: 10,
      lineHeight: 1.5,
      color: "#333333",
    },
    bulletList: {
      marginTop: 4,
      marginLeft: 6,
      gap: 2,
    },
    bulletItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4,
    },
    bulletSymbol: {
      fontSize: 10,
      lineHeight: 1.4,
      color: "#333333",
    },
    bulletText: {
      fontSize: 10,
      lineHeight: 1.4,
      color: "#333333",
      flexShrink: 1,
    },
    experienceItem: {
      marginBottom: 12,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    experienceTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#333333",
    },
    experienceCompany: {
      fontSize: 10,
      color: theme.primaryColor || "#1e3a5f",
    },
    experienceDate: {
      fontSize: 9,
      color: "#666666",
      textAlign: "right",
    },
    experienceLocation: {
      fontSize: 9,
      color: "#666666",
      textAlign: "right",
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skillBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primaryColor || "#1e3a5f",
      fontSize: 9,
      color: theme.primaryColor || "#1e3a5f",
    },
    skillGroupTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: theme.primaryColor || "#1e3a5f",
      marginTop: 4,
      marginBottom: 4,
    },
    inlineMeta: {
      fontSize: 9,
      color: "#666666",
      marginTop: 2,
    },
    projectItem: {
      marginBottom: 10,
    },
    projectName: {
      fontSize: 11,
      fontWeight: "bold",
      color: theme.primaryColor || "#1e3a5f",
    },
    projectSubtitle: {
      fontSize: 9,
      color: "#666666",
      marginBottom: 4,
    },
  }) as PDFStyles;

// Header Component
const PDFHeader: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const headerData = data as HeaderData;
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{headerData.fullName || "Your Name"}</Text>
      <Text style={styles.title}>
        {headerData.title || "Professional Title"}
      </Text>
      <View style={styles.contactInfo}>
        {headerData.email && (
          <Text style={styles.contactItem}>{headerData.email}</Text>
        )}
        {headerData.phone && (
          <Text style={styles.contactItem}>• {headerData.phone}</Text>
        )}
        {headerData.location && (
          <Text style={styles.contactItem}>• {headerData.location}</Text>
        )}
        {headerData.linkedin && (
          <Text style={styles.contactItem}>• {headerData.linkedin}</Text>
        )}
        {headerData.website && (
          <Text style={styles.contactItem}>• {headerData.website}</Text>
        )}
      </View>
    </View>
  );
};

// Summary Component
const PDFSummary: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const summaryData = data as SummaryData;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Summary</Text>
      <Text style={styles.paragraph}>{summaryData.content || ""}</Text>
    </View>
  );
};

// Experience Component
const PDFExperience: React.FC<SectionComponentProps> = ({
  data,
  styles,
  settings,
}) => {
  const experienceData = data as ExperienceData;
  const showCompany = settings?.showCompany ?? true;
  const showLocation = settings?.showLocation ?? true;
  const showPeriod = settings?.showPeriod ?? true;
  const showBullets = settings?.showBullets ?? true;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experienceData.items?.map((item) => (
        <View
          key={item.id || `${item.title}-${item.company}`}
          style={styles.experienceItem}
        >
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceTitle}>{item.title}</Text>
              {showCompany && (
                <Text style={styles.experienceCompany}>{item.company}</Text>
              )}
            </View>
            <View>
              {showPeriod && (
                <Text style={styles.experienceDate}>
                  {formatDate(item.startDate || null)}
                  {item.endDate ? ` - ${formatDate(item.endDate)}` : ""}
                </Text>
              )}
              {showLocation && (
                <Text style={styles.experienceLocation}>{item.location}</Text>
              )}
            </View>
          </View>
          {item.description && (
            <Text style={styles.paragraph}>{item.description}</Text>
          )}
          {showBullets && item.bullets && item.bullets.length > 0 && (
            <View style={styles.bulletList}>
              {item.bullets.map((bullet, index) => (
                <View
                  key={`${item.id}-bullet-${index}`}
                  style={styles.bulletItem}
                >
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

// Education Component
const PDFEducation: React.FC<SectionComponentProps> = ({
  data,
  styles,
  settings,
}) => {
  const educationData = data as EducationData;
  const showLocation = settings?.showLocation ?? true;
  const showPeriod = settings?.showPeriod ?? true;
  const showDescription = settings?.showDescription ?? false;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {educationData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceTitle}>{item.degree}</Text>
              <Text style={styles.experienceCompany}>{item.institution}</Text>
            </View>
            <View>
              {showPeriod && (
                <Text style={styles.experienceDate}>
                  {formatDate(item.startDate || null)}
                  {item.endDate ? ` - ${formatDate(item.endDate)}` : ""}
                </Text>
              )}
              {showLocation && (
                <Text style={styles.experienceLocation}>{item.location}</Text>
              )}
            </View>
          </View>
          {showDescription && item.description && (
            <Text style={styles.paragraph}>{item.description}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

// Skills Component
const PDFSkills: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const skillsData = data as SkillsData;
  const categories = (skillsData.categories || []).filter(
    (category) => category.isVisible !== false,
  );
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{skillsData.title || "Skills"}</Text>
      {categories.length > 0 ? (
        <View>
          {categories.map((category, index) => (
            <View key={`${category.name}-${index}`}>
              <Text style={styles.skillGroupTitle}>{category.name}</Text>
              <View style={styles.skillsContainer}>
                {category.items.map((skill, skillIndex) => (
                  <Text
                    key={`${skill}-${skillIndex}`}
                    style={styles.skillBadge}
                  >
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.skillsContainer}>
          {skillsData.items?.map((skill, index) => (
            <Text key={index} style={styles.skillBadge}>
              {skill}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// Projects Component
const PDFProjects: React.FC<SectionComponentProps> = ({
  data,
  styles,
  settings,
}) => {
  const projectsData = data as ProjectsData;
  const showTechnologies = settings?.showTechnologies ?? true;
  const showLink = settings?.showLink ?? true;
  const showBullets = settings?.showBullets ?? true;
  const showPeriod = settings?.showPeriod ?? false;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projectsData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.projectItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.projectName}>{item.name}</Text>
            {showPeriod && (
              <Text style={styles.experienceDate}>
                {item.date ||
                  [
                    formatDate(item.startDate || null),
                    formatDate(item.endDate || null),
                  ]
                    .filter(Boolean)
                    .join(" - ")}
              </Text>
            )}
          </View>
          {item.subtitle && (
            <Text style={styles.projectSubtitle}>{item.subtitle}</Text>
          )}
          {item.description && (
            <Text style={styles.paragraph}>{item.description}</Text>
          )}
          {showTechnologies &&
            item.technologies &&
            item.technologies.length > 0 && (
              <Text style={styles.inlineMeta}>
                {item.technologies.join(" • ")}
              </Text>
            )}
          {showLink && item.link && (
            <Text style={styles.inlineMeta}>{item.link}</Text>
          )}
          {showBullets && item.bullets && item.bullets.length > 0 && (
            <View style={styles.bulletList}>
              {item.bullets.map((bullet, bulletIndex) => (
                <View
                  key={`${item.id ?? index}-bullet-${bulletIndex}`}
                  style={styles.bulletItem}
                >
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

// Main PDF Document Component
interface ResumePDFDocumentProps {
  data: ResumeData;
}

const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ data }) => {
  const { sections, style, sectionOrder, sectionSettings } = data;
  const styles = createStyles(style);
  const settingsMap: SectionSettingsMap | undefined = sectionSettings;

  const orderedSections = sectionOrder?.length
    ? sectionOrder
        .map((id) => sections.find((section) => section.id === id))
        .filter((section): section is Section => Boolean(section))
    : sections;

  const renderSection = (section: Section): React.ReactNode => {
    const settings = settingsMap?.[section.type] || settingsMap?.[section.id];
    switch (section.type) {
      case "header":
        return (
          <PDFHeader
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "summary":
        return (
          <PDFSummary
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "experience":
        return (
          <PDFExperience
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "education":
        return (
          <PDFEducation
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "skills":
        return (
          <PDFSkills
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "projects":
        return (
          <PDFProjects
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {orderedSections.map(renderSection)}
      </Page>
    </Document>
  );
};

export default ResumePDFDocument;
