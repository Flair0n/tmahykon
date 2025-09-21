import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import styles from '../styles/App.module.css';

const StatusMessage = ({ status }) => {
  if (!status) return null;

  if (status.startsWith("✅")) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={styles.statusSuccess}
      >
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          numberOfPieces={200} 
          recycle={false} 
        />
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
        >
          <circle cx="30" cy="30" r="28" fill="#4CAF50" />
          <polyline
            points="18,32 27,41 43,23"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <span className={styles.statusSuccessText}>
          {status.replace(/^✅\s*/, "")}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.p
      initial={false}
      animate={status.includes("Error") ? { x: [0, -5, 5, -5, 5, 0] } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={styles.statusError}
    >
      {status}
    </motion.p>
  );
};

export default StatusMessage;