import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AuthLoader } from "../components/ui/auth-loader";
import { useAuthStore } from "../store/Auth.store";
import GoogleLoginButton from "../components/ui/GoogleLoginButton";
import GithubLoginButton from "../components/ui/GithubLoginButton";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate("/resume/analyze");
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-md w-full mx-auto p-4 z-10">
        <Card className="border-neutral-800 bg-black/50 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-neutral-400">
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <AuthLoader /> : "Sign In"}
              </Button>
            </form>
            <div className="mt-5 space-y-3">
              <GoogleLoginButton />
              <GithubLoginButton />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-neutral-400">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="text-white hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};

export default Login;
