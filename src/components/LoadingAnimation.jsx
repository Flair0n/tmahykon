import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ message = "Processing..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 10, 26, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Animated Logo/Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          width: '80px',
          height: '80px',
          border: '4px solid rgba(167, 78, 167, 0.3)',
          borderTop: '4px solid #A74EA7',
          borderRadius: '50%',
          marginBottom: '20px'
        }}
      />
      
      {/* Pulsing Dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            style={{
              width: '12px',
              height: '12px',
              background: '#A74EA7',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>
      
      {/* Animated Text */}
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '500',
          textAlign: 'center',
          margin: 0
        }}
      >
        {message}
      </motion.p>
      
      {/* Progress Bar */}
      <motion.div
        style={{
          width: '200px',
          height: '4px',
          background: 'rgba(167, 78, 167, 0.3)',
          borderRadius: '2px',
          marginTop: '20px',
          overflow: 'hidden'
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #A74EA7, transparent)',
            borderRadius: '2px'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingAnimation;
