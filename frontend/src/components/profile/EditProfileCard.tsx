import React, { FormEvent, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Mail, Save } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

interface EditProfileCardProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleProfileSave: (e: FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const EditProfileCard: React.FC<EditProfileCardProps> = ({
  formData,
  handleInputChange,
  handleProfileSave,
  isEditing,
  setIsEditing,
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-9 bg-background border-input"
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-9 bg-background border-input"
                disabled
              />
            </div>
          </div>

          <div className="pt-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-muted"
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfileCard;
