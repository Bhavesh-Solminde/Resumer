import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";

const SecurityCard = ({ formData, handleInputChange, handlePasswordSave }) => {
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
