import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

const ResumeAnalysisDisplay = memo(({ data }) => {
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Score Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Resume Score</CardTitle>
          <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
            {data.score}/100
          </span>
        </CardHeader>
        <CardContent>
          <Progress value={data.score} className="h-4 w-full" />
          <p className="text-sm text-muted-foreground mt-2">{data.summary}</p>
        </CardContent>
      </Card>

      {/* 2. Skills Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Present Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle size={20} /> Detected Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.key_skills?.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
              >
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Missing Keywords (ATS Killers) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <XCircle size={20} /> Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.missing_keywords?.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
              >
                {keyword}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Actionable Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={20} /> Critical Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formatting Issues */}
          {data.formatting_issues?.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-900/50">
              <h4 className="font-semibold text-red-800 mb-2 dark:text-red-300">
                Formatting Errors:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                {data.formatting_issues?.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement Tips */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Steps to Improve:</h4>
            {data.actionable_feedback?.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 bg-gray-50 rounded-md dark:bg-muted/50"
              >
                <span className="font-bold text-primary mt-1">{i + 1}.</span>
                <p className="text-sm text-gray-700 leading-relaxed dark:text-muted-foreground">
                  {/* Simple cleanup for the markdown bold stars ** */}
                  {tip.replace(/\*\*/g, "")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default ResumeAnalysisDisplay;
