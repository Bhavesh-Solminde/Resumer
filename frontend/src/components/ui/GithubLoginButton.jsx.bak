import React from "react";
import { Github } from "lucide-react";

const GithubLoginButton = () => {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/github";
  };

  return (
    <button
      onClick={handleGithubLogin}
      className="group relative w-full flex justify-center py-2 px-4 border border-neutral-800 text-sm font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 transition-all duration-200"
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <Github className="h-5 w-5 text-white" />
      </span>
      Continue with GitHub
    </button>
  );
};

export default GithubLoginButton;
