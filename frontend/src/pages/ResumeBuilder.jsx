import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useParams, Link } from "react-router-dom";
// FIX: Correct store filename import
import { useBuildStore } from "../store/Build.store.js";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  Save,
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion"; // Or "motion/react" if using v12+
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

// Lazy load builder components
const ResumeForm = lazy(() => import("../components/builder/ResumeForm"));
const ResumePreview = lazy(() => import("../components/builder/ResumePreview"));
const PdfUploader = lazy(() => import("../components/builder/PDFUploader"));

const ResumeBuilder = () => {
  const { id } = useParams();

  // Store Hooks
  const {
    formData,
    updateResumeState,
    initializeEditor,
    isFetching,
    isSaving,
  } = useBuildStore();

  // Local State for "Live Preview" (Debounced)
  const [pdfData, setPdfData] = useState(null);
  const [showPdf, setShowPdf] = useState(true);

  // Debounce Timer Ref
  const timerRef = useRef(null);

  // 1. Initialize Editor on Mount
  useEffect(() => {
    initializeEditor(id);
  }, [id, initializeEditor]);

  // 2. Sync Initial Data when Store loads
  useEffect(() => {
    if (!isFetching && formData) {
      setPdfData(formData);
    }
  }, [formData, isFetching]);

  // 3. Parallel Track Handler: Stores Data (Slow) & Updates Preview (Fast)
  const handleFormUpdate = useCallback(
    (newData) => {
      // Track A: Store -> LocalStorage -> Database (Auto-Save 2s)
      updateResumeState(newData);

      // Track B: Preview -> PDF Renderer (Debounce 0.5s)
      if (timerRef.current) clearTimeout(timerRef.current);
      setShowPdf(false); // Unmount PDF to prevent UI lag

      timerRef.current = setTimeout(() => {
        setPdfData(newData);
        setShowPdf(true); // Remount PDF
      }, 500);
    },
    [updateResumeState]
  );

  // 4. Handle Text Extracted from PDF Uploader
  const handleTextExtracted = (text) => {
    console.log("Extracted text for AI parsing:", text);
    // TODO: Connect to your Gemini AI Analyzer here to map 'text' -> 'formData'
    // toast.success("Resume uploaded! AI parsing coming soon.");
  };

  // Loading Screen (Full Page)
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">
            Setting up your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background flex flex-col font-sans">
      {/* --- HEADER --- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background border-b border-border px-6 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm/90 supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center gap-4">
          <Link to="/resume/analyze">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Builder
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              {formData?.name ? `Editing: ${formData.name}` : "Untitled Resume"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status Indicator */}
          <div className="flex items-center text-sm font-medium transition-colors">
            {isSaving ? (
              <span className="flex items-center text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-2" />
                Saved
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Actions */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button size="sm" onClick={() => updateResumeState(formData)}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </motion.header>

      {/* --- MAIN CONTENT --- */}
      {/* FIX: Increased max-width to allow split view to breathe */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 md:p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
          {/* LEFT COLUMN: FORM (Scrollable) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-20 scrollbar-hide"
          >
            {/* 1. PDF Uploader (Collapsible/Small) */}
            <Suspense
              fallback={
                <div className="h-24 bg-muted animate-pulse rounded-xl" />
              }
            >
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 transition-all hover:shadow-md">
                <PdfUploader onTextExtracted={handleTextExtracted} />
              </div>
            </Suspense>

            {/* 2. The Main Form */}
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-12 bg-muted animate-pulse rounded" />
                  <div className="h-64 bg-muted animate-pulse rounded" />
                </div>
              }
            >
              <div className="bg-card rounded-xl shadow-sm border border-border p-1">
                <ResumeForm data={formData} onUpdate={handleFormUpdate} />
              </div>
            </Suspense>
          </motion.div>

          {/* RIGHT COLUMN: PREVIEW (Sticky) */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block lg:col-span-7 h-full bg-muted/50 dark:bg-muted/10 rounded-xl border border-border relative overflow-hidden"
          >
            {showPdf && pdfData ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Rendering Preview...</p>
                  </div>
                }
              >
                {/* The Actual PDF Viewer Wrapper */}
                <ResumePreview data={pdfData} />
              </Suspense>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="bg-background/80 p-4 rounded-full shadow-sm mb-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-sm font-medium">Updating Preview...</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default ResumeBuilder;
