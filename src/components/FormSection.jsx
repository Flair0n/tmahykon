import React from "react";
import { motion } from "framer-motion";
import FormField from "./FormField";
import styles from "../styles/FormSection.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function FormSection({
  sectionName,
  sectionFields,
  open,
  toggleSection,
  questions,
  formData,
  onChange,
  missingFields
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.sectionContainer}
    >
      <motion.div
        layout
        className={styles.sectionHeader}
      >
        {sectionName}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className={styles.sectionContent}
      >
        {sectionFields.map((field) => (
          <motion.div key={field.name} variants={fieldVariants} className={styles.fieldWrapper}>
            <FormField
              field={field}
              question={questions[field.name]}
              value={formData[field.name] || ""}
              onChange={onChange}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
