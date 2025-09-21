import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <section className="about-us-area section-padding-100" id="about">
      <div className="about-container">
        <div className="about-content-wrapper">
          <div className="section-heading">
            <h4>About Us</h4>
            <h2>TMA HYKON Innovation Challenge</h2>
          </div>

          <div className="about-content-text">
            <p>
              The TMA-Hykon Innovation Challenge is a 90-day program that helps 
              students turn ideas into working prototypes. Designed to bridge the 
              gap between creativity and real-world impact, it offers a structured 
              path from concept to execution.
            </p>

            <p>
              Participants receive dual mentorship, seed funding, and pitch training, 
              along with access to internships, industry collaborations, and incubation 
              support. Intellectual property guidance ensures innovations are protected 
              and ready for scale.
            </p>

            <p>
              This challenge is a launchpad for employment and entrepreneurship, 
              empowering students to build solutions that matter. It's where innovation 
              meets opportunity and student projects become tomorrow's technologies.
            </p>

            <div className="about-btn">
              <a href="/how-it-works" className="btn confer-btn">
                Learn More <i className="fa fa-long-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;