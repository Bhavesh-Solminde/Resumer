import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useAuthStore } from "../store/Auth.store";
import { useHistoryStore } from "../store/History.store.js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import new components
import UserProfileCard from "../components/profile/UserProfileCard";
import EditProfileCard from "../components/profile/EditProfileCard";
import SecurityCard from "../components/profile/SecurityCard";
import ResumeHistoryGrid from "../components/profile/ResumeHistoryGrid";

const AnalysisDialog = lazy(() =>
  import("../components/profile/AnalysisDialog")
);

const Profile = () => {
  const { authUser, logout, updateProfile, updatePassword } = useAuthStore();
  const { isLoadingHistory, userResumeHistory, resumeScanHistory } =
    useHistoryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
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
    if (success) {
      setIsEditing(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    await updatePassword(formData.currentPassword, formData.newPassword);
    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Avatar file selected:", file);
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
        {/* Left Column: User Details & Settings */}
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
            setSelectedScan={setSelectedScan}
          />
        </div>
      </motion.div>

      {/* Analysis Details Dialog */}
      {selectedScan && (
        <Suspense fallback={null}>
          <AnalysisDialog
            selectedScan={selectedScan}
            setSelectedScan={setSelectedScan}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Profile;
