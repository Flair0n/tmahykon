import React from "react";
import "../styles/HowItWorksNew.css";

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      {/* Innovation Challenge Overview */}
      <section className="challenge-overview section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Innovation Challenge Overview</h2>
          </div>
          <div className="overview-content">
            <p>
              The TMA-Hykon Innovation Challenge is designed to transform innovative ideas into working 
              prototypes & opportunities for early. Get scholarships provided comprehensive support 
              through mentorship, resources, and guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Who Can Participate */}
      <section className="participation-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Who Can Participate</h2>
          </div>
          <div className="participation-info">
            <p>College First year DIPLOMA/Bachelors/Masters/Final Year (200 years only)</p>
            <p>Teams of 2-4 members</p>
            <p>Problem statements can chosen between Current HYKON problem to VIT solution or student-owned</p>
            <p>Cross-disciplinary teams encouraged. May have two full stack</p>
          </div>
          
          <div className="participation-cards">
            <div className="participation-card">
              <div className="card-icon">
                <i className="fas fa-code"></i>
              </div>
              <h4>TECHNOLOGY / SOFTWARE / PHYSICAL ENGINEERING</h4>
              <button className="learn-more-btn">Learn More</button>
            </div>
            
            <div className="participation-card">
              <div className="card-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h4>BUSINESS & SOCIAL ENTREPRENEUR IDEAS</h4>
              <button className="learn-more-btn">Learn More</button>
            </div>
            
            <div className="participation-card">
              <div className="card-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h4>SOFTWARE / DATA / AI SOLUTIONS</h4>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="our-process-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Our Process</h2>
          </div>
          <div className="process-timeline">
            {/* Vertical timeline content will be added here */}
          </div>
        </div>
      </section>

      {/* Challenge Timeline */}
      <section className="challenge-timeline-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Challenge Timeline</h2>
          </div>
          <div className="timeline-content">
            {/* Detailed vertical timeline will be added here */}
          </div>
        </div>
      </section>

      {/* Innovation Readiness Programme */}
      <section className="irp-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Innovation Readiness Programme (IRP)</h2>
            <h3>MASTERCLASS</h3>
          </div>
          <div className="masterclass-grid">
            <div className="masterclass-item">
              <h4>IRP Session 1</h4>
              <p>Pitch Deck</p>
              <span>Lex Miranda</span>
            </div>
            <div className="masterclass-item">
              <h4>IRP Session 2</h4>
              <p>Competitive Positioning</p>
              <span>Lex Miranda</span>
            </div>
            <div className="masterclass-item">
              <h4>IRP Session 3</h4>
              <p>IRP Session</p>
              <span>Lex Miranda</span>
            </div>
            <div className="masterclass-item">
              <h4>IRP Session 4</h4>
              <p>IRP Session</p>
              <span>TBA</span>
            </div>
            <div className="masterclass-item">
              <h4>IRP Session 5</h4>
              <p>IRP Session</p>
              <span>TBA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;