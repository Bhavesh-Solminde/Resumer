import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Target,
} from "lucide-react";

interface AnalysisData {
  score: number;
  summary: string;
  key_skills: string[];
  formatting_issues: string[];
  actionable_feedback: string[];
}

interface ResumeAnalysisDisplayProps {
  data: AnalysisData;
}

const ResumeAnalysisDisplay: React.FC<ResumeAnalysisDisplayProps> = memo(
  ({ data }) => {
    const getScoreColor = (score: number): string => {
      if (score >= 80) return "text-green-500";
      if (score >= 60) return "text-yellow-500";
      return "text-red-500";
    };

    const getProgressColor = (score: number): string => {
      if (score >= 80) return "bg-green-500";
      if (score >= 60) return "bg-yellow-500";
      return "bg-red-500";
    };

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div
                className={`text-4xl font-bold ${getScoreColor(data.score)}`}
              >
                {data.score}%
              </div>
              <div className="flex-1">
                <Progress
                  value={data.score}
                  className={`h-2 ${getProgressColor(data.score)}`}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{data.summary}</p>
          </CardContent>
        </Card>

        {/* Key Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Key Skills Found
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.key_skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Keywords - Removed as per new backend logic */}
        {/* Formatting Issues */}
        {data.formatting_issues.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Formatting Issues
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.formatting_issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actionable Feedback */}
        {data.actionable_feedback.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Actionable Feedback
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.actionable_feedback.map((feedback, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feedback}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

ResumeAnalysisDisplay.displayName = "ResumeAnalysisDisplay";

export default ResumeAnalysisDisplay;
