
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import Purpose from "./components/Purpose";
import About from "./components/About";
import Awards from "./components/Awards";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const scrollToSection = (id) => {
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
      <Navbar />
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.5 }}
        style={{ 
          minHeight: "100vh", 
          overflowY: "auto",
          width: "100%"
        }}
      >
        <Hero />
        <div className="main-content">
          <Purpose />
          <About />
          <Awards />
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default Home;
