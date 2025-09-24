import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.sectionContainer}
    >
      <motion.div
        layout
        className={styles.sectionHeader}
        onClick={() => toggleSection(sectionName)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
