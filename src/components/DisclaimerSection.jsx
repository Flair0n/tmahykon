import React from 'react';
import styles from '../styles/App.module.css';

const DisclaimerSection = () => {
  return (
    <div className={styles.disclaimer}>
      <div className={styles.disclaimerTitle}>
        Disclaimer
      </div>
      <div className={styles.disclaimerText}>
        All information provided in this registration form must be accurate and truthful. 
        If any detail is found to be false or misleading, the team will be subject to 
        immediate disqualification from the event.
      </div>
    </div>
  );
};

export default DisclaimerSection;