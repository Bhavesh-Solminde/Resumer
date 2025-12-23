import React, { lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

// Use Google Docs viewer for reliable PDF viewing across all Cloudinary URL types
const getViewablePdfUrl = (url) => {
  if (!url) return null;
  // Google Docs viewer can display any publicly accessible PDF
  return `https://docs.google.com/gview?url=${encodeURIComponent(
    url
  )}&embedded=true`;
};

// Helper to get a Cloudinary download URL with fl_attachment (no filename)
const getCloudinaryDownloadUrl = (url) => {
  if (!url) return null;
  if (url.includes("res.cloudinary.com")) {
    // Insert fl_attachment into the URL for download
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
};

const AnalysisDialog = ({ selectedScan, setSelectedScan }) => {
  const viewableUrl = getViewablePdfUrl(selectedScan?.pdfUrl);
  const downloadUrl = getCloudinaryDownloadUrl(selectedScan?.pdfUrl);

  return (
    <Dialog
      open={!!selectedScan}
      onOpenChange={(open) => !open && setSelectedScan(null)}
    >
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>{selectedScan?.originalName}</span>
            <Badge
              variant={
                selectedScan?.atsScore >= 80
                  ? "default"
                  : selectedScan?.atsScore >= 60
                  ? "secondary"
                  : "destructive"
              }
              className="ml-4"
            >
              Score: {selectedScan?.atsScore}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Scanned on{" "}
            {selectedScan &&
              new Date(selectedScan.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {selectedScan?.analysisResult && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <ResumeAnalysisDisplay
              data={{
                score: selectedScan.atsScore,
                ...selectedScan.analysisResult,
              }}
            />
          </Suspense>
        )}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {selectedScan?.pdfUrl && (
            <>
              <Button variant="outline" asChild>
                <a
                  href={downloadUrl}
                  download={selectedScan.originalName || "resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button asChild>
                <a href={viewableUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View PDF
                </a>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
