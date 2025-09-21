import { db } from "./firebase";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./formScrollbar.css";
import styles from "./styles/App.module.css";
import { motion } from "framer-motion";
import FormSection from "./components/FormSection";
import ProgressBar from "./components/ProgressBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StatusMessage from "./components/StatusMessage";
import PaymentSection from "./components/PaymentSection";
import DisclaimerSection from "./components/DisclaimerSection";
import { MentorSection, TMAChapterSection } from "./components/FormSections";

// Custom hooks
import { useFormData } from "./hooks/useFormData";
import { useFormValidation } from "./hooks/useFormValidation";

// Utilities
import { formQuestions, formSections } from "./utils/formConfig";
import { getFieldMeta } from "./utils/fieldMeta";

export default function App() {
  const location = useLocation();
  const formRef = useRef();
  
  // Custom hooks
  const { formData, setFormData, progress, handleChange, clearFormData } = useFormData();
  const { missingFields, setMissingFields, validateForm, isFormComplete } = useFormValidation(formData);
  
  // Local state
  const [status, setStatus] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const mentorFields = [
    "MentorName", "MentorEmail", "MentorDepartment", "MentorInstitution", "MentorPhone"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Payment handler
  const handlePayment = (e) => {
    e.preventDefault();
    if (formData.TMAMember && formData.TMAMember.startsWith("Yes")) {
      window.open("https://rzp.io/rzp/HKi39maX", "_blank");
    } else if (formData.TMAMember && formData.TMAMember.startsWith("No")) {
      window.open("https://rzp.io/rzp/4Dn4L26", "_blank");
    } else {
      setStatus("❌ Please select if you are a TMA member.");
      return;
    }
    setPaymentDone(true);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus("❌ Please fill all required fields.");
      // Scroll to first missing field
      if (missingFields.length > 0) {
        const el = formRef.current?.querySelector(`[name="${missingFields[0]}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setMissingFields([]);
    setStatus("Submitting...");
    
    try {
      const payload = { ...formData, submittedAt: Timestamp.now() };
      const teamLeaderName = formData.FullName || "UnknownTeamLeader";
      await setDoc(doc(db, "registrations", teamLeaderName), payload);
      
      setStatus("✅ Submission successful!");
      clearFormData();
      setPaymentDone(false);
      
      if (e.target && typeof e.target.reset === 'function') {
        e.target.reset();
      }
    } catch (err) {
      setStatus("❌ Error submitting form. Check console.");
      console.error(err);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar />
      
      {/* Progress bar */}
      {window.location.pathname === "/form" && (
        <div className={styles.progressBarContainer}>
          <ProgressBar progress={progress} />
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.mainContent}
      >
        {/* Main Form Container */}
        <div className={`${styles.formContainer} form-scrollbar`}>
          <h1 className={styles.formTitle}>TMA-Hykon Application Form</h1>
          
          <form
            ref={formRef}
            className={styles.form}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* Render all sections */}
            {Object.entries(formSections).map(([sectionName, sectionFields]) => (
              <React.Fragment key={sectionName}>
                <FormSection
                  sectionName={sectionName}
                  sectionFields={sectionFields.map(getFieldMeta)}
                  open={!!openSections[sectionName]}
                  toggleSection={toggleSection}
                  questions={formQuestions}
                  formData={formData}
                  onChange={handleChange}
                  missingFields={missingFields}
                />
                
                {/* After TeamMembers, show mentor question/section */}
                {sectionFields.includes("TeamMembers") && (
                  <>
                    <MentorSection formData={formData} handleChange={handleChange} />
                    {formData.HasMentor === "Yes" && (
                      <FormSection
                        key="MentorSection"
                        sectionName="Mentor Details"
                        sectionFields={mentorFields.map(getFieldMeta)}
                        open={true}
                        toggleSection={() => {}}
                        questions={formQuestions}
                        formData={formData}
                        onChange={handleChange}
                      />
                    )}
                  </>
                )}
                
                {/* After TMAMember, show TMAChapter if Yes */}
                {sectionFields.includes("TMAMember") && formData.TMAMember && formData.TMAMember.startsWith("Yes") && (
                  <TMAChapterSection formData={formData} handleChange={handleChange} />
                )}
              </React.Fragment>
            ))}

            {/* Payment/Submit button */}
            <PaymentSection 
              paymentDone={paymentDone}
              handlePayment={handlePayment}
              status={status}
              isFormComplete={isFormComplete}
            />

            {/* Status message */}
            <StatusMessage status={status} />

            {/* Disclaimer */}
            <DisclaimerSection />
          </form>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
}
