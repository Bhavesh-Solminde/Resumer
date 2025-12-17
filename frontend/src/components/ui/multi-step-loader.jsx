"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "./background-beams";

const loadingStates = [
  { text: "Uploading your resume..." },
  { text: "Parsing PDF content..." },
  { text: "Analyzing key skills..." },
  { text: "Checking formatting..." },
  { text: "Generating optimization tips..." },
  { text: "Finalizing report..." },
];

export const MultiStepLoader = ({ loading, duration = 2000 }) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        prevState === loadingStates.length - 1 ? prevState : prevState + 1
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, duration]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 w-full h-full bg-neutral-950 z-0" />
      <BackgroundBeams className="opacity-40" />

      <div className="relative z-20 flex flex-col items-center justify-center max-w-2xl px-4 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentState}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
              {loadingStates[currentState].text}
            </h2>
            <p className="text-neutral-500 text-sm md:text-base font-medium tracking-widest uppercase">
              Processing Data • Step {currentState + 1}/{loadingStates.length}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full max-w-xs h-1 bg-neutral-800 mt-12 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentState + 1) / loadingStates.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
          {/* Shimmer effect on progress bar */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};
