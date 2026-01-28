import React, { useState, useEffect, lazy, Suspense, FormEvent } from "react";
import { useHistoryStore } from "../store/History.store";
import { MultiStepLoader } from "../components/ui/multi-step-loader";

// Import new components
import AnalyzeHeader from "../components/analyze/AnalyzeHeader";
import { useResumeStore } from "../store/Resume.store";

const UploadResumeCard = lazy(
  () => import("../components/analyze/UploadResumeCard")
);
const PreviousScanCard = lazy(
  () => import("../components/analyze/PreviousScanCard")
);
const AnalysisResults = lazy(
  () => import("../components/analyze/AnalysisResults")
);

// Type adapters for component compatibility
interface LastScan {
  atsScore: number;
  createdAt: string;
  analysisResult?: {
    summary?: string;
    key_skills?: string[];
    formatting_issues?: string[];
    actionable_feedback?: string[];
  };
}

const Analyze: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    isAnalyzing,
    analysisResult,
    handleResumeAnalysis: analyzeResume,
  } = useResumeStore();

  const { resumeScanHistory, userResumeHistory, isLoadingHistory } =
    useHistoryStore();
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [showFullHistory, setShowFullHistory] = useState<boolean>(false);

  useEffect(() => {
    resumeScanHistory();
  }, [resumeScanHistory]);

  // Convert store's last scan to component-expected format
  // IResumeScanSummary doesn't have analysisResult (it's a lightweight type)
  const rawLastScan = userResumeHistory?.[0];
  const lastScan: LastScan | null = rawLastScan
    ? {
        atsScore: rawLastScan.atsScore ?? 0,
        createdAt: rawLastScan.createdAt ?? "",
        // Note: Summary data is not available in the summary type
        // The full data is only loaded when viewing details
      }
    : null;

  const handleResumeAnalysisSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await analyzeResume(selectedFile);
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in duration-500 pb-24">
      <MultiStepLoader loading={isAnalyzing} />

      <AnalyzeHeader />

      <Suspense fallback={null}>
        <PreviousScanCard
          lastScan={lastScan}
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          showFullHistory={showFullHistory}
          setShowFullHistory={setShowFullHistory}
          analysisResult={
            analysisResult as { data?: unknown; resumeText?: string } | null
          }
        />

        <UploadResumeCard
          analysisResult={
            analysisResult as { data?: unknown; resumeText?: string } | null
          }
          lastScan={lastScan}
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          handleResumeAnalysis={handleResumeAnalysisSubmit}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isLoading={isAnalyzing}
        />

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AnalysisResults
          analysisResult={analysisResult as any}
          lastScan={lastScan}
        />
      </Suspense>
    </div>
  );
};

export default Analyze;
