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
import { Shield, Lock } from "lucide-react";

interface FormData {
  fullName?: string;
  email?: string;
  currentPassword: string;
  newPassword: string;
}

interface SecurityCardProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordSave: (e: FormEvent<HTMLFormElement>) => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({
  formData,
  handleInputChange,
  handlePasswordSave,
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> Security
        </CardTitle>
        <CardDescription>Update your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="pl-9 bg-background border-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="pl-9 bg-background border-input"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" variant="secondary">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
