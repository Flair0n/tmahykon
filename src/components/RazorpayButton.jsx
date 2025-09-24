import React from "react";


const RazorpayButton = ({ isTmaMember, onPayment }) => {
  // Choose the correct payment link
  const paymentUrl = isTmaMember
    ? "https://rzp.io/rzp/PQlZTkdS" // TMA member link
    : "https://rzp.io/rzp/Onrn3rTI"; // Non-TMA (1000) link

  const handleClick = (e) => {
    e.preventDefault();
    window.open(paymentUrl, "_blank");
    if (typeof onPayment === "function") {
      onPayment();
    }
  };

  return (
    <button
      type="button"
      style={{
        background: "#A74EA7",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "12px 28px",
        fontSize: "16px",
        fontWeight: 600,
        margin: "18px 0 8px 0",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;
