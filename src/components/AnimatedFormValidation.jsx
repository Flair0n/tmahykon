import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedFormValidation = ({ field, isValid, errorMessage, successMessage }) => {
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.8 }
  };

  return (
    <div style={{ position: 'relative', marginTop: '4px' }}>
      <AnimatePresence mode="wait">
        {isValid === true && (
          <motion.div
            key="success"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4CAF50',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <motion.div
              variants={iconVariants}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
            {successMessage || 'Valid'}
          </motion.div>
        )}

        {isValid === false && errorMessage && (
          <motion.div
            key="error"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FF5252',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <motion.div
              variants={iconVariants}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 5, -5, 0]
              }}
              transition={{
                scale: { duration: 0.3 },
                rotate: { duration: 0.5, repeat: 2 }
              }}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#FF5252',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <motion.path
                  d="M2 2L8 8M8 2L2 8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            </motion.div>
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated progress indicator */}
      <AnimatePresence>
        {isValid === null && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, #A74EA7, #D866D8)',
              borderRadius: '1px',
              marginTop: '4px',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedFormValidation;
