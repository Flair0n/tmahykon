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

  // Payment handler with verification
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus("❌ Please fill all required fields before payment.");
      return;
    }

    // Save form data to localStorage before payment
    localStorage.setItem("projectForm", JSON.stringify(formData));
    
    setStatus("Processing payment...");
    
    try {
      // Create payment order via your backend
      const amount = formData.TMAMember && formData.TMAMember.startsWith("Yes") ? 500 : 1000;
      console.log('Creating payment order with amount:', amount);
      
      const requestBody = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:5001/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      const orderData = await response.json();
      console.log('Order response:', orderData);
      
      if (!orderData.success) {
        setStatus("❌ Failed to create payment order");
        return;
      }

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "TMA-Hykon Innovation Challenge",
        description: "Registration Fee",
        order_id: orderData.order.id,
        handler: async function (response) {
          // Payment successful, verify and submit form
          await verifyPaymentAndSubmit(response.razorpay_payment_id, response.razorpay_order_id);
        },
        prefill: {
          name: formData.FullName,
          email: formData.Email,
          contact: formData.Phone
        },
        theme: {
          color: "#494DCA"
        },
        modal: {
          ondismiss: function() {
            setStatus("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      setStatus("❌ Error initiating payment");
      console.error(error);
    }
  };

  // Verify payment and submit form
  const verifyPaymentAndSubmit = async (paymentId, orderId) => {
    setStatus("Verifying payment...");
    
    console.log('Verifying payment with:', { paymentId, orderId });
    
    try {
      // Verify payment with backend
      const verifyResponse = await fetch('http://localhost:5001/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: paymentId,
          order_id: orderId
        })
      });
      
      console.log('Verify response status:', verifyResponse.status);
      const verifyData = await verifyResponse.json();
      console.log('Verify response data:', verifyData);
      
      if (verifyData.success && (verifyData.status === "captured" || verifyData.status === "authorized")) {
        // Payment verified, submit to Firebase
        setStatus("Payment verified! Submitting registration...");
        
        const payload = { 
          ...formData, 
          submittedAt: Timestamp.now(),
          payment_id: paymentId,
          order_id: orderId,
          payment_status: verifyData.status
        };
        
        const teamLeaderName = formData.FullName || "UnknownTeamLeader";
        await setDoc(doc(db, "registrations", teamLeaderName), payload);
        
        setStatus("✅ Registration and payment successful!");
        clearFormData();
        localStorage.removeItem("projectForm");
        setPaymentDone(true);
        
      } else {
        setStatus("❌ Payment verification failed. Please contact support.");
      }
      
    } catch (error) {
      setStatus("❌ Error verifying payment. Please contact support.");
      console.error(error);
    }
  };

  // Form submission handler (only for already paid users)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentDone) {
      setStatus("❌ Please complete payment first.");
      return;
    }
    
    setStatus("Registration already completed with payment!");
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
