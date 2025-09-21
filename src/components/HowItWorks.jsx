import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/HowItWorksNew.css";
import "../styles/MidReviewTimeline.css";

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <Navbar />
      
      {/* What Makes This Challenge Different */}
      <section className="challenge-different-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>What Makes This Challenge Different</h2>
          </div>
          
          <div className="different-cards-container">
            <div className="different-card">
              <div className="card-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="card-content">
                <h3>BUILD-FIRST, COMPETE-SECOND</h3>
                <p>Seed grant after Top-15 selection shifts mindset from "win a prize" to "ship a working solution"</p>
              </div>
            </div>
            
            <div className="different-card">
              <div className="card-icon">
                <i className="fas fa-industry"></i>
              </div>
              <div className="card-content">
                <h3>DEEP INDUSTRY INVOLVEMENT</h3>
                <p>Dual industry mentors (technical + business) with optional site immersions</p>
              </div>
            </div>
            
            <div className="different-card">
              <div className="card-icon">
                <i className="fas fa-flag"></i>
              </div>
              <div className="card-content">
                <h3>ROBUST POST-AWARD SUPPORT</h3>
                <p>Internships, incubation, IPR help, media features, investor pool and IRP</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who Can Participate */}
      <section className="participation-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Who Can Participate (Tracks)</h2>
            <p className="tracks-subtitle">Open to College Students (UG/PG/PhD - All Disciplines) & Recent Graduates (2025 Pass-outs)</p>
          </div>
          
          <div className="cohorts-container">
            <div className="cohort-card leader-cohort">
              <div className="cohort-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Leader<br/>Cohort</h3>
              <p>Business Strategy & Social<br/>Innovation Solutions</p>
            </div>
            
            <div className="cohort-card maker-cohort">
              <div className="cohort-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3>Maker<br/>Cohort</h3>
              <p>Hardware Development,<br/>IoT Systems & Medical<br/>Device Prototypes</p>
            </div>
            
            <div className="cohort-card coder-cohort">
              <div className="cohort-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Coder<br/>Cohort</h3>
              <p>Software Engineering,<br/>Data Science & AI<br/>Applications</p>
            </div>
          </div>
          
          <div className="participation-details">
            <p>Teams consist of 3-5 members with complementary skill sets.</p>
            <p>Projects may address <strong>curated industry challenges from TMA partners or original student-conceived solutions</strong>.</p>
            <p>Cross-disciplinary collaboration is encouraged with a <strong>maximum of two project submissions per cohort</strong>.</p>
            <p>Registration Investment: <strong>TMA Members: ₹500 | Non-Members: ₹1,000</strong></p>
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
            <div className="timeline-item left">
              <div className="timeline-card">
                <h3>Idea Submission</h3>
                <p>Participants submit their innovative ideas for renewable energy solutions.</p>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-card">
                <h3>Registration</h3>
                <p>Teams or individuals register for the challenge through our online portal.</p>
              </div>
            </div>
            
            <div className="timeline-item left">
              <div className="timeline-card">
                <h3>Finalists Selection</h3>
                <p>Top ideas are selected as finalists for the next round of the challenge.</p>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-card">
                <h3>Evaluation</h3>
                <p>Our panel of experts evaluates submissions based on innovation, feasibility, and impact.</p>
              </div>
            </div>
            
            <div className="timeline-item left">
              <div className="timeline-card">
                <h3>Final Presentation</h3>
                <p>Finalists present their prototypes to a panel of judges and industry experts.</p>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-card">
                <h3>Prototype Development</h3>
                <p>Finalists receive resources and mentorship to develop prototypes of their solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Timeline */}
      <section className="challenge-timeline-section section-padding-100">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Challenge Timeline</h2>
          </div>
          <div className="timeline-infographic">
            <div className="timeline-horizontal-line"></div>
            
            <div className="timeline-point timeline-top">
              <div className="timeline-circle circle-green">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="timeline-content">
                <h4>Application Opens</h4>
                <p>Innovative teams ready to transform ideas into reality. Registration begins for aspiring entrepreneurs.</p>
              </div>
              <div className="timeline-date-badge">20 SEP 2025</div>
            </div>
            
            <div className="timeline-point timeline-bottom">
              <div className="timeline-circle circle-blue">
                <i className="fas fa-clock"></i>
              </div>
              <div className="timeline-content">
                <h4>Application Deadline</h4>
                <p>Final submissions accepted for evaluation and selection process. Last chance to apply.</p>
              </div>
              <div className="timeline-date-badge">17 OCT 2025</div>
            </div>
            
            <div className="timeline-point timeline-top">
              <div className="timeline-circle circle-gray">
                <i className="fas fa-bullseye"></i>
              </div>
              <div className="timeline-content">
                <h4>Top 30 Selected</h4>
                <p>Shortlisted teams announced based on innovation potential and business viability.</p>
              </div>
              <div className="timeline-date-badge">26 OCT 2025</div>
            </div>
            
            <div className="timeline-point timeline-bottom">
              <div className="timeline-circle circle-orange">
                <i className="fas fa-microphone"></i>
              </div>
              <div className="timeline-content">
                <h4>Pitch Presentations</h4>
                <p>Online idea showcase to demonstrate concepts and vision to industry experts.</p>
              </div>
              <div className="timeline-date-badge">1-2 NOV 2025</div>
            </div>
            
            <div className="timeline-point timeline-top">
              <div className="timeline-circle circle-red">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="timeline-content">
                <h4>Finalists Announced</h4>
                <p>Top 15 teams selected for the main challenge program and mentorship journey.</p>
              </div>
              <div className="timeline-date-badge">5 NOV 2025</div>
            </div>
            
            <div className="timeline-point timeline-bottom">
              <div className="timeline-circle circle-maroon">
                <i className="fas fa-medal"></i>
              </div>
              <div className="timeline-content">
                <h4>Grand Finale</h4>
                <p>Final showcase and awards ceremony for all participants. Winners announced.</p>
              </div>
              <div className="timeline-date-badge">31 JAN 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Readiness Programme */}
      <section className="innovation-readiness-section section-padding-100">
        <div className="container">
          <div className="innovation-readiness-heading">
            <h2>Innovation Readiness Programme (IRP)</h2>
          </div>
          <div className="midreview-timeline-area">
            <div className="horizontal-timeline">
              <div className="horizontal-timeline-event">
                <div className="horizontal-timeline-dot"></div>
                <div className="horizontal-timeline-content">
                  <div className="horizontal-timeline-title">IRP Session 1</div>
                  <div className="horizontal-timeline-date">Pitch Deck</div>
                </div>
              </div>
              
              <div className="horizontal-timeline-event">
                <div className="horizontal-timeline-dot"></div>
                <div className="horizontal-timeline-content">
                  <div className="horizontal-timeline-title">IRP Session 2</div>
                  <div className="horizontal-timeline-date">Competitive Positioning</div>
                </div>
              </div>
              
              <div className="horizontal-timeline-event">
                <div className="horizontal-timeline-dot"></div>
                <div className="horizontal-timeline-content">
                  <div className="horizontal-timeline-title">IRP Session 3</div>
                  <div className="horizontal-timeline-date">Business Model</div>
                </div>
              </div>
              
              <div className="horizontal-timeline-event">
                <div className="horizontal-timeline-dot"></div>
                <div className="horizontal-timeline-content">
                  <div className="horizontal-timeline-title">IRP Session 4</div>
                  <div className="horizontal-timeline-date">Market Analysis</div>
                </div>
              </div>
              
              <div className="horizontal-timeline-event">
                <div className="horizontal-timeline-dot"></div>
                <div className="horizontal-timeline-content">
                  <div className="horizontal-timeline-title">IRP Session 5</div>
                  <div className="horizontal-timeline-date">Final Presentation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;