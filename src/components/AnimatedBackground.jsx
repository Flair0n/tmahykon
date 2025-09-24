import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AnimatedBackground = () => {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Create floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0
          }}
          animate={{
            x: [`${particle.x}vw`, `${particle.x + 10}vw`, `${particle.x}vw`],
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, #A74EA7AA, transparent)`,
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}
      
      {/* Animated gradient orbs with parallax */}
      <motion.div
        style={{ 
          y: y1,
          position: 'absolute',
          top: '20%',
          left: `${10 + mousePosition.x * 0.02}%`,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, #A74EA733, transparent)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={{ 
          y: y2,
          position: 'absolute',
          top: '60%',
          right: `${15 + mousePosition.x * 0.01}%`,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, #D866D833, transparent)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Mouse follower orb */}
      <motion.div
        animate={{
          x: mousePosition.x + '%',
          y: mousePosition.y + '%',
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 20 },
          y: { type: "spring", stiffness: 50, damping: 20 },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, #A74EA722, transparent)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
