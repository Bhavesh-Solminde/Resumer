import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/Auth.store";
import { useHistoryStore } from "../store/History.store";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FileText, Sparkles, Loader2 } from "lucide-react";

// Import components
import UserProfileCard from "../components/profile/UserProfileCard";
import EditProfileCard from "../components/profile/EditProfileCard";
import SecurityCard from "../components/profile/SecurityCard";
import HistoryCard from "../components/profile/HistoryCard";

// Lazy load the heavy dialog
const AnalysisDialog = lazy(
  () => import("../components/profile/AnalysisDialog")
);

interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

interface ScanData {
  _id: string;
  originalName: string;
  atsScore: number;
  createdAt: string;
  pdfUrl?: string;
  analysisResult?: {
    summary?: string;
    key_skills?: string[];
    formatting_issues?: string[];
    actionable_feedback?: string[];
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { authUser, logout, updateProfile, updatePassword } = useAuthStore();

  // Get new actions and state from HistoryStore
  const {
    isLoadingAnalysis,
    isLoadingOptimization,
    analysisHistory,
    optimizationHistory,
    fetchAnalysisHistory,
    fetchOptimizationHistory,
    fetchScanDetails,
    selectedScan: rawSelectedScan,
    isLoadingDetails,
    clearSelectedScan,
    deleteScan,
  } = useHistoryStore();

  // Combine history counts for stats
  const totalHistoryCount = (analysisHistory?.length || 0) + (optimizationHistory?.length || 0);

  // Helper to safely extract analysis result properties
  const extractAnalysisResult = (
    result: unknown
  ): ScanData["analysisResult"] => {
    if (!result || typeof result !== "object") return undefined;
    const r = result as Record<string, unknown>;
    return {
      summary: typeof r.summary === "string" ? r.summary : undefined,
      key_skills: Array.isArray(r.key_skills) ? r.key_skills : undefined,
      formatting_issues: Array.isArray(r.formatting_issues)
        ? r.formatting_issues
        : undefined,
      actionable_feedback: Array.isArray(r.actionable_feedback)
        ? r.actionable_feedback
        : undefined,
    };
  };

  const selectedScan: ScanData | null = rawSelectedScan
    ? {
        _id: rawSelectedScan._id,
        originalName: rawSelectedScan.originalName,
        atsScore: rawSelectedScan.atsScore ?? 0,
        createdAt: rawSelectedScan.createdAt ?? "",
        pdfUrl: rawSelectedScan.pdfUrl ?? undefined,
        analysisResult: extractAnalysisResult(rawSelectedScan.analysisResult),
      }
    : null;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Local boolean to control Dialog visibility while data is being fetched
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch both histories on mount
  useEffect(() => {
    fetchAnalysisHistory();
    fetchOptimizationHistory();
  }, [fetchAnalysisHistory, fetchOptimizationHistory]);

  // Form State
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // Update formData when authUser changes (e.g. after initial load)
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.fullName || "",
        email: authUser.email || "",
      }));
    }
  }, [authUser]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await updateProfile({ fullName: formData.fullName });
    if (success) setIsEditing(false);
  };

  const handlePasswordSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updatePassword(formData.currentPassword, formData.newPassword);
    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("Avatar file selected:", file);
  };

  // Handler for clicking a history item
  const handleScanClick = async (scanId: string) => {
    // Cancel any pending clear operation
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
    setIsDialogOpen(true); // Open Modal immediately (it will show loading)
    await fetchScanDetails(scanId); // Trigger heavy fetch
  };

  // Handler for closing the dialog
  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      clearTimeoutRef.current = setTimeout(() => {
        clearSelectedScan();
        clearTimeoutRef.current = null;
      }, 300);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Left Column */}
        <div className="w-full md:w-1/3 space-y-6">
          <UserProfileCard
            authUser={authUser}
            logout={logout}
            resumeHistoryCount={totalHistoryCount}
            handleAvatarClick={handleAvatarClick}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
          />
          <EditProfileCard
            formData={formData}
            handleInputChange={handleInputChange}
            handleProfileSave={handleProfileSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          <SecurityCard
            formData={formData}
            handleInputChange={handleInputChange}
            handlePasswordSave={handlePasswordSave}
          />
        </div>

        {/* Right Column: Resume History with Tabs */}
        <div className="w-full md:w-2/3 space-y-6">
          <Tabs defaultValue="analysis" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="analysis" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Analysis History
                </TabsTrigger>
                <TabsTrigger value="optimization" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Optimization History
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Analysis History Tab */}
            <TabsContent value="analysis">
              {isLoadingAnalysis ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : !analysisHistory || analysisHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No analysis history yet.</p>
                  <p className="text-sm">Upload a resume to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisHistory.map((item, i) => (
                    <HistoryCard
                      key={item._id}
                      item={{
                        _id: item._id,
                        originalName: item.originalName,
                        atsScore: item.atsScore,
                        createdAt: item.createdAt,
                        thumbnail: item.thumbnail,
                        type: item.type,
                      }}
                      cardType="analysis"
                      onClick={() => handleScanClick(item._id)}
                      onDelete={(id) => deleteScan(id, "analysis")}
                      isLarge={i === 0}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Optimization History Tab */}
            <TabsContent value="optimization">
              {isLoadingOptimization ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : !optimizationHistory || optimizationHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No optimization history yet.</p>
                  <p className="text-sm">Optimize a resume to see it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {optimizationHistory.map((item, i) => (
                    <HistoryCard
                      key={item._id}
                      item={{
                        _id: item._id,
                        originalName: item.originalName,
                        atsScore: item.atsScore,
                        createdAt: item.createdAt,
                        thumbnail: item.thumbnail,
                        type: item.type,
                      }}
                      cardType="optimization"
                      onClick={() => handleScanClick(item._id)}
                      onDelete={(id) => deleteScan(id, "optimization")}
                      onNavigate={() => navigate(`/resume/optimize?scanId=${item._id}`)}
                      isLarge={i === 0}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Analysis Details Dialog */}
      {isDialogOpen && (
        <Suspense fallback={null}>
          <AnalysisDialog
            open={isDialogOpen}
            onOpenChange={handleCloseDialog}
            data={selectedScan}
            isLoading={isLoadingDetails}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Profile;
