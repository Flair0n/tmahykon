import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  // Vertical gradient for progress
  const getGradient = () => {
    if (progress < 33) return "linear-gradient(to top, #FF5252, #FFB74D)";
    if (progress < 66) return "linear-gradient(to top, #FFB74D, #FFF176)";
    return "linear-gradient(to top, #81C784, #4CAF50)";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111343",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "stretch",
      }}
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${progress}vh` }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100vw",
          background: "linear-gradient(to top, #111343 0%, #212480 60%, #528FF0 100%)",
          borderRadius: 0,
          boxShadow: "0 0 32px #528FF099",
          alignSelf: "flex-end",
        }}
      />
    </div>
  );
}
