import React from 'react';
import styles from '../styles/App.module.css';

const PaymentSection = ({ paymentDone, handlePayment, status, isFormComplete }) => {
  return (
    <div className={styles.formActions}>
      {!paymentDone ? (
        <button
          type="button"
          className={styles.submitButton}
          onClick={handlePayment}
          disabled={!isFormComplete}
        >
          Pay & Submit Registration
        </button>
      ) : (
        <div className={styles.successMessage}>
          <p>✅ Registration completed successfully!</p>
          <p>Your payment has been verified and form submitted.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;