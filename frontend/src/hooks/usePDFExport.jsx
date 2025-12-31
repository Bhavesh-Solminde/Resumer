import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ResumePDFDocument from "../components/builder/pdf/ResumePDFDocument";
import toast from "react-hot-toast";

/**
 * Custom hook for exporting resume to PDF using the imperative blob API.
 * This approach is required by the project specification.
 */
export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(
    async (resumeData) => {
      if (isExporting) return;

      setIsExporting(true);
      const toastId = toast.loading("Generating PDF...");

      try {
        // 1. Create the document instance
        const doc = <ResumePDFDocument data={resumeData} />;

        // 2. Generate the blob using the imperative API
        const blob = await pdf(doc).toBlob();

        // 3. Get the file name from the resume data
        const headerSection = resumeData.sections.find(
          (section) => section.type === "header"
        );
        const firstName =
          headerSection?.data?.fullName?.split(" ")[0] || "Resume";
        const fileName = `resume_${firstName}_${
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
