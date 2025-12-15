import React from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import ResumeAnalysisDisplay from "../components/ResumeAnalysisDisplay.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Sparkles, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analyze = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const navigate = useNavigate();

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
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your resume to get instant AI-powered feedback, scoring, and
          actionable optimization tips.
        </p>
      </div>

      {/* Upload Section */}
      {!analysisResult && (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
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
                  onChange={(e) => setSelectedFile(e.target.files[0])}
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
                      <span className="text-sm mt-1">
                        or drag and drop here
                      </span>
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
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-muted-foreground animate-pulse">
            Analyzing your resume with AI...
          </p>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8">
          <ResumeAnalysisDisplay data={analysisResult.data} />

          {/* Optimization Actions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Ready to Optimize?</CardTitle>
              <CardDescription>
                Take your resume to the next level with our AI optimization
                tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => navigate("/optimize")}
              >
                <Sparkles size={18} />
                General Optimization
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => navigate("/optimize")}
              >
                <Briefcase size={18} />
                Optimize for Job Description
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analyze;
