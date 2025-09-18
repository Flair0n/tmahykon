import React, { useState, useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const Hero: React.FC = () => {
  // Set the registration end date to 30th September 2025, 23:59:59 IST
  const endDate = new Date('2025-09-30T23:59:59+05:30');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // Get current time in Asia/Kolkata timezone
      const nowIST = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      );
      const difference = endDate.getTime() - nowIST.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  // Scroll float animation for heading
  const { scrollY } = useViewportScroll();
  const floatY = useTransform(scrollY, [0, 300], [0, -40]);

  return (
    <section className="welcome-area" id="home">
      <div className="welcome-slides">
        <div className="single-welcome-slide">
          <div className="welcome-content">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="welcome-text">
                    <motion.h2
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{ y: floatY }}
                    >
                      TMA HYKON <br />
                      INNOVATION CHALLENGE
                    </motion.h2>
                    <motion.h6
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      Empowering Innovation in Renewable Energy
                    </motion.h6>
                    <motion.div
                      className="hero-btn-group"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <Link to="/form" className="btn confer-btn">
                        Register Now <i className="fa fa-long-arrow-right"></i>
                      </Link>
                    </motion.div>

                    {/* Countdown Flip Calendar */}
                    <div
                      className="countdown-container"
                      data-animation="fadeInUp"
                      data-delay="900ms"
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
                          <span className="countdown-label">Days</span>
                        </div>

                        <div className="countdown-item">
                          <div className="flip-card">
                            <div className="flip-card-inner">
                              <div className="flip-card-front">
                                <span>{timeLeft.hours}</span>
                              </div>
                            </div>
                          </div>
                          <span className="countdown-label">Hours</span>
                        </div>

                        <div className="countdown-item">
                          <div className="flip-card">
                            <div className="flip-card-inner">
                              <div className="flip-card-front">
                                <span>{timeLeft.minutes}</span>
                              </div>
                            </div>
                          </div>
                          <span className="countdown-label">Minutes</span>
                        </div>

                        <div className="countdown-item">
                          <div className="flip-card">
                            <div className="flip-card-inner">
                              <div className="flip-card-front">
                                <span>{timeLeft.seconds}</span>
                              </div>
                            </div>
                          </div>
                          <span className="countdown-label">Seconds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
