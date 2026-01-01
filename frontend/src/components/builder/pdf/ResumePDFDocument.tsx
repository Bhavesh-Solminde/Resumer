import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Style,
} from "@react-pdf/renderer";

// Theme interface
interface Theme {
  pageMargins?: number;
  fontSize?: "small" | "medium" | "large";
  lineHeight?: number;
  primaryColor?: string;
  sectionSpacing?: number;
}

// Data interfaces
interface HeaderData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface SummaryData {
  content?: string;
}

interface ExperienceItem {
  id?: string;
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
}

interface ExperienceData {
  items?: ExperienceItem[];
}

interface EducationItem {
  id?: string;
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

interface EducationData {
  items?: EducationItem[];
}

interface SkillsData {
  title?: string;
  items?: string[];
}

interface ProjectItem {
  id?: string;
  name?: string;
  date?: string;
  subtitle?: string;
  description?: string;
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
  theme: Theme;
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
  experienceItem: Style;
  experienceHeader: Style;
  experienceTitle: Style;
  experienceCompany: Style;
  experienceDate: Style;
  experienceLocation: Style;
  skillsContainer: Style;
  skillBadge: Style;
  projectItem: Style;
  projectName: Style;
  projectSubtitle: Style;
}

interface SectionComponentProps {
  data: SectionData;
  styles: PDFStyles;
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
const PDFExperience: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const experienceData = data as ExperienceData;
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
              <Text style={styles.experienceCompany}>{item.company}</Text>
            </View>
            <View>
              <Text style={styles.experienceDate}>
                {item.startDate} - {item.endDate}
              </Text>
              <Text style={styles.experienceLocation}>{item.location}</Text>
            </View>
          </View>
          <Text style={styles.paragraph}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
};

// Education Component
const PDFEducation: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const educationData = data as EducationData;
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
              <Text style={styles.experienceDate}>
                {item.startDate} - {item.endDate}
              </Text>
              <Text style={styles.experienceLocation}>{item.location}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

// Skills Component
const PDFSkills: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const skillsData = data as SkillsData;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{skillsData.title || "Skills"}</Text>
      <View style={styles.skillsContainer}>
        {skillsData.items?.map((skill, index) => (
          <Text key={index} style={styles.skillBadge}>
            {skill}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Projects Component
const PDFProjects: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const projectsData = data as ProjectsData;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projectsData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.projectItem}>
          <View style={styles.experienceHeader}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.experienceDate}>{item.date}</Text>
          </View>
          <Text style={styles.projectSubtitle}>{item.subtitle}</Text>
          <Text style={styles.paragraph}>{item.description}</Text>
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
  const { sections, theme } = data;
  const styles = createStyles(theme);

  const renderSection = (section: Section): React.ReactNode => {
    switch (section.type) {
      case "header":
        return (
          <PDFHeader key={section.id} data={section.data} styles={styles} />
        );
      case "summary":
        return (
          <PDFSummary key={section.id} data={section.data} styles={styles} />
        );
      case "experience":
        return (
          <PDFExperience key={section.id} data={section.data} styles={styles} />
        );
      case "education":
        return (
          <PDFEducation key={section.id} data={section.data} styles={styles} />
        );
      case "skills":
        return (
          <PDFSkills key={section.id} data={section.data} styles={styles} />
        );
      case "projects":
        return (
          <PDFProjects key={section.id} data={section.data} styles={styles} />
        );
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sections.map(renderSection)}
      </Page>
    </Document>
  );
};

export default ResumePDFDocument;
