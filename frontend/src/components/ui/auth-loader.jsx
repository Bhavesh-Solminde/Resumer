import React from "react";
import { cn } from "../../lib/utils";

export const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>Processing...</span>
    </div>
  );
};

export const FullScreenAuthLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-indigo-500 opacity-20"></div>
          <div className="relative h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
        <p className="text-sm font-medium text-neutral-400 animate-pulse">
          Authenticating...
        </p>
      </div>
    </div>
  );
};
