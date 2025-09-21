import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HeroNew.css";

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date("2025-09-30T23:59:59");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-container">
      <div className="hero-bg-overlay"></div>
      <div className="hero-content">
        <div className="hero-wrapper">
          <div className="hero-main">
            <div className="hero-text-content">
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                TMA <span className="text-gradient">HYKON</span><br/>INNOVATION CHALLENGE
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Empowering Innovation in Renewable Energy
              </motion.p>

              <motion.div
                className="hero-cta"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/form" className="cta-button primary">
                  Register Now
                </Link>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                className="countdown-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="countdown-title">Registration Ends In:</p>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <span>{timeLeft.days}</span>
                        </div>
                      </div>
                    </div>
                    <span className="countdown-label">DAYS</span>
                  </div>

                  <div className="countdown-item">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <span>{timeLeft.hours}</span>
                        </div>
                      </div>
                    </div>
                    <span className="countdown-label">HOURS</span>
                  </div>

                  <div className="countdown-item">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <span>{timeLeft.minutes}</span>
                        </div>
                      </div>
                    </div>
                    <span className="countdown-label">MINUTES</span>
                  </div>

                  <div className="countdown-item">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <span>{timeLeft.seconds}</span>
                        </div>
                      </div>
                    </div>
                    <span className="countdown-label">SECONDS</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;