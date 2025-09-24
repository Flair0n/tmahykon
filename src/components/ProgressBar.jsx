import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  // Get progress-based gradient with high contrast colors
  const getProgressGradient = () => {
    if (progress < 33) {
      return "linear-gradient(to top, #2d1b3d 0%, #6a2c6a 50%, #A74EA7 100%)";
    }
    if (progress < 66) {
      return "linear-gradient(to top, #6a2c6a 0%, #A74EA7 50%, #D866D8 100%)";
    }
    return "linear-gradient(to top, #A74EA7 0%, #D866D8 50%, #FF6BFF 100%)";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0a0a1a",
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
          background: getProgressGradient(),
          borderRadius: 0,
          boxShadow: "0 0 40px #D866D8AA, 0 0 80px #A74EA766",
          alignSelf: "flex-end",
        }}
      />
    </div>
  );
}
