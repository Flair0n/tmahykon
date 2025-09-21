import React from "react";
import "../styles/Purpose.css";

const Purpose = () => {
  return (
    <section className="purpose-area section-padding-100 bg-img" id="purpose">
      <div className="purpose-container">
        <div className="purpose-content-wrapper">
          <div className="section-heading light">
            <h4>Challenge Purpose</h4>
            <h2>Why We Created This Challenge</h2>
          </div>

          <div className="purpose-content">
            <p>
              The TMA-Hykon Innovation Challenge was created with clear
              objectives to transform education and innovation. Our key
              purposes are:
            </p>

            <div className="purpose-items">
              <div className="single-purpose-item">
                <div className="purpose-icon">
                  <i className="fas fa-industry"></i>
                </div>
                <h5>Foster Industry-Aligned Innovation</h5>
                <p>
                  Connect student projects with real industry needs to create
                  meaningful solutions.
                </p>
              </div>

              <div className="single-purpose-item">
                <div className="purpose-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h5>Ignite Maker Culture</h5>
                <p>
                  Cultivate a hands-on maker culture among college youth to
                  encourage practical innovation.
                </p>
              </div>

              <div className="single-purpose-item">
                <div className="purpose-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h5>Create Career Pathways</h5>
                <p>
                  Establish employability and entrepreneurship pathways
                  through real-world project experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Purpose;