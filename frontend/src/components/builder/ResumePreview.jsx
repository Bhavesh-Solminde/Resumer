import React from "react";
import { PDFViewer } from "@react-pdf/renderer"; // <--- Comes from the library
import ResumePDF from "./ResumePDF"; // <--- Your PDF Design file

const ResumePreview = ({ data }) => {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center bg-gray-100/50 dark:bg-gray-900/50">
      <PDFViewer
        width="100%"
        height="100%"
        showToolbar={true}
        className="rounded-lg shadow-xl border border-border"
      >
        <ResumePDF data={data} />
      </PDFViewer>
    </div>
  );
};

export default ResumePreview;
