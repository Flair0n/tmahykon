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
          Go to Payment
        </button>
      ) : (
        <button
          type="submit"
          className={styles.submitButton}
          disabled={status === "Submitting..."}
        >
          Submit Registration
        </button>
      )}
    </div>
  );
};

export default PaymentSection;