import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const loadingStates = [
  { text: "Uploading your resume..." },
  { text: "Parsing PDF content..." },
  { text: "Analyzing key skills..." },
  { text: "Checking formatting..." },
  { text: "Generating optimization tips..." },
  { text: "Finalizing report..." },
];

export const MultiStepLoader = ({ loading, duration = 2000 }) => {
  const [currentState, setCurrentState] = React.useState(0);

  React.useEffect(() => {
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
    <div className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-2xl bg-black/80">
      <div className="h-96 relative flex flex-col items-center justify-center">
        <div className="loader-container relative">
          {loadingStates.map((state, index) => {
            const distance = Math.abs(index - currentState);
            const opacity = Math.max(1 - distance * 0.2, 0); // Fade out distant states

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -(index * 40) }}
                animate={{ opacity: opacity, y: -(index * 40) }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "text-center font-bold text-2xl md:text-4xl transition-all duration-500",
                  index === currentState
                    ? "text-white scale-110"
                    : "text-neutral-500 scale-95 blur-sm"
                )}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display:
                    Math.abs(index - currentState) > 2 ? "none" : "block", // Hide far away items
                }}
              >
                {state.text}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-neutral-800 mt-24 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentState + 1) / loadingStates.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
