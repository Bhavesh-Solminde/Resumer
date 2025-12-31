import React, { memo, lazy, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

interface AnalysisResultData {
  summary?: string;
  key_skills?: string[];
  missing_keywords?: string[];
  formatting_issues?: string[];
  actionable_feedback?: string[];
}

interface LastScan {
  atsScore: number;
  createdAt: string;
  analysisResult?: AnalysisResultData;
}

interface AnalysisResult {
  data?: unknown;
  resumeText?: string;
}

interface PreviousScanCardProps {
  lastScan: LastScan | null;
  showUpload: boolean;
  setShowUpload: (show: boolean) => void;
  showFullHistory: boolean;
  setShowFullHistory: (show: boolean) => void;
  analysisResult: AnalysisResult | null;
}

const PreviousScanCard: React.FC<PreviousScanCardProps> = memo(
  ({
    lastScan,
    showUpload,
    setShowUpload,
    showFullHistory,
    setShowFullHistory,
    analysisResult,
  }) => {
    const navigate = useNavigate();

    if (analysisResult) return null;
    if (!lastScan || showUpload) return null;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Previous Scan Result</CardTitle>
            <CardDescription>
              Scanned on {new Date(lastScan.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="text-5xl font-bold text-primary">
              {lastScan.atsScore}/100
            </div>
            <p className="text-muted-foreground max-w-md text-center">
              {lastScan.analysisResult?.summary}
            </p>

            <div className="flex flex-wrap gap-3 justify-center w-full mt-4">
              <Button
                variant="outline"
                onClick={() => setShowFullHistory(!showFullHistory)}
              >
                {showFullHistory ? "Hide Full Analysis" : "View Full Analysis"}
              </Button>
              <Button onClick={() => setShowUpload(true)}>
                Re-analyse | Upload Resume
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center w-full">
              <Button
                variant="secondary"
                onClick={() => navigate("/resume/optimize")}
                className="gap-2"
              >
                <Sparkles size={16} /> Optimize
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/resume/optimize")}
                className="gap-2"
              >
                <Briefcase size={16} /> Optimize acc to JD
              </Button>
            </div>
          </CardContent>
        </Card>

        {showFullHistory && lastScan.analysisResult && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <ResumeAnalysisDisplay
              data={{
                score: lastScan.atsScore,
                summary: lastScan.analysisResult.summary || "",
                key_skills: lastScan.analysisResult.key_skills || [],
                missing_keywords:
                  lastScan.analysisResult.missing_keywords || [],
                formatting_issues:
                  lastScan.analysisResult.formatting_issues || [],
                actionable_feedback:
                  lastScan.analysisResult.actionable_feedback || [],
              }}
            />
          </Suspense>
        )}
      </div>
    );
  }
);

PreviousScanCard.displayName = "PreviousScanCard";

export default PreviousScanCard;
