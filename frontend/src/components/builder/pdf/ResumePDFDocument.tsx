import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { formatDate } from "../../../lib/dateUtils";
import type { IStyle, ITemplateTheme, ICertificationItem, IAchievementItem, IVolunteeringItem } from "@resumer/shared-types";
import { getTemplateTheme } from "@resumer/shared-types";

// Style type for react-pdf
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Style = any;

// Theme interface
type Theme = Partial<IStyle> & { fontSize?: number | string };

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
  position?: string;
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
  field?: string;
  institution?: string;
  startDate?: DateLike;
  endDate?: DateLike;
  location?: string;
  gpa?: string;
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
  githubLink?: string;
  liveLink?: string;
}

interface ProjectsData {
  items?: ProjectItem[];
}

interface CertificationsData {
  items?: Array<
    Omit<ICertificationItem, "date" | "expiryDate"> & {
      date?: DateLike;
      expiryDate?: DateLike;
      link?: string;
      url?: string;
      credentialUrl?: string;
    }
  >;
}

interface AchievementsData {
  items?: IAchievementItem[];
}

interface VolunteeringData {
  items?: IVolunteeringItem[];
}

type SectionData =
  | HeaderData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | ProjectsData
  | CertificationsData
  | AchievementsData
  | VolunteeringData;

interface Section {
  id: string;
  type:
    | "header"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "achievements"
    | "volunteering";
  data: SectionData;
}

interface ResumeData {
  sections: Section[];
  style: Theme;
  template?: string;
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
  linkText: Style;
  projectItem: Style;
  projectName: Style;
  projectSubtitle: Style;
}

interface SectionComponentProps {
  data: SectionData;
  styles: PDFStyles;
  settings?: Record<string, boolean>;
}

const pxToPt = (px: number) => px * 0.75;
const MM_TO_PT = 2.83465;

/** Ensure URL has a protocol prefix */
const ensureProtocol = (url: string): string =>
  url.startsWith("http") ? url : `https://${url}`;

const horizontalPaddingPx: Record<number, number> = {
  1: 24, // px-6
  2: 40, // px-10
  3: 56, // px-14
  4: 80, // px-20
};

const sectionSpacingPx: Record<number, number> = {
  1: 8, // space-y-2
  2: 16, // space-y-4
  3: 24, // space-y-6
  4: 32, // space-y-8
};

const resolveFontSizePt = (fontSize?: number | string): number => {
  if (typeof fontSize === "number") return fontSize;
  if (typeof fontSize === "string") {
    const parsed = parseFloat(fontSize);
    if (!Number.isNaN(parsed)) return parsed;
    const token = fontSize.toLowerCase();
    const legacyMap: Record<string, number> = {
      small: 10.5,
      medium: 11,
      large: 12.5,
    };
    return legacyMap[token] ?? 11;
  }
  return 11;
};

const resolveHorizontalPaddingPt = (pageMargins?: number): number => {
  if (typeof pageMargins !== "number") return pxToPt(40);
  if (pageMargins >= 10) return pageMargins * MM_TO_PT;
  const px = horizontalPaddingPx[pageMargins] ?? 40;
  return pxToPt(px);
};

const resolveSectionSpacingPt = (sectionSpacing?: number): number => {
  if (typeof sectionSpacing !== "number") return pxToPt(16);
  if (sectionSpacing > 5) return pxToPt(sectionSpacing);
  const px = sectionSpacingPx[sectionSpacing] ?? 16;
  return pxToPt(px);
};

// Web-safe font family mapping
// Maps editor fontFamily names to react-pdf compatible font names
const WEB_SAFE_FONTS: Record<string, string> = {
  "Inter": "Helvetica",
  "Arial": "Helvetica",
  "Helvetica": "Helvetica",
  "Times New Roman": "Times-Roman",
  "Times": "Times-Roman",
  "Georgia": "Times-Roman",
  "Courier New": "Courier",
  "Courier": "Courier",
  "Verdana": "Helvetica",
  "Tahoma": "Helvetica",
  "Trebuchet MS": "Helvetica",
};

const resolveFont = (fontFamily?: string): string => {
  if (!fontFamily) return "Helvetica";
  return WEB_SAFE_FONTS[fontFamily] || "Helvetica";
};

