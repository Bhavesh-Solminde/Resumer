import React, { memo, FormEvent, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Upload, FileText } from "lucide-react";

interface AnalysisResult {
  data?: unknown;
  resumeText?: string;
}

interface LastScan {
  atsScore: number;
  createdAt: string;
  analysisResult?: {
    summary?: string;
    key_skills?: string[];
    missing_keywords?: string[];
    formatting_issues?: string[];
    actionable_feedback?: string[];
  };
}

interface UploadResumeCardProps {
  analysisResult: AnalysisResult | null;
  lastScan: LastScan | null;
  showUpload: boolean;
  setShowUpload: (show: boolean) => void;
  handleResumeAnalysis: (e: FormEvent<HTMLFormElement>) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isLoading: boolean;
}

const UploadResumeCard: React.FC<UploadResumeCardProps> = memo(
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setSelectedFile(files && files.length > 0 ? files[0] : null);
    };

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
                onChange={handleFileChange}
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

UploadResumeCard.displayName = "UploadResumeCard";

export default UploadResumeCard;
