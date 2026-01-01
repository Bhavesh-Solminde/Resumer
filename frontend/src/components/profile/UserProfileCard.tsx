import React, { RefObject, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { User, Camera, FileText, LogOut } from "lucide-react";

interface AuthUser {
  avatar?: string;
  fullName?: string;
  email?: string;
}

interface UserProfileCardProps {
  authUser: AuthUser | null;
  logout: () => void;
  resumeHistoryCount: number;
  handleAvatarClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  authUser,
  logout,
  resumeHistoryCount,
  handleAvatarClick,
  fileInputRef,
  handleAvatarChange,
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-md">
      <CardHeader className="relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative h-24 w-24">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
              {authUser?.avatar ? (
                <img
                  src={authUser.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm"
              title="Change Avatar"
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <div className="mt-10 text-center">
          <CardTitle className="text-2xl">{authUser?.fullName}</CardTitle>
          <CardDescription>{authUser?.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">Resumes Scanned</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <span className="text-xl font-bold">{resumeHistoryCount}</span>
        </div>
        <Button variant="destructive" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
