import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    // 1. Get payment_id from URL (Razorpay appends it as 'payment_id' or 'razorpay_payment_id')
    const params = new URLSearchParams(window.location.search);
    const payment_id = params.get("payment_id") || params.get("razorpay_payment_id");
    if (!payment_id) {
      setStatus("No payment ID found in URL. Please contact support.");
      return;
    }
    // 2. Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem("projectForm") || "null");
    if (!formData) {
      setStatus("No form data found. Please fill the form again.");
      return;
    }
    // 3. Verify payment status using backend (calls Razorpay API)
    const verifyPayment = async () => {
      setStatus("Verifying payment with Razorpay...");
      try {
        const res = await fetch(`http://localhost:5001/api/verify-payment-link?payment_id=${payment_id}`);
        const data = await res.json();
        if (data.success && data.status === "captured") {
          // 4. Submit to Firebase
          const payload = { ...formData, submittedAt: Timestamp.now(), payment_id };
          await addDoc(collection(db, "registrations"), payload);
          setStatus("✅ Registration successful! Your payment and form have been received.");
          localStorage.removeItem("projectForm");
        } else {
          setStatus("❌ Payment not successful. Please contact support.");
        }
      } catch (err) {
        setStatus("❌ Error verifying payment. Please contact support.");
      }
    };
    verifyPayment();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <h1>Payment Success</h1>
      <p>{status}</p>
    </div>
  );
}
