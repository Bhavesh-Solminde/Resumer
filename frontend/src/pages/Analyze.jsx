import React, { useState, useEffect, lazy, Suspense } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useHistoryStore } from "../store/History.store";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

// Import new components
import AnalyzeHeader from "../components/analyze/AnalyzeHeader";

const UploadResumeCard = lazy(() =>
  import("../components/analyze/UploadResumeCard")
);
const PreviousScanCard = lazy(() =>
  import("../components/analyze/PreviousScanCard")
);
const AnalysisResults = lazy(() =>
  import("../components/analyze/AnalysisResults")
);

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { resumeScanHistory, userResumeHistory, isLoadingHistory } =
    useHistoryStore();
  const [showUpload, setShowUpload] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    resumeScanHistory();
  }, [resumeScanHistory]);

  const lastScan = userResumeHistory?.[0];

  const handleResumeAnalysis = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);
    try {
      const response = await axiosInstance.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAnalysisResult(response?.data);
      // Keep loader for a moment to show 100%
      setTimeout(() => setIsLoading(false), 500);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setIsLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to analyze resume. Please try again."
      );
    }
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
      <MultiStepLoader loading={isLoading} />

      <AnalyzeHeader />

      <Suspense fallback={null}>
        <PreviousScanCard
          lastScan={lastScan}
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          showFullHistory={showFullHistory}
          setShowFullHistory={setShowFullHistory}
          analysisResult={analysisResult}
        />

        <UploadResumeCard
          analysisResult={analysisResult}
          lastScan={lastScan}
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          handleResumeAnalysis={handleResumeAnalysis}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isLoading={isLoading}
        />

        <AnalysisResults analysisResult={analysisResult} lastScan={lastScan} />
      </Suspense>
    </div>
  );
};

export default Analyze;
