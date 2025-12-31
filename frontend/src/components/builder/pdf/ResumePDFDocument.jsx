import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts (using default for now, can extend later)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
// });

// Create styles
const createStyles = (theme) =>
  StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: theme.pageMargins * 15 + 20,
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
      marginBottom: theme.sectionSpacing * 6 + 8,
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
  });

// Header Component
const PDFHeader = ({ data, styles }) => (
  <View style={styles.header}>
    <Text style={styles.name}>{data.fullName || "Your Name"}</Text>
    <Text style={styles.title}>{data.title || "Professional Title"}</Text>
    <View style={styles.contactInfo}>
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.phone && <Text style={styles.contactItem}>• {data.phone}</Text>}
      {data.location && (
        <Text style={styles.contactItem}>• {data.location}</Text>
      )}
    </View>
  </View>
);

// Summary Component
const PDFSummary = ({ data, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Summary</Text>
    <Text style={styles.paragraph}>{data.content || ""}</Text>
  </View>
);

// Experience Component
const PDFExperience = ({ data, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Experience</Text>
    {data.items?.map((item, index) => (
      <View key={index} style={styles.experienceItem}>
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

// Education Component
const PDFEducation = ({ data, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Education</Text>
    {data.items?.map((item, index) => (
      <View key={index} style={styles.experienceItem}>
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

// Skills Component
const PDFSkills = ({ data, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{data.title || "Skills"}</Text>
    <View style={styles.skillsContainer}>
      {data.items?.map((skill, index) => (
        <Text key={index} style={styles.skillBadge}>
          {skill}
        </Text>
      ))}
    </View>
  </View>
);

// Projects Component
const PDFProjects = ({ data, styles }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Projects</Text>
    {data.items?.map((item, index) => (
      <View key={index} style={styles.projectItem}>
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

// Main PDF Document Component
const ResumePDFDocument = ({ data }) => {
  const { sections, theme } = data;
  const styles = createStyles(theme);

  const renderSection = (section) => {
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
