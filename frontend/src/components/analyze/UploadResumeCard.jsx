import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Upload, FileText } from "lucide-react";

const UploadResumeCard = memo(
  ({
    analysisResult,
    lastScan,
    showUpload,
    setShowUpload,
    handleResumeAnalysis,
    selectedFile,
    setSelectedFile,
    isLoading,
  }) => {
    if (analysisResult) return null;
    if (lastScan && !showUpload) return null;

    return (
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors relative">
        {lastScan && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpload(false)}
            >
              Cancel
            </Button>
          </div>
        )}
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>Supported format: PDF (Max 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleResumeAnalysis}
            className="flex flex-col items-center gap-6 py-8"
          >
            <div className="relative group cursor-pointer w-full max-w-md">
              <input
                type="file"
                name="resume"
                accept=".pdf"
                id="resume-upload"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-muted rounded-xl bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center text-primary">
                    <FileText size={48} className="mb-4" />
                    <span className="font-medium text-lg">
                      {selectedFile.name}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Click to change file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload size={48} className="mb-4" />
                    <span className="font-medium text-lg">
                      Click to upload PDF
                    </span>
                    <span className="text-sm mt-1">or drag and drop here</span>
                  </div>
                )}
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !selectedFile}
              className="w-full max-w-xs"
            >
              {isLoading ? <>Analyzing...</> : <>Analyze Resume</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

export default UploadResumeCard;
