import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  ChangeEvent,
  FormEvent,
} from "react";
import { useAuthStore } from "../store/Auth.store";
import { useHistoryStore } from "../store/History.store";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

// Import components
import UserProfileCard from "../components/profile/UserProfileCard";
import EditProfileCard from "../components/profile/EditProfileCard";
import SecurityCard from "../components/profile/SecurityCard";
import ResumeHistoryGrid from "../components/profile/ResumeHistoryGrid";

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

// Type adapters for component compatibility
interface ResumeHistoryItem {
  _id: string;
  originalName: string;
  atsScore: number;
  createdAt: string;
  thumbnail?: string;
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
  const { authUser, logout, updateProfile, updatePassword } = useAuthStore();

  // Get new actions and state from HistoryStore
  const {
    isLoadingHistory,
    userResumeHistory: rawUserResumeHistory,
    resumeScanHistory,
    fetchScanDetails,
    selectedScan: rawSelectedScan,
    isLoadingDetails,
    clearSelectedScan,
  } = useHistoryStore();

  // Convert store types to component-expected types
  const userResumeHistory: ResumeHistoryItem[] | null = rawUserResumeHistory
    ? rawUserResumeHistory.map((item) => ({
        _id: item._id,
        originalName: item.originalName,
        atsScore: item.atsScore ?? 0,
        createdAt: item.createdAt ?? "",
        thumbnail: item.thumbnail ?? undefined,
      }))
    : null;

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

  useEffect(() => {
    resumeScanHistory();
  }, [resumeScanHistory]);

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
            resumeHistoryCount={(userResumeHistory || []).length}
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

        {/* Right Column: Resume History */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Scan History</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <ResumeHistoryGrid
            userResumeHistory={userResumeHistory}
            isLoading={isLoadingHistory}
            onScanClick={handleScanClick}
          />
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
