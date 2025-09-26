
import React from "react";
import "../styles/About.css";
import chlngdetsImg from "../assets/chlngdets.png";

const About = () => {
  return (
    <section className="about-us-area section-padding-100" id="about">
      <div className="about-container">
        <div className="about-content-wrapper">
          <div className="section-heading">
            <h4 className="about-subtitle">Challenge Details</h4>
            <h2 className="about-title">TMA HYKON Innovation Challenge</h2>
          </div>
          <div className="about-content-text about-columns animate-fadein">
            <div className="about-left-column">
              <img 
                src={chlngdetsImg} 
                alt="Challenge Details Illustration" 
                className="about-chlngdets-img"
              />
              <h3 className="about-column-title">What is the TMA-Hykon Innovation Challenge?</h3>
              <p>
                The TMA-Hykon Innovation Challenge is a <b>90-day program</b> that helps students turn ideas into working prototypes. Designed to bridge the gap between creativity and real-world impact, it offers a structured path from concept to execution.
              </p>
            </div>
            <div className="about-right-column">
              <h3 className="about-column-title">What do you get?</h3>
              <ul className="about-benefits-list">
                <li><span className="about-benefit-icon"><i className="fas fa-user-graduate"></i></span> Dual mentorship from industry and academia</li>
                <li><span className="about-benefit-icon"><i className="fas fa-hand-holding-usd"></i></span> Seed funding for your prototype</li>
                <li><span className="about-benefit-icon"><i className="fas fa-microphone"></i></span> Pitch training and presentation skills</li>
                <li><span className="about-benefit-icon"><i className="fas fa-handshake"></i></span> Internship and industry collaboration opportunities</li>
                <li><span className="about-benefit-icon"><i className="fas fa-rocket"></i></span> Incubation and startup support</li>
                <li><span className="about-benefit-icon"><i className="fas fa-lock"></i></span> Intellectual property guidance</li>
                <li><span className="about-benefit-icon"><i className="fas fa-briefcase"></i></span> Employment and entrepreneurship launchpad</li>
              </ul>
              <div className="about-btn">
                <a href="/how-it-works" className="btn confer-btn">
                  Learn More <i className="fas fa-long-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;