const createStyles = (theme: Theme, templateId: string = "basic"): PDFStyles => {
  // Get template theme from shared config
  const templateTheme: ITemplateTheme = getTemplateTheme(templateId);
  const colors = templateTheme.colors;
  const layout = templateTheme.layout;
  
  const headerAlign = layout.headerAlign;
  const isShraddha = templateId === "shraddha";
  const isModern = templateId === "modern";
  const isBasic = templateId === "basic";

  // Section headers and divider lines use style.primaryColor if set, otherwise template default
  const primaryColor = theme.primaryColor || colors.primary;
  
  // Resolve font from style.fontFamily
  const fontFamily = resolveFont(theme.fontFamily);

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      paddingHorizontal: resolveHorizontalPaddingPt(theme.pageMargins),
      paddingVertical: pxToPt(32),
      fontFamily: fontFamily,
      fontSize: resolveFontSizePt(theme.fontSize),
      lineHeight: theme.lineHeight || 1.5,
    },
    header: {
      textAlign: headerAlign,
      alignItems: headerAlign === "center" ? "center" : "flex-start",
      marginBottom: 16,
      // Border style based on template layout config
      borderBottomWidth: layout.headerBorderStyle === "bottom" ? 2 : 0,
      borderBottomColor: primaryColor,
      paddingBottom: layout.headerBorderStyle === "bottom" ? 12 : 0,
      // Modern has left border instead
      borderLeftWidth: layout.headerBorderStyle === "left" ? 4 : 0,
      borderLeftColor: layout.headerBorderStyle === "left" ? primaryColor : "transparent",
      paddingLeft: layout.headerBorderStyle === "left" ? 12 : 0,
    },
    name: {
      fontSize: isShraddha ? 24 : (isModern ? 26 : 22),
      fontWeight: "bold",
      fontFamily: fontFamily,
      color: "black",
      marginBottom: 6,
      textAlign: headerAlign,
      lineHeight: 1.2,
    },
    title: {
      fontSize: isModern ? 14 : 12,
      fontFamily: fontFamily,
      color: colors.muted,
      marginBottom: 10,
      textAlign: headerAlign,
      lineHeight: 1.3,
    },
    contactInfo: {
      flexDirection: "row",
      justifyContent: headerAlign === "center" ? "center" : "flex-start",
      flexWrap: "wrap",
      gap: 8,
      fontSize: 10,
      color: colors.muted,
    },
    contactItem: {
      marginHorizontal: 4,
    },
    section: {
      marginBottom: resolveSectionSpacingPt(theme.sectionSpacing),
    },
    sectionTitle: {
      fontSize: 10.5,
      fontWeight: "bold",
      fontFamily: fontFamily,
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 0.25,
      marginBottom: 8,
      padding: 0,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: primaryColor,
    },
    paragraph: {
      fontSize: 10,
      lineHeight: 1.5,
      color: colors.text,
    },
    bulletList: {
      marginTop: 4,
      marginLeft: 6,
      gap: 3,
    },
    bulletItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4,
    },
    bulletSymbol: {
      fontSize: 10,
      lineHeight: 1.4,
      color: colors.text,
    },
    bulletText: {
      fontSize: 10,
      lineHeight: 1.6,
      color: colors.text,
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
      color: colors.text,
    },
    experienceCompany: {
      fontSize: 10,
      color: isShraddha ? primaryColor : colors.text,
    },
    experienceDate: {
      fontSize: 9,
      color: colors.muted,
      textAlign: "right",
    },
    experienceLocation: {
      fontSize: 9,
      color: colors.muted,
      textAlign: "right",
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 2,
    },
    skillBadge: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      fontSize: 10,
      color: colors.text,
      backgroundColor: "transparent",
    },
    skillGroupTitle: {
      fontSize: 10,
      fontWeight: 700,
      color: primaryColor,
    },
    inlineMeta: {
      fontSize: 9,
      color: colors.muted,
      marginTop: 2,
    },
    linkText: {
      fontSize: 9,
      color: primaryColor,
      textDecoration: "none",
      marginTop: 2,
    },
    projectItem: {
      marginBottom: 10,
    },
    projectName: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.text,
    },
    projectSubtitle: {
      fontSize: 9,
      color: colors.muted,
      marginBottom: 4,
    },
  }) as PDFStyles;
};

