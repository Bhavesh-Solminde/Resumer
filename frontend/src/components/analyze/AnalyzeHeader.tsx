import React from "react";

const AnalyzeHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Upload your resume to get instant AI-powered feedback, scoring, and
        actionable optimization tips.
      </p>
    </div>
  );
};

export default AnalyzeHeader;
