import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/App.module.css';

const PaymentSection = ({ paymentDone, handlePayment, retryPayment, status, isFormComplete }) => {
  // Check if payment failed, was cancelled, or abandoned
  const isPaymentFailed = status.includes("cancelled") || status.includes("verification failed") || status.includes("Failed to create") || status.includes("abandoned") || status.includes("expired");
  return (
    <motion.div 
      className={styles.formActions}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {!paymentDone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.button
            type="button"
            className={styles.submitButton}
            onClick={handlePayment}
            disabled={!isFormComplete}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Pay & Submit Registration
          </motion.button>
          
          {isPaymentFailed && (
            <motion.button
              type="button"
              className={styles.retryButton}
              onClick={retryPayment}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                marginLeft: '10px',
                background: '#B9AFD5',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Retry Payment
            </motion.button>
          )}
        </motion.div>
      ) : (
        null
      )}
    </motion.div>
  );
};

export default PaymentSection;