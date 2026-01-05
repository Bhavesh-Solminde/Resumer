import React, { useState } from "react";
import { useResumeStore } from "../store/Resume.store";
import { Button } from "../components/ui/button";
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
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

type TabType = "general" | "jd";

interface ComparisonItem {
  section: string;
  original_text: string;
  optimized_text: string;
  explanation?: string;
}

interface OptimizationResult {
  ats_score_before?: number;
  ats_score_after?: number;
  optimization_summary?: string;
  red_vs_green_comparison?: ComparisonItem[];
}

const Optimize: React.FC = () => {
  const {
    optimizeGeneral,
    optimizeJD,
    isOptimizing,
    optimizationResult,
    loadFakeData,
  } = useResumeStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  // Type assertion for optimizationResult since store type might be generic
  const result = optimizationResult as OptimizationResult | null;

  return (
    <div className="min-h-screen w-full bg-background antialiased relative overflow-hidden p-4 md:p-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">
          Optimize Your Resume
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg inline-flex border border-border">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "general"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
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
                  : "text-muted-foreground hover:text-foreground"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadFakeData}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Load Demo Data (Test)
                </Button>
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
                    Before Score
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Optimize;
