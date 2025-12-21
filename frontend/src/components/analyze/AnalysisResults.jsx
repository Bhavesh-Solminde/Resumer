import React, { memo, lazy, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumeAnalysisDisplay = lazy(() => import("../ResumeAnalysisDisplay"));

const AnalysisResults = memo(({ analysisResult, lastScan }) => {
  const navigate = useNavigate();

  if (!analysisResult) return null;

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
      <p>{analysisResult.resumeText}</p>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <ResumeAnalysisDisplay data={analysisResult.data} />
      </Suspense>

      {/* Optimization Actions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Ready to Optimize?</CardTitle>
          <CardDescription>
            Take your resume to the next level with our AI optimization tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
});

export default AnalysisResults;
