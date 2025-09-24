import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import PaymentSuccess from './PaymentSuccess.jsx';
import Home from './Home.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function VercelAnalyticsListener() {
  const location = useLocation();
  useEffect(() => {
    // Call Vercel Web Analytics on each SPA navigation
    window.va?.('pageview');
  }, [location.pathname, location.search, location.hash]);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VercelAnalyticsListener />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<App />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
