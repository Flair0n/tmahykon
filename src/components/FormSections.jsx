import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/App.module.css';
import { tmaChapterOptions } from '../utils/formConfig';

const MentorSection = ({ formData, handleChange }) => {
  return (
    <div className={styles.mentorQuestion}>
      <label className={styles.mentorLabel}>
        Do you have a mentor?
      </label>
      <select
        name="HasMentor"
        value={formData.HasMentor || ""}
        onChange={handleChange}
        className={styles.mentorSelect}
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );
};

const TMAChapterSection = ({ formData, handleChange }) => {
  return (
    <div className={styles.tmaChapterContainer}>
      <label className={styles.tmaChapterLabel}>
        If yes, which TMA student chapter do you belong to?
      </label>
      <select
        name="TMAChapter"
        value={formData.TMAChapter || ""}
        onChange={handleChange}
        className={styles.tmaChapterSelect}
      >
        <option value="">Select your TMA student chapter</option>
        {tmaChapterOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export { MentorSection, TMAChapterSection };