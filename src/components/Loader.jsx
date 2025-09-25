import React from "react";
import "../styles/Loader.css";

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader-spinner">
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
    </div>
  </div>
);

export default Loader;
