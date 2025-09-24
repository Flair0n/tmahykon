import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  // Constant color gradient for progress bar
  const getProgressGradient = () => {
    return "linear-gradient(to top, #A74EA7 0%, #D866D8 50%, #A74EA7 100%)";
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
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: `${progress}vh`, 
          opacity: 1,
          boxShadow: [
            "0 0 40px #D866D8AA, 0 0 80px #A74EA766",
            "0 0 60px #D866D8CC, 0 0 120px #A74EA788",
            "0 0 40px #D866D8AA, 0 0 80px #A74EA766"
          ]
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        style={{
          width: "100vw",
          background: getProgressGradient(),
          borderRadius: 0,
          alignSelf: "flex-end",
        }}
      />
    </div>
  );
}
