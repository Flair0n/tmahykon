import React from 'react';
import { motion } from 'framer-motion';

const MorphingShapes = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* Morphing Blob 1 */}
      <motion.div
        animate={{
          d: [
            "M60,-60C80,-40,100,-20,100,0C100,20,80,40,60,60C40,80,20,100,0,100C-20,100,-40,80,-60,60C-80,40,-100,20,-100,0C-100,-20,-80,-40,-60,-60C-40,-80,-20,-100,0,-100C20,-100,40,-80,60,-60Z",
            "M80,-80C100,-60,120,-30,120,0C120,30,100,60,80,80C60,100,30,120,0,120C-30,120,-60,100,-80,80C-100,60,-120,30,-120,0C-120,-30,-100,-60,-80,-80C-60,-100,-30,-120,0,-120C30,-120,60,-100,80,-80Z",
            "M70,-70C90,-50,110,-25,110,0C110,25,90,50,70,70C50,90,25,110,0,110C-25,110,-50,90,-70,70C-90,50,-110,25,-110,0C-110,-25,-90,-50,-70,-70C-50,-90,-25,-110,0,-110C25,-110,50,-90,70,-70Z",
            "M60,-60C80,-40,100,-20,100,0C100,20,80,40,60,60C40,80,20,100,0,100C-20,100,-40,80,-60,60C-80,40,-100,20,-100,0C-100,-20,-80,-40,-60,-60C-40,-80,-20,-100,0,-100C20,-100,40,-80,60,-60Z"
          ],
          scale: [1, 1.2, 0.8, 1],
          rotate: [0, 180, 360],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(45deg, #A74EA722, #D866D822)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Morphing Blob 2 */}
      <motion.div
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "70% 30% 40% 60% / 40% 70% 60% 30%",
            "40% 70% 60% 30% / 70% 40% 50% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ],
          scale: [1, 1.3, 0.9, 1.1, 1],
          x: [0, 50, -30, 20, 0],
          y: [0, -20, 40, -10, 0],
          opacity: [0.2, 0.4, 0.1, 0.3, 0.2]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '70%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'linear-gradient(135deg, #824F9F33, #A74EA733)',
          filter: 'blur(50px)'
        }}
      />

      {/* Morphing Blob 3 */}
      <motion.div
        animate={{
          borderRadius: [
            "50% 50% 50% 50%",
            "80% 20% 60% 40%",
            "20% 80% 40% 60%",
            "60% 40% 80% 20%",
            "40% 60% 20% 80%",
            "50% 50% 50% 50%"
          ],
          scale: [1, 0.8, 1.4, 0.9, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.15, 0.35, 0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '40%',
          left: '80%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, #C766C722, transparent)',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Floating Geometric Shapes */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
          style={{
            position: 'absolute',
            top: `${20 + i * 10}%`,
            left: `${10 + i * 8}%`,
            width: `${20 + i * 5}px`,
            height: `${20 + i * 5}px`,
            background: `linear-gradient(${45 + i * 45}deg, #A74EA7${Math.floor(0.1 * 255).toString(16)}, transparent)`,
            borderRadius: i % 2 === 0 ? '50%' : '0%',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
};

export default MorphingShapes;
