import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResumeStore } from "../store/Resume.store";
import { useBuildStore } from "../store/Build.store";
import { useHistoryStore } from "../store/History.store";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import {
  Loader2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Briefcase,
  FileText,
  AlertTriangle,
  History,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import type { IOptimizationData } from "@resumer/shared-types";

// Extended type to include JD-specific fields
interface ExtendedOptimizationData extends IOptimizationData {
  critical_missing_skills?: string[];
  jd_keyword_match_percentage?: number;
  potential_score_increase?: number;
}

type TabType = "general" | "jd";

const Optimize: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const scanIdFromUrl = searchParams.get("scanId");

  const {
    optimizeGeneral,
    optimizeJD,
    isOptimizing,
    optimizationResultGeneral,
    optimizationResultJD,
    setOptimizationResult,
  } = useResumeStore();
  const { loadOptimizedResume, setSourceScanId } = useBuildStore();
  const { fetchScanDetails, selectedScan, isLoadingDetails, clearSelectedScan } = useHistoryStore();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [viewingHistory, setViewingHistory] = useState<boolean>(false);
  const [historyScanId, setHistoryScanId] = useState<string | null>(null);

  // Load historical scan if scanId is in URL
  useEffect(() => {
    if (scanIdFromUrl) {
      setViewingHistory(true);
      setHistoryScanId(scanIdFromUrl);
      fetchScanDetails(scanIdFromUrl);
    }
  }, [scanIdFromUrl, fetchScanDetails]);

  // When historical scan is loaded, transform it to optimization result format
  useEffect(() => {
    if (viewingHistory && selectedScan && selectedScan._id === historyScanId) {
      // Transform the historical scan's analysisResult to our optimization format
      const analysisResult = selectedScan.analysisResult as ExtendedOptimizationData;
      if (analysisResult) {
        setOptimizationResult(analysisResult);
      }
    }
  }, [selectedScan, viewingHistory, historyScanId, setOptimizationResult]);

  const handleClearHistory = () => {
    setViewingHistory(false);
    setHistoryScanId(null);
    clearSelectedScan();
    setSearchParams({});
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOptimize = () => {
    if (activeTab === "general") {
      optimizeGeneral();
    } else {
      optimizeJD(jobDescription);
    }
  };

  const handleBuildOptimizedResume = () => {
    if (result?.optimizedResume) {
      // Store the source scan ID for linking the build to this optimization
      if (historyScanId) {
        setSourceScanId(historyScanId);
      }
      loadOptimizedResume(result.optimizedResume);
      navigate("/resume/build");
    }
  };

  // Determine which result to show based on active tab
  const activeResult = activeTab === "general" ? optimizationResultGeneral : optimizationResultJD;
  
  // Type assertion for optimizationResult
  const result = activeResult as ExtendedOptimizationData | null;

  return (
    <div className="min-h-screen w-full bg-background antialiased relative overflow-hidden p-4 md:p-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">
          Optimize Your Resume
        </h1>

        {/* History Viewing Banner */}
        {viewingHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <div className="flex items-center justify-between gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Viewing Historical Optimization
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {selectedScan?.originalName} • {selectedScan?.createdAt ? new Date(selectedScan.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <X className="w-4 h-4 mr-1" />
                Run New Optimization
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading state for history */}
        {isLoadingDetails && viewingHistory && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg inline-flex border border-border">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "general"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                General Optimization
              </div>
            </button>
            <button
              onClick={() => setActiveTab("jd")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "jd"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Match Job Description
              </div>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="bg-card border-border backdrop-blur-sm">
            <CardContent className="pt-6">
              {activeTab === "jd" && (
                <div className="mb-6 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Paste Job Description
                  </label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[150px] bg-background border-input text-foreground focus:ring-ring"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleOptimize}
                  disabled={
                    isOptimizing ||
                    (activeTab === "jd" && !jobDescription.trim())
                  }
                  className="w-full md:w-auto min-w-[200px]"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      {activeTab === "general"
                        ? "Start General Optimization"
                        : "Optimize for this Job"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  The Optimization will be on your Lastest analysis of resume
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Area */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-20"
          >
            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Card className="bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-600 dark:text-red-400 text-lg">
                    {activeTab === "jd"
                      ? "Before Score (based on JD)"
                      : "Before Score"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-600 dark:text-red-500">
                    {result.ats_score_before || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-100 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-600 dark:text-green-400 text-lg">
                    After Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-500">
                    {result.ats_score_after || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Optimization Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {result.optimization_summary}
                </p>
              </CardContent>
            </Card>

            {/* Critical Missing Skills (JD optimization only) */}
            {activeTab === "jd" &&
              result.critical_missing_skills &&
              result.critical_missing_skills.length > 0 && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-amber-700 dark:text-amber-400 text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Skills Gap - Not in Your Resume
                      </CardTitle>
                      {result.potential_score_increase ? (
                        <div className="text-right">
                          <span className="block text-xs uppercase text-amber-600/80 font-bold tracking-wider mb-1">
                            Potential Score
                          </span>
                          <div className="flex items-baseline justify-end gap-2">
                            <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                              {Math.min(
                                100,
                                (result.ats_score_after || 0) +
                                  result.potential_score_increase,
                              )}
                            </span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                              +{result.potential_score_increase} pts
                            </Badge>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-600 dark:text-amber-500/80 text-sm mb-4">
                      The job description requires these skills, but they were
                      not found in your resume. Consider acquiring these skills
                      or highlighting relevant experience if you have it.
                    </p>
                    <div className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-relaxed">
                      {result.critical_missing_skills.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Comparison Grid */}
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold text-foreground text-center">
                Detailed Improvements
              </h2>

              {result.red_vs_green_comparison?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Original (Red) */}
                  <Card className="bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-red-600 dark:text-red-400/80 text-sm font-medium flex justify-between items-center">
                        <span>Original ({item.section})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {item.original_text}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Optimized (Green) */}
                  <Card className="bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30 h-full relative group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-600 dark:text-green-400/80 text-sm font-medium flex justify-between items-center">
                        <span>Optimized</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                          onClick={() => handleCopy(item.optimized_text, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {item.optimized_text}
                      </p>
                      {item.explanation && (
                        <p className="mt-3 text-xs text-green-600/80 dark:text-green-500/60 italic border-t border-green-200 dark:border-green-900/30 pt-2">
                          💡 {item.explanation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Build Optimized Resume Button */}
            {result.optimizedResume && (
              <div className="flex justify-center pt-8">
                <Button
                  size="lg"
                  onClick={handleBuildOptimizedResume}
                  className="gap-2 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <FileText className="h-5 w-5" />
                  Build the Optimized Resume
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Optimize;
