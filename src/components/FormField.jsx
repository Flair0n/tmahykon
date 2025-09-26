import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/FormField.module.css";

// Helper to check if a field is missing
function isMissing(field, missingFields) {
  return missingFields && missingFields.includes(field.name);
}

export default function FormField({
  field,
  question,
  value,
  onChange,
  missingFields
}) {
  // Custom onChange to restrict phone fields to numbers only
  const handleChange = (e) => {
    if (["Phone", "MentorPhone"].includes(field.name)) {
      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = onlyNums;
      onChange(e);
    } else {
      onChange(e);
    }
  };
  const wordLimitFields = [
    "ProblemStatement", "Context", "Stakeholders", "Solution",
    "WorkingPrinciple", "Novelty", "Impact", "Timeline", "TeamMembers"
  ];

  const countWords = (str) => (str ? str.trim().split(/\s+/).filter(Boolean).length : 0);
  const isWordLimit = field.type === "textarea" && wordLimitFields.includes(field.name);
  const wordCount = countWords(value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={styles.fieldContainer}
    >
      <label htmlFor={field.name} className={styles.fieldLabel}>{question}</label>

      {field.type === "select" ? (
        <motion.select
          name={field.name}
          required
          value={value}
          onChange={onChange}
          whileFocus={{ scale: 1.02 }}
          className={
            styles.fieldSelect + (isMissing(field, missingFields) ? ' ' + styles.missingField : '')
          }
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </motion.select>
      ) : field.type === "textarea" ? (
        <>
          <motion.textarea
            name={field.name}
            required
            value={value}
            onChange={onChange}
            whileFocus={{ scale: 1.02 }}
            className={
              styles.fieldTextarea + (isWordLimit ? ' ' + styles.fieldTextareaLarge : '') + (isMissing(field, missingFields) ? ' ' + styles.missingField : '')
            }
            {...(isWordLimit ? { maxLength: 2000 } : {})}
          />
          {isWordLimit && (
            <motion.div
              initial={false}
              animate={{ color: wordCount > 200 ? "#FF5252" : "#aaa" }}
              className={`${styles.wordCount} ${wordCount > 200 ? styles.wordCountOver : ''}`}
            >
              {wordCount} / 200 words
            </motion.div>
          )}
        </>
      ) : (
        <motion.input
          type={( ["Phone", "MentorPhone"].includes(field.name)) ? "tel" : field.type}
          name={field.name}
          required
          value={value}
          onChange={handleChange}
          whileFocus={{ scale: 1.02 }}
          className={
            styles.fieldInput + (isMissing(field, missingFields) ? ' ' + styles.missingField : '')
          }
          {...(["Phone", "MentorPhone"].includes(field.name) ? {
            minLength: 10,
            maxLength: 10,
            pattern: "[0-9]{10}",
            inputMode: "numeric"
          } : {})}
          {...(field.name === "Budget" ? {
            min: 0,
            max: 9999999999,
            inputMode: "numeric",
            pattern: "[0-9]*"
          } : {})}
        />
      )}
    </motion.div>
  );
}
