import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirects the browser to your Backend's Google Auth endpoint
    // The backend will handle the handshake and redirect back to /analyze with the token
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="group relative w-full flex justify-center py-2 px-4 border border-neutral-800 text-sm font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 transition-all duration-200"
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        {/* Google Icon SVG */}
        <img
          className="h-5 w-5"
          viewBox="0 0 24 24"
          src="\Google__G__logo.svg.webp"
          alt="G"
        />
      </span>
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
