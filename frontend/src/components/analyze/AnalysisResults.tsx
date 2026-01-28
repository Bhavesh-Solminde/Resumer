import React, { memo, lazy, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, Briefcase, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumeStore } from "../../store/Resume.store";

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

interface AnalysisData {
  score: number;
  summary: string;
  key_skills: string[];
  formatting_issues: string[];
  actionable_feedback: string[];
}

interface AnalysisResult {
  data?: {
    analysis?: AnalysisData;
  } & Partial<AnalysisData>;
  resumeText?: string;
}

interface LastScan {
  atsScore: number;
  createdAt: string;
  analysisResult?: Partial<AnalysisData>;
}

interface AnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  lastScan: LastScan | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = memo(
  ({ analysisResult, lastScan }) => {
    const navigate = useNavigate();
    const { resetAnalysis } = useResumeStore();

    if (!analysisResult) return null;

    const analysisData: AnalysisData | undefined =
      analysisResult.data?.analysis ||
      (analysisResult.data as AnalysisData | undefined);

    return (
      <div className="space-y-8">
        {lastScan && (
          <div className="bg-muted/50 p-4 rounded-lg text-center border border-border animate-in fade-in slide-in-from-top-2">
            <p className="text-lg font-medium">
              Your last score was{" "}
              <span className="text-primary font-bold">
                {lastScan.atsScore}/100
              </span>
            </p>
          </div>
        )}
        {analysisResult.resumeText && <p>{analysisResult.resumeText}</p>}
        {analysisData && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <ResumeAnalysisDisplay data={analysisData} />
          </Suspense>
        )}

        {/* Optimization Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Ready to Optimize?</CardTitle>
            <CardDescription>
              Take your resume to the next level with our AI optimization tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => navigate("/resume/optimize")}
              >
                <Sparkles size={18} />
                General Optimization
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => navigate("/resume/optimize")}
              >
                <Briefcase size={18} />
                Optimize for Job Description
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full gap-2 text-muted-foreground hover:text-primary"
              onClick={resetAnalysis}
            >
              <RotateCcw size={16} />
              Scan Another Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
);

AnalysisResults.displayName = "AnalysisResults";

export default AnalysisResults;
