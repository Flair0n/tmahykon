import React from "react";
import { motion } from "framer-motion";
import FormField from "./FormField";

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
  fieldStyle,
  textareaStyle,
  labelStyle,
  fieldMeta,
  missingFields = []
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%" }}
    >
      <motion.div
        layout
        style={{
          background: "#333",
          color: "#fff",
          padding: "10px",
          width: "100%",
          maxWidth: "600px",
          margin: "10px auto",
          borderRadius: "5px",
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {sectionName}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        style={{ marginTop: "10px", marginBottom: "20px" }}
      >
        {sectionFields.map((field) => (
          <motion.div key={field.name} variants={fieldVariants}>
            <FormField
              field={field}
              question={questions[field.name]}
              value={formData[field.name] || ""}
              onChange={onChange}
              fieldStyle={{
                ...fieldStyle,
                borderColor: missingFields.includes(field.name) ? '#FF5252' : fieldStyle.borderColor,
                background: missingFields.includes(field.name) ? '#fff6f6' : fieldStyle.backgroundColor,
              }}
              textareaStyle={{
                ...textareaStyle,
                borderColor: missingFields.includes(field.name) ? '#FF5252' : textareaStyle.borderColor,
                background: missingFields.includes(field.name) ? '#fff6f6' : textareaStyle.backgroundColor,
              }}
            />
            {missingFields.includes(field.name) && (
              <div style={{ color: '#FF5252', fontSize: 13, marginTop: 2, marginLeft: 2 }}>
                This field is required
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
