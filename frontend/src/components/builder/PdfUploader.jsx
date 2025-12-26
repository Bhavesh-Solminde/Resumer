import React, { useState } from "react";
import { Upload, Loader2, Check, FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Worker Setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PDFUploader = ({ onTextExtracted }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setIsSuccess(false);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        onTextExtracted(fullText);
        setIsSuccess(true);
      } catch (error) {
        console.error("Error parsing PDF:", error);
      } finally {
        setIsParsing(false);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative group cursor-pointer">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isParsing}
      />

      {isParsing ? (
        <>
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Extracting data...</p>
        </>
      ) : isSuccess ? (
        <>
          <Check className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-sm font-medium text-foreground">
            Uploaded: {fileName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
        </>
      ) : (
        <>
          <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
          <p className="text-sm font-medium text-foreground">
            {fileName || "Drop Resume PDF"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Auto-fill form from PDF
          </p>
        </>
      )}
    </div>
  );
};

export default PDFUploader;