// Header Component
const PDFHeader: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const headerData = data as HeaderData;
  
  // Build contact items array, then join with pipe separators
  const contactItems: string[] = [];
  if (headerData.email) contactItems.push(headerData.email);
  if (headerData.phone) contactItems.push(headerData.phone);
  if (headerData.location) contactItems.push(headerData.location);
  if (headerData.linkedin) contactItems.push(headerData.linkedin);
  if (headerData.website) contactItems.push(headerData.website);

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{headerData.fullName || "Your Name"}</Text>
      <Text style={styles.title}>
        {headerData.title || "Professional Title"}
      </Text>
      {contactItems.length > 0 && (
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>
            {contactItems.join("  |  ")}
          </Text>
        </View>
      )}
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
          wrap={false}
        >
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceTitle}>
                {item.position || item.title}
              </Text>
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
  const showInstitution = settings?.showInstitution ?? true;
  const showLocation = settings?.showLocation ?? true;
  const showPeriod = settings?.showPeriod ?? true;
  const showGPA = settings?.showGPA ?? true;
  const showDescription = settings?.showDescription ?? false;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {educationData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.experienceItem} wrap={false}>
          <View style={styles.experienceHeader}>
            <View>
              {showInstitution && (
                <Text style={styles.experienceTitle}>{item.institution}</Text>
              )}
              <Text style={styles.experienceCompany}>
                {item.degree}
                {item.field ? ` in ${item.field}` : ""}
              </Text>
              {showGPA && item.gpa && (
                <Text style={styles.inlineMeta}>GPA: {item.gpa}</Text>
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
  const categories = skillsData.categories || [];
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{skillsData.title || "Skills"}</Text>
      {categories.length > 0 ? (
        <View>
          {categories.map((category, index) => (
            <View key={`${category.name}-${index}`}>
              <View style={styles.skillsContainer}>
                <Text style={styles.paragraph}>
                  {category.isVisible !== false && (
                    <Text style={styles.skillGroupTitle}>{category.name}: </Text>
                  )}
                  {category.items?.join(", ")}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.skillsContainer}>
          <Text style={styles.paragraph}>
            {skillsData.items?.join(", ")}
          </Text>
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
        <View key={item.id || index} style={styles.projectItem} wrap={false}>
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
          {showLink && (item.githubLink || item.liveLink) && (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
              {item.githubLink && (
                <Link
                  src={ensureProtocol(item.githubLink)}
                  style={styles.linkText}
                >
                  GitHub
                </Link>
              )}
              {item.liveLink && (
                <Link
                  src={ensureProtocol(item.liveLink)}
                  style={styles.linkText}
                >
                  Live
                </Link>
              )}
            </View>
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

// Certifications Component
const PDFCertifications: React.FC<SectionComponentProps> = ({ data, styles, settings }) => {
  const certificationsData = data as CertificationsData;
  const showIssuer = settings?.showIssuer ?? true;
  const showDate = settings?.showDate ?? true;
  const showExpiryDate = settings?.showExpiryDate ?? true;
  const showCredentialId = settings?.showCredentialId ?? true;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {certificationsData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.experienceItem} wrap={false}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceTitle}>
                {item.name}
                {showIssuer && item.issuer ? ` | ${item.issuer}` : ""}
              </Text>
            </View>
            <View>
              {showDate && item.date && (
                <Text style={styles.experienceDate}>{formatDate(item.date)}</Text>
              )}
              {showExpiryDate && item.expiryDate && (
                <Text style={styles.experienceLocation}>
                  {formatDate(item.expiryDate)}
                </Text>
              )}
            </View>
          </View>
          {showCredentialId && item.credentialId && (
            <Text style={styles.inlineMeta}>
              Credential ID: {item.credentialId}
            </Text>
          )}
          {(item.credentialUrl || item.url || item.link) && (
            <Link
              src={ensureProtocol(item.credentialUrl || item.url || item.link || "")}
              style={styles.linkText}
            >
              Credential Link
            </Link>
          )}
        </View>
      ))}
    </View>
  );
};

// Achievements Component
const PDFAchievements: React.FC<SectionComponentProps> = ({ data, styles }) => {
  const achievementsData = data as AchievementsData;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <View style={styles.bulletList}>
        {achievementsData.items?.map((item, index) => (
          <View key={item.id || index} style={styles.bulletItem}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>
              {item.title}
              {item.description ? ` - ${item.description}` : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Volunteering Component
const PDFVolunteering: React.FC<SectionComponentProps> = ({ data, styles, settings }) => {
  const volunteeringData = data as VolunteeringData;
  const showOrganization = settings?.showOrganization ?? true;
  const showPeriod = settings?.showPeriod ?? true;
  const showDescription = settings?.showDescription ?? true;
  const showBullets = settings?.showBullets ?? true;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Volunteering</Text>
      {volunteeringData.items?.map((item, index) => (
        <View key={item.id || index} style={styles.experienceItem} wrap={false}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceTitle}>{item.title}</Text>
              {showOrganization && item.organization && (
                <Text style={styles.experienceCompany}>
                  {item.organization}
                </Text>
              )}
            </View>
            <View>
              {showPeriod && (item.startDate || item.endDate) && (
                <Text style={styles.experienceDate}>
                  {formatDate(item.startDate || null)}
                  {item.endDate ? ` - ${formatDate(item.endDate)}` : ""}
                </Text>
              )}
            </View>
          </View>
          {showDescription && item.description && (
            <Text style={styles.paragraph}>{item.description}</Text>
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
  const { sections, style, sectionOrder, sectionSettings, template } = data;
  const styles = createStyles(style, template);
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
      case "certifications":
        return (
          <PDFCertifications
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "achievements":
        return (
          <PDFAchievements
            key={section.id}
            data={section.data}
            styles={styles}
            settings={settings}
          />
        );
      case "volunteering":
        return (
          <PDFVolunteering
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
      <Page size="A4" style={styles.page} wrap>
        {orderedSections.map(renderSection)}
      </Page>
    </Document>
  );
};

export default ResumePDFDocument;
