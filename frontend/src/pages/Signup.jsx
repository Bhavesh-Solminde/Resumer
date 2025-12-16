import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthLoader } from "@/components/ui/auth-loader";
import { useAuthStore } from "../store/Auth.store";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      navigate("/analyze");
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-md w-full mx-auto p-4 z-10">
        <Card className="border-neutral-800 bg-black/50 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-neutral-400">
              Enter your information to get started with Resumer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-neutral-300">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-neutral-200"
                disabled={isSigningUp}
              >
                {isSigningUp ? <AuthLoader /> : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
            <div className="text-sm text-center">
              <Link to="/" className="text-neutral-500 hover:text-neutral-300">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default Signup;
