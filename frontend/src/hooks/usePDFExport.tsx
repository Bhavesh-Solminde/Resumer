import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ResumePDFDocument from "../components/builder/pdf/ResumePDFDocument";
import toast from "react-hot-toast";

// Theme interface matching ResumePDFDocument
interface Theme {
  pageMargins?: number;
  fontSize?: "small" | "medium" | "large";
  lineHeight?: number;
  primaryColor?: string;
  sectionSpacing?: number;
}

// Header data interface
interface HeaderData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
}

// Section data types
type SectionData =
  | HeaderData
  | { content?: string }
  | { items?: unknown[] }
  | { title?: string; items?: string[] };

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

/**
 * Custom hook for exporting resume to PDF using the imperative blob API.
 * This approach is required by the project specification.
 */
export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(
    async (resumeData: ResumeData) => {
      if (isExporting) return;

      setIsExporting(true);
      const toastId = toast.loading("Generating PDF...");

      try {
        // 1. Create the document instance
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = <ResumePDFDocument data={resumeData as any} />;

        // 2. Generate the blob using the imperative API
        const blob = await pdf(doc).toBlob();

        // 3. Get the file name from the resume data
        const headerSection = resumeData.sections.find(
          (section) => section.type === "header"
        );
        const headerData = headerSection?.data as HeaderData | undefined;
        const rawName = headerData?.fullName?.split(" ")[0] || "";
        // Sanitize: remove filesystem-invalid characters, trim, and truncate
        const sanitizedName =
          rawName
            .replace(/[/\\:*?"<>|]/g, "")
            .trim()
            .slice(0, 50) || "Resume";
        const fileName = `resume_${sanitizedName}_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        // 4. Trigger manual download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 5. Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);

        toast.success("PDF downloaded successfully!", { id: toastId });
      } catch (error) {
        console.error("PDF Export Error:", error);
        toast.error("Failed to generate PDF. Please try again.", {
          id: toastId,
        });
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting]
  );

  return { exportToPDF, isExporting };
};

export default usePDFExport;
