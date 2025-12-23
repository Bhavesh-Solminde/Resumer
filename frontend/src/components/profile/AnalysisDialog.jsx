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

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

const AnalysisDialog = ({ selectedScan, setSelectedScan }) => {
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
        <DialogFooter>
          {selectedScan?.pdfUrl && (
            <Button asChild>
              <a
                href={selectedScan.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Original PDF
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
