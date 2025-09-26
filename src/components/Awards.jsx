import React, { useState, useEffect, useRef } from "react";
import "../styles/Awards.css";

const Awards = () => {
  const [expandedSection, setExpandedSection] = useState('cash');
  const tabs = ['cash', 'institutional', 'cohort', 'support'];
  const intervalRef = useRef(null);

  const toggleSection = (section) => {
    if (expandedSection !== section) {
      setExpandedSection(section);
      // Reset the auto-switch timer when user manually changes tabs
      resetAutoSwitchTimer();
    }
  };

  const resetAutoSwitchTimer = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      setExpandedSection(prevSection => {
        const currentIndex = tabs.indexOf(prevSection);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4000);
  };

  // Auto-switch tabs every 4 seconds
  useEffect(() => {
    resetAutoSwitchTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section className="awards-area section-padding-100" id="awards">
      <div className="awards-container">
        <div className="awards-content-wrapper">
          <div className="section-heading">
            <h4>Awards & Support</h4>
            <h2>Recognizing Innovation Excellence</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="awards-tabs">
            <button 
              className={`tab-button ${expandedSection === 'cash' ? 'active' : ''}`}
              onClick={() => toggleSection('cash')}
            >
              Cash Awards
            </button>
            <button 
              className={`tab-button ${expandedSection === 'institutional' ? 'active' : ''}`}
              onClick={() => toggleSection('institutional')}
            >
              Institutional
            </button>
            <button 
              className={`tab-button ${expandedSection === 'cohort' ? 'active' : ''}`}
              onClick={() => toggleSection('cohort')}
            >
              Cohort Awards
            </button>
            <button 
              className={`tab-button ${expandedSection === 'support' ? 'active' : ''}`}
              onClick={() => toggleSection('support')}
            >
              Support Services
            </button>
          </div>

          {/* Cash Awards Section */}
          <div className={`award-category-section cash-awards ${expandedSection === 'cash' ? 'expanded' : ''}`}>
            <div className="awards-grid cash-grid">
              <div className="single-award premium-card gold-tier">
                <div className="card-glow"></div>
                <div className="award-rank">1st</div>
                <div className="award-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h5>Winner</h5>
                <p className="award-amount">₹50,000</p>
                <div className="award-benefits">
                  <span>+ Industry Mentorship</span>
                  <span>+ Fast-track Incubation</span>
                </div>
              </div>

              <div className="single-award premium-card silver-tier">
                <div className="card-glow"></div>
                <div className="award-rank">2nd</div>
                <div className="award-icon">
                  <i className="fas fa-medal"></i>
                </div>
                <h5>Runner-up</h5>
                <p className="award-amount">₹20,000</p>
                <div className="award-benefits">
                  <span>+ Internship Opportunities</span>
                  <span>+ IPR Support</span>
                </div>
              </div>

              <div className="single-award premium-card bronze-tier">
                <div className="card-glow"></div>
                <div className="award-rank">3rd</div>
                <div className="award-icon">
                  <i className="fas fa-award"></i>
                </div>
                <h5>Third Place</h5>
                <p className="award-amount">₹10,000</p>
                <div className="award-benefits">
                  <span>+ Media Coverage</span>
                  <span>+ Certificate</span>
                </div>
              </div>
            </div>

            <div className="seed-funding premium-card seed-tier">
              <div className="card-glow"></div>
              <div className="award-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h5>Seed Funding</h5>
              <p className="award-amount">₹3,000</p>
              <p className="award-description">Prototyping support for selected 15 teams</p>
            </div>
          </div>

          {/* Institutional Awards Section */}
          <div className={`award-category-section institutional-awards ${expandedSection === 'institutional' ? 'expanded' : ''}`}>
            <div className="awards-grid institutional-grid">
              <div className="single-award premium-card institutional-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-university"></i>
                </div>
                <h5>Idea Powerhouse</h5>
                <p className="award-description">Institution with most valid project submissions</p>
                <div className="award-benefits">
                  <span>Recognition Certificate</span>
                </div>
              </div>

              <div className="single-award premium-card institutional-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h5>Chapter Powerhouse</h5>
                <p className="award-description">TMA Chapter with most valid project submissions</p>
                <div className="award-benefits">
                  <span>Chapter Recognition</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Awards Section */}
          <div className={`award-category-section cohort-awards ${expandedSection === 'cohort' ? 'expanded' : ''}`}>
            <div className="awards-grid cohort-grid">
              <div className="single-award premium-card cohort-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h5>Cohort Champion - Coder</h5>
                <p className="award-description">Excellence in software development</p>
                <div className="award-benefits">
                  <span>Tech Industry Connections</span>
                  <span>Coding Bootcamp Access</span>
                </div>
              </div>

              <div className="single-award premium-card cohort-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <h5>Cohort Champion - Maker</h5>
                <p className="award-description">Excellence in prototype creation</p>
                <div className="award-benefits">
                  <span>Maker Space Access</span>
                  <span>Hardware Partnerships</span>
                </div>
              </div>

              <div className="single-award premium-card cohort-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-chess-king"></i>
                </div>
                <h5>Cohort Champion - Leader</h5>
                <p className="award-description">Excellence in project management</p>
                <div className="award-benefits">
                  <span>Leadership Programs</span>
                  <span>Management Training</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Support Section */}
          <div className={`award-category-section support-services ${expandedSection === 'support' ? 'expanded' : ''}`}>
            <div className="awards-grid support-grid">
              <div className="single-award premium-card support-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h5>Industry Internships</h5>
                <p className="award-description">Opportunities at TMA member firms</p>
                <div className="award-benefits">
                  <span>Mentor-led</span>
                  <span>Certificate</span>
                </div>
              </div>
              <div className="single-award premium-card support-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h5>Fast-track Incubation</h5>
                <p className="award-description">Access to Ecosystem Partners</p>
                <div className="award-benefits">
                  <span>Cloud credits</span>
                  <span>Prototyping labs</span>
                </div>
              </div>
              <div className="single-award premium-card support-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-gavel"></i>
                </div>
                <h5>IPR Support</h5>
                <p className="award-description">Patent-drafting assistance</p>
                <div className="award-benefits">
                  <span>IP clinic</span>
                  <span>Subsidized fees</span>
                </div>
              </div>
              <div className="single-award premium-card support-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <h5>Media Feature</h5>
                <p className="award-description">Coverage in TMA journal & local press</p>
                <div className="award-benefits">
                  <span>Social boost</span>
                  <span>Demo-day spotlight</span>
                </div>
              </div>
              <div className="single-award premium-card support-tier">
                <div className="card-glow"></div>
                <div className="award-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h5>Investor Access</h5>
                <p className="award-description">Connect with potential investors</p>
                <div className="award-benefits">
                  <span>Pitch review</span>
                  <span>Warm intros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;