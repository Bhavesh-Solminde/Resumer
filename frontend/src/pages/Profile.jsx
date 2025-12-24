import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useAuthStore } from "../store/Auth.store";
import { useHistoryStore } from "../store/History.store.js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import components
import UserProfileCard from "../components/profile/UserProfileCard";
import EditProfileCard from "../components/profile/EditProfileCard";
import SecurityCard from "../components/profile/SecurityCard";
import ResumeHistoryGrid from "../components/profile/ResumeHistoryGrid";

// Lazy load the heavy dialog
const AnalysisDialog = lazy(() =>
  import("../components/profile/AnalysisDialog")
);

const Profile = () => {
  const { authUser, logout, updateProfile, updatePassword } = useAuthStore();

  // 1. Get new actions and state from HistoryStore
  const {
    isLoadingHistory,
    userResumeHistory,
    resumeScanHistory,
    fetchScanDetails, // <--- New Action
    selectedScan, // <--- New Heavy Data State
    isLoadingDetails, // <--- New Loading State
    clearSelectedScan, // <--- New Cleanup Action
  } = useHistoryStore();

  const [isEditing, setIsEditing] = useState(false);

  // We need a local boolean just to control the Dialog visibility
  // while the data is being fetched.
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    resumeScanHistory();
  }, [resumeScanHistory]);

  // Form State
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const success = await updateProfile({ fullName: formData.fullName });
    if (success) setIsEditing(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    await updatePassword(formData.currentPassword, formData.newPassword);
    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
  };

  const handleAvatarClick = () => fileInputRef.current.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) console.log("Avatar file selected:", file);
  };

  // --- NEW HANDLER: CLICKING A HISTORY ITEM ---
  const handleScanClick = async (scanId) => {
    setIsDialogOpen(true); // 1. Open Modal immediately (it will show loading)
    await fetchScanDetails(scanId); // 2. Trigger heavy fetch
  };

  // --- NEW HANDLER: CLOSING THE DIALOG ---
  const handleCloseDialog = (open) => {
    if (!open) {
      setIsDialogOpen(false);
      // Optional: clear data to save memory, or keep it for caching
      setTimeout(() => clearSelectedScan(), 300);
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
            // Pass the handler that triggers the fetch
            onScanClick={handleScanClick}
          />
        </div>
      </motion.div>

      {/* Analysis Details Dialog */}
      {/* We render it if the dialog is open. The Loading state is handled INSIDE the dialog now. */}
      {isDialogOpen && (
        <Suspense fallback={null}>
          <AnalysisDialog
            open={isDialogOpen}
            onOpenChange={handleCloseDialog}
            data={selectedScan} // Pass the heavy data (might be null initially)
            isLoading={isLoadingDetails} // Pass loading state so Dialog shows spinner
          />
        </Suspense>
      )}
    </div>
  );
};

export default Profile;
