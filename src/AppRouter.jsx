import React, { Suspense } from "react";
import Loader from "./components/Loader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import PaymentSuccess from "./PaymentSuccess.jsx";
import Home from "./Home.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import AdminDashboard from "./components/AdminDashboardModular.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}> {/* Show loader during lazy loading or route change */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<App />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
