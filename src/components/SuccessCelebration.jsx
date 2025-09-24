import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const SuccessCelebration = ({ show, onComplete }) => {
  const [stage, setStage] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (show) {
      setStage(1);
      
      // Stage progression
      const timer1 = setTimeout(() => setStage(2), 500);
      const timer2 = setTimeout(() => setStage(3), 1000);
      const timer3 = setTimeout(() => setShowFireworks(true), 1200);
      const timer4 = setTimeout(() => {
        setShowFireworks(false);
        setStage(4);
      }, 4000);
      const timer5 = setTimeout(() => {
        setStage(0);
        onComplete?.();
      }, 6000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(10, 10, 26, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Confetti */}
          {showFireworks && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={300}
              recycle={true}
              colors={['#A74EA7', '#D866D8', '#FF6BFF', '#C766C7', '#824F9F']}
            />
          )}

          {/* Success Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={stage >= 1 ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              boxShadow: '0 0 40px rgba(76, 175, 80, 0.5)'
            }}
          >
            <motion.svg
              width="60"
              height="45"
              viewBox="0 0 60 45"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={stage >= 2 ? { pathLength: 1 } : {}}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <motion.path
                d="M10 22L25 37L50 8"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>

          {/* Success Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              color: '#ffffff',
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #A74EA7, #D866D8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Success!
          </motion.h1>

          {/* Success Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              color: '#e2e8f0',
              fontSize: '20px',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: '1.6',
              marginBottom: '40px'
            }}
          >
            🎉 Your registration has been submitted successfully! 
            <br />
            Payment confirmed and you're all set for the TMA-Hykon Innovation Challenge!
          </motion.p>

          {/* Animated Rings */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={stage >= 1 ? {
                scale: [0, 2, 3],
                opacity: [0.8, 0.4, 0]
              } : {}}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                border: '3px solid #A74EA7',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Floating Particles */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: '50vw', 
                y: '50vh', 
                scale: 0,
                opacity: 0
              }}
              animate={stage >= 3 ? {
                x: `${50 + Math.cos(i * 30 * Math.PI / 180) * 30}vw`,
                y: `${50 + Math.sin(i * 30 * Math.PI / 180) * 30}vh`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360]
              } : {}}
              transition={{
                duration: 3,
                delay: 0.8 + i * 0.1,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                background: `linear-gradient(45deg, #A74EA7, #D866D8)`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Pulsing Background Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={stage >= 1 ? {
              scale: [0, 1.5, 1],
              opacity: [0, 0.3, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, #A74EA733, transparent)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessCelebration;
