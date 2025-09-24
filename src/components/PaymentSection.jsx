import React from 'react';
import styles from '../styles/App.module.css';

const PaymentSection = ({ paymentDone, handlePayment, retryPayment, status, isFormComplete }) => {
  // Check if payment failed, was cancelled, or abandoned
  const isPaymentFailed = status.includes("cancelled") || status.includes("verification failed") || status.includes("Failed to create") || status.includes("abandoned") || status.includes("expired");
  
  return (
    <div className={styles.formActions}>
      {!paymentDone ? (
        <div>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handlePayment}
            disabled={!isFormComplete}
          >
            Pay & Submit Registration
          </button>
          
          {isPaymentFailed && (
            <button
              type="button"
              className={styles.retryButton}
              onClick={retryPayment}
              style={{
                marginLeft: '10px',
                background: '#f39c12',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Retry Payment
            </button>
          )}
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default PaymentSection;