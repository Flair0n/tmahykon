import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Purpose from "./components/Purpose";
import Process from "./components/Process";
import Awards from "./components/Awards";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import RegistrationForm from "../src/App.jsx";

function App() {
  const location = useLocation();
  const isFormPage = location.pathname === "/form";

  useEffect(() => {
    if (location.pathname === "/" && location.state) {
      const scrollToSection = (id: string) => {
        let attempts = 0;
        const maxAttempts = 20; // 20 x 50ms = 1s
        const tryScroll = () => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryScroll, 50);
          }
        };
        tryScroll();
      };
      if (location.state.scrollToFooter) {
        scrollToSection("footer");
      } else if (location.state.scrollToTop) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      } else if (location.state.scrollToAwards) {
        scrollToSection("awards");
      } else if (location.state.scrollToPurpose) {
        scrollToSection("purpose");
      } else if (location.state.scrollToAbout) {
        scrollToSection("about");
      }
    }
  }, [location]);

  return (
    <div className="App">
      {!isFormPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
                style={{ background: "linear-gradient(to right, #111343 95%, #212480 85%)", minHeight: "100vh", overflowY: "auto" }}
              >
                <Hero />
                <div className="main-content">
                  <Purpose />
                  <About />
                  <Awards />
                </div>
                <Footer />
              </motion.div>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/purpose" element={<Purpose />} />
          <Route path="/process" element={<Process />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route
            path="/form"
            element={
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
                style={{ background: "linear-gradient(to right, #111343 95%, #212480 85%)", minHeight: "100vh" }}
              >
                <RegistrationForm />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
