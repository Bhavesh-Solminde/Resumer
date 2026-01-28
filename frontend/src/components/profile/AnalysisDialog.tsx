import React, { lazy, Suspense, MouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

interface AnalysisResult {
  summary?: string;
  key_skills?: string[];
  formatting_issues?: string[];
  actionable_feedback?: string[];
}

interface ScanData {
  _id: string;
  originalName: string;
  atsScore: number;
  createdAt: string;
  pdfUrl?: string;
  analysisResult?: AnalysisResult;
}

interface AnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ScanData | null;
  isLoading: boolean;
}

// Use Google Docs viewer for reliable PDF viewing across all Cloudinary URL types
const getViewablePdfUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  return `https://docs.google.com/gview?url=${encodeURIComponent(
    url
  )}&embedded=true`;
};

const AnalysisDialog: React.FC<AnalysisDialogProps> = ({
  open,
  onOpenChange,
  data,
  isLoading,
}) => {
  const scan = data;
  const viewableUrl = getViewablePdfUrl(scan?.pdfUrl);

  const handleDownload = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!scan?.pdfUrl) return;

    const toastId = toast.loading("Downloading...");

    try {
      const response = await fetch(scan.pdfUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      let fileName = scan.originalName || "resume.pdf";
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download complete", { id: toastId });
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Download failed. Opening in new tab...", { id: toastId });
      window.open(scan.pdfUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto min-h-[300px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            {isLoading || !scan ? (
              <span>Loading Analysis...</span>
            ) : (
              <>
                <span className="truncate pr-4">{scan.originalName}</span>
                <Badge
                  variant={
                    scan.atsScore >= 80
                      ? "default"
                      : scan.atsScore >= 60
                      ? "secondary"
                      : "destructive"
                  }
                  className="ml-4 shrink-0"
                >
                  Score: {scan.atsScore}
                </Badge>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLoading || !scan
              ? "Please wait while we fetch the details."
              : `Scanned on ${new Date(scan.createdAt).toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Fetching data...</p>
          </div>
        ) : !scan ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <p>Unable to load scan details.</p>
          </div>
        ) : (
          <>
            {scan.analysisResult && (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                }
              >
                <ResumeAnalysisDisplay
                  data={{
                    score: scan.atsScore,
                    summary: scan.analysisResult.summary || "",
                    key_skills: scan.analysisResult.key_skills || [],
                    formatting_issues:
                      scan.analysisResult.formatting_issues || [],
                    actionable_feedback:
                      scan.analysisResult.actionable_feedback || [],
                  }}
                />
              </Suspense>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
              {scan.pdfUrl && (
                <>
                  <Button variant="outline" asChild>
                    <a
                      onClick={handleDownload}
                      download={scan.originalName || "resume.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                  <Button asChild>
                    <a
                      href={viewableUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View PDF
                    </a>
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
