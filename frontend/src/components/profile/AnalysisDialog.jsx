import React from "react";
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
import { FileText, TrendingUp, LogOut, Shield } from "lucide-react";

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
          <div className="space-y-6 mt-4">
            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Summary
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {selectedScan.analysisResult.summary}
              </p>
            </div>

            {/* Key Skills */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" /> Key Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedScan.analysisResult.key_skills?.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-green-500/5 border-green-500/20 text-green-600"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" /> Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedScan.analysisResult.missing_keywords?.map(
                  (keyword, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-red-500/5 border-red-500/20 text-red-600"
                    >
                      {keyword}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Formatting Issues */}
            {selectedScan.analysisResult.formatting_issues?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-500" /> Formatting
                  Issues
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedScan.analysisResult.formatting_issues.map(
                    (issue, idx) => (
                      <li key={idx}>{issue}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Actionable Feedback */}
            {selectedScan.analysisResult.actionable_feedback?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" /> Actionable
                  Feedback
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedScan.analysisResult.actionable_feedback.map(
                    (feedback, idx) => (
                      <li key={idx}>{feedback}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
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
