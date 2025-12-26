import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

// Define styles matching the single-column academic template
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Times-Roman",
    fontSize: 10,
    lineHeight: 1.5,
  },
  // --- HEADER SECTIONS ---
  header: {
    flexDirection: "column",
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    flexShrink: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Helvetica",
    color: "#2563EB", // Blue-600
    textTransform: "uppercase",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
    width: "100%",
  },
  contactText: {
    fontSize: 10,
    color: "#374151", // Gray-700
    marginHorizontal: 2,
  },
  link: {
    color: "#2563EB",
    textDecoration: "none",
    marginHorizontal: 2,
  },
  separator: {
    marginHorizontal: 4,
    color: "#9CA3AF",
    fontSize: 10,
  },

  // --- SECTIONS ---
  section: {
    marginBottom: 15,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "Helvetica",
    color: "#2563EB",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#2563EB",
    marginBottom: 8,
    paddingBottom: 2,
  },

  // --- EDUCATION ---
  eduItem: {
    marginBottom: 8,
    flexWrap: "wrap",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  boldText: {
    fontWeight: 700,
    color: "#111827",
  },
  italicText: {
    fontStyle: "italic",
    color: "#4B5563",
  },
  dateText: {
    fontStyle: "italic",
    color: "#4B5563",
    textAlign: "right",
    minWidth: 80,
  },

  // --- LISTS & SKILLS ---
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 5,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
  },
});

const ResumePDF = ({ data }) => {
  // Safe check to prevent crash if data is loading
  if (!data)
    return (
      <Document>
        <Page>
          <Text>Loading...</Text>
        </Page>
      </Document>
    );

  return (
    <Document title={data.name || "Resume"}>
      <Page size="A4" style={styles.page}>
        {/* Header Container */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>

          {/* Contact Row 1: Email | Phone | Location */}
          <View style={styles.contactRow}>
            {data.contact?.email && (
              <>
                <Link src={`mailto:${data.contact.email}`} style={styles.link}>
                  {data.contact.email}
                </Link>
                {(data.contact?.phone || data.contact?.location) && (
                  <Text style={styles.separator}>|</Text>
                )}
              </>
            )}
            {data.contact?.phone && (
              <>
                <Text style={styles.contactText}>{data.contact.phone}</Text>
                {data.contact?.location && (
                  <Text style={styles.separator}>|</Text>
                )}
              </>
            )}
            {data.contact?.location && (
              <Text style={styles.contactText}>{data.contact.location}</Text>
            )}
          </View>

          {/* Contact Row 2: Website | LinkedIn | GitHub */}
          <View style={styles.contactRow}>
            {data.contact?.website && (
              <>
                <Link
                  src={
                    data.contact.website.startsWith("http")
                      ? data.contact.website
                      : `https://${data.contact.website}`
                  }
                  style={styles.link}
                >
                  Portfolio
                </Link>
                <Text style={styles.separator}>|</Text>
              </>
            )}
            {data.contact?.linkedin && (
              <>
                <Link
                  src={
                    data.contact.linkedin.startsWith("http")
                      ? data.contact.linkedin
                      : `https://${data.contact.linkedin}`
                  }
                  style={styles.link}
                >
                  LinkedIn
                </Link>
                <Text style={styles.separator}>|</Text>
              </>
            )}
            {data.contact?.github && (
              <Link
                src={
                  data.contact.github.startsWith("http")
                    ? data.contact.github
                    : `https://${data.contact.github}`
                }
                style={styles.link}
              >
                GitHub
              </Link>
            )}
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education?.map((edu, index) => (
            <View key={index} style={styles.eduItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldText}>
                  {edu.degree}{" "}
                  <Text style={{ fontWeight: 400 }}>| {edu.institution}</Text>
                </Text>
                <Text style={styles.dateText}>{edu.date}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.contactText}>{edu.details}</Text>
                {edu.cgpa && <Text style={styles.contactText}>{edu.cgpa}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Technical Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {data.skills &&
            Object.entries(data.skills).map(([category, skills], index) =>
              // Only render if there are skills in this category
              skills ? (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletContent}>
                    <Text style={styles.boldText}>{category}: </Text>
                    {skills}
                  </Text>
                </View>
              ) : null
            )}
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects?.map((project, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldText}>
                  {project.title}{" "}
                  <Text style={styles.italicText}>| {project.subtitle}</Text>
                </Text>
                <Text style={styles.dateText}>{project.date}</Text>
              </View>
              {project.link && (
                <Link
                  src={project.link}
                  style={[styles.link, { fontSize: 9, marginBottom: 2 }]}
                >
                  View Project
                </Link>
              )}
              {project.points?.map((point, idx) => (
                <View key={idx} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletContent}>{point}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDF;
