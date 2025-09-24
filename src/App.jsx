import { db } from "./firebase";
import { collection, addDoc, Timestamp, setDoc, doc, deleteDoc } from "firebase/firestore";
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
  const [paymentTimeoutId, setPaymentTimeoutId] = useState(null);

  const mentorFields = [
    "MentorName", "MentorEmail", "MentorDepartment", "MentorInstitution", "MentorPhone"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Cleanup payment timeout on unmount
  useEffect(() => {
    return () => {
      if (paymentTimeoutId) {
        clearTimeout(paymentTimeoutId);
      }
    };
  }, [paymentTimeoutId]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Function to mark payment as abandoned/failed
  const markPaymentAsAbandoned = async (registrationId, reason = "Payment abandoned - timeout") => {
    try {
      const docRef = doc(db, "registrations", registrationId);
      await setDoc(docRef, {
        payment_status: "failed",
        failure_reason: reason,
        abandoned_at: Timestamp.now()
      }, { merge: true });
      console.log(`Payment marked as abandoned for registration: ${registrationId}`);
    } catch (error) {
      console.error("Failed to mark payment as abandoned:", error);
    }
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
    
    setStatus("Saving registration data...");
    
    try {
      // First, save data to Firestore with pending payment status
      const teamLeaderName = formData.FullName || "UnknownTeamLeader";
      const pendingPayload = { 
        ...formData, 
        submittedAt: Timestamp.now(),
        payment_status: "pending",
        registration_id: teamLeaderName
      };
      
      await setDoc(doc(db, "registrations", teamLeaderName), pendingPayload);
      setStatus("Registration saved. Processing payment...");
      
      // Create payment order via your backend
      const amount = formData.TMAMember && formData.TMAMember.startsWith("Yes") ? 500 : 1000;
      console.log('Creating payment order with amount:', amount);
      
      const requestBody = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };
      console.log('Request body:', requestBody);
      
  const response = await fetch('https://tmahykon.onrender.com/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      const orderData = await response.json();
      console.log('Order response:', orderData);
      
      if (!orderData.success) {
        // Update status to failed in Firestore
        await setDoc(doc(db, "registrations", teamLeaderName), {
          ...pendingPayload,
          payment_status: "failed",
          failure_reason: "Failed to create payment order"
        });
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
          // Payment successful, verify and update status
          // Payment successful, verify and update status
          await verifyPaymentAndSubmit(response.razorpay_payment_id, response.razorpay_order_id, teamLeaderName);
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
          ondismiss: async function() {
            // Clear the timeout since user dismissed the modal
            if (paymentTimeoutId) {
              clearTimeout(paymentTimeoutId);
              setPaymentTimeoutId(null);
            }
            
            // Mark payment as failed (abandoned)
            await markPaymentAsAbandoned(teamLeaderName, "Payment abandoned - user dismissed modal");
            setStatus("❌ Payment abandoned. You can retry payment anytime.");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Set timeout to mark payment as abandoned after 30 minutes
      const timeoutId = setTimeout(async () => {
        await markPaymentAsAbandoned(teamLeaderName, "Payment abandoned - 30 minute timeout");
        setStatus("❌ Payment session expired. Please retry payment.");
      }, 30 * 60 * 1000); // 30 minutes
      
      setPaymentTimeoutId(timeoutId);
      
    } catch (error) {
      // Update status to failed in Firestore on error
      const teamLeaderName = formData.FullName || "UnknownTeamLeader";
      try {
        await setDoc(doc(db, "registrations", teamLeaderName), {
          ...formData,
          submittedAt: Timestamp.now(),
          payment_status: "failed",
          failure_reason: "Error initiating payment: " + error.message
        });
      } catch (dbError) {
        console.error("Failed to update database:", dbError);
      }
      setStatus("❌ Error initiating payment");
      console.error(error);
    }
  };

  // Verify payment and update status in Firestore
  const verifyPaymentAndSubmit = async (paymentId, orderId, registrationId) => {
    // Clear the timeout since payment is being processed
    if (paymentTimeoutId) {
      clearTimeout(paymentTimeoutId);
      setPaymentTimeoutId(null);
    }
    
    setStatus("Verifying payment...");
    
    console.log('Verifying payment with:', { paymentId, orderId });
    
    try {
      // Verify payment with backend
  const verifyResponse = await fetch('https://tmahykon.onrender.com/api/verify-payment', {
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
        // Payment verified, update status to authorized in Firestore
        setStatus("Payment verified! Updating registration...");
        
        const successPayload = { 
          ...formData, 
          submittedAt: Timestamp.now(),
          payment_id: paymentId,
          order_id: orderId,
          payment_status: "authorized",
          payment_verified_at: Timestamp.now(),
          registration_id: registrationId
        };
        
        await setDoc(doc(db, "registrations", registrationId), successPayload);
        
        setStatus("✅ Registration and payment successful!");
        clearFormData();
        localStorage.removeItem("projectForm");
        setPaymentDone(true);
        
      } else {
        // Payment verification failed, update status in Firestore
        await setDoc(doc(db, "registrations", registrationId), {
          ...formData,
          submittedAt: Timestamp.now(),
          payment_id: paymentId,
          order_id: orderId,
          payment_status: "failed",
          failure_reason: "Payment verification failed",
          verification_response: verifyData
        });
        setStatus("❌ Payment verification failed. Please contact support or retry payment.");
      }
      
    } catch (error) {
      // Update status to failed in Firestore on verification error
      try {
        await setDoc(doc(db, "registrations", registrationId), {
          ...formData,
          submittedAt: Timestamp.now(),
          payment_id: paymentId,
          order_id: orderId,
          payment_status: "failed",
          failure_reason: "Error verifying payment: " + error.message
        });
      } catch (dbError) {
        console.error("Failed to update database:", dbError);
      }
      setStatus("❌ Error verifying payment. Please contact support.");
      console.error(error);
    }
  };

  // Add retry payment function for failed payments
  const retryPayment = async () => {
    if (!formData.FullName) {
      setStatus("❌ No registration data found to retry payment.");
      return;
    }
    
    // Clear any existing timeout
    if (paymentTimeoutId) {
      clearTimeout(paymentTimeoutId);
      setPaymentTimeoutId(null);
    }
    
    // Reset the form status and retry payment
    setStatus("Retrying payment...");
    await handlePayment({ preventDefault: () => {} });
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
              retryPayment={retryPayment}
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
