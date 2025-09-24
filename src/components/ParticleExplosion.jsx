import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleExplosion = ({ trigger, x = 50, y = 50, color = '#A74EA7' }) => {
  const [particles, setParticles] = useState([]);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (trigger) {
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400,
        size: Math.random() * 8 + 4,
        color: color,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.2
      }));

      setParticles(newParticles);
      setShowExplosion(true);

      // Clean up after animation
      setTimeout(() => {
        setShowExplosion(false);
        setParticles([]);
      }, 2000);
    }
  }, [trigger, x, y, color]);

  return (
    <AnimatePresence>
      {showExplosion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                scale: 0,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                x: `${particle.x + particle.vx / 10}vw`,
                y: `${particle.y + particle.vy / 10}vh`,
                scale: [0, 1, 0],
                rotate: particle.rotation,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: particle.delay,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Central burst effect */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: `${x}vw`,
              top: `${y}vh`,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${color}66, transparent)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default ParticleExplosion;
