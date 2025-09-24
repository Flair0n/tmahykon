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
          <div className="process-timeline-modern">
            <div className="timeline-progress-line"></div>
            
            <div className="process-step" data-step="1">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Registration</h3>
                <p>Teams register for the challenge through our online portal with their innovative ideas and team details.</p>
              </div>
            </div>
            
            <div className="process-step" data-step="2">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Idea Submission</h3>
                <p>Submit detailed project proposals with problem statements, innovative solutions, and expected impact metrics.</p>
              </div>
            </div>
            
            <div className="process-step" data-step="3">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Evaluation & Selection</h3>
                <p>Expert panel evaluates submissions based on innovation, technical feasibility, market potential, and social impact.</p>
              </div>
            </div>
            
            <div className="process-step" data-step="4">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Mentorship Phase</h3>
                <p>Selected teams receive guidance through Innovation Readiness Programme (IRP) sessions with industry experts.</p>
              </div>
            </div>
            
            <div className="process-step" data-step="5">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-cogs"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Prototype Development</h3>
                <p>Teams build working prototypes with access to labs, resources, technical support, and seed funding.</p>
              </div>
            </div>
            
            <div className="process-step" data-step="6">
              <div className="step-circle-wrapper">
                <div className="step-circle">
                  <div className="step-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                </div>
              </div>
              <div className="step-content">
                <h3>Final Presentation</h3>
                <p>Teams present their solutions to industry leaders, investors, and judges at the grand finale event.</p>
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
          <div className="irp-timeline-container">
            <div className="modern-horizontal-timeline">
              <div className="timeline-progress-bar"></div>
              
              <div className="timeline-step">
                <div className="step-circle">
                  <span className="step-number">1</span>
                </div>
                <div className="step-content">
                  <h4>IRP Session 1</h4>
                  <p>21st October 2025</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-circle">
                  <span className="step-number">2</span>
                </div>
                <div className="step-content">
                  <h4>IRP Session 2</h4>
                  <p>23rd October 2025</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-circle">
                  <span className="step-number">3</span>
                </div>
                <div className="step-content">
                  <h4>IRP Session 3</h4>
                  <p>22nd November 2025</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-circle">
                  <span className="step-number">4</span>
                </div>
                <div className="step-content">
                  <h4>IRP Session 4</h4>
                  <p>3rd January 2026</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-circle">
                  <span className="step-number">5</span>
                </div>
                <div className="step-content">
                  <h4>IRP Session 5</h4>
                  <p>10th January 2026</p>
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