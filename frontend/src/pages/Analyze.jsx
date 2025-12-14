import React from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import ResumeAnalysisDisplay from "../components/ResumeAnalysisDisplay.jsx";

const Analyze = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);

  const handleResumeAnalysis = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
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
      setAnalysisResult(response.data);
      setIsLoading(false);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setIsLoading(false);
      toast.error("Failed to analyze resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
          <p className="text-muted-foreground">
            Upload your resume to get instant AI-powered feedback and
            optimization tips.
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <form
            onSubmit={handleResumeAnalysis}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <input
              type="file"
              name="resume"
              accept=".pdf"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground animate-pulse">
              Analyzing your resume...
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <ResumeAnalysisDisplay data={analysisResult.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
