import React from "react";
import "../styles/Cohorts.css";

const Cohorts = () => {
  return (
    <section className="cohorts-area section-padding-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="cohort-info">
              <h2>Innovation Cohorts</h2>
              <p>Join specialized tracks designed to maximize your innovation potential</p>
            </div>
          </div>
        </div>

        <div className="row cohort-cards">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fas fa-solar-panel"></i>
              </div>
              <h3>Clean Energy</h3>
              <p>
                Focus on renewable energy solutions, energy storage, and 
                sustainable power generation technologies.
              </p>
              <div className="cohort-features">
                <span>• Solar & Wind Tech</span>
                <span>• Energy Storage</span>
                <span>• Smart Grids</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3>Smart Technology</h3>
              <p>
                Develop IoT solutions, AI applications, and smart automation 
                systems for industrial and consumer markets.
              </p>
              <div className="cohort-features">
                <span>• IoT Solutions</span>
                <span>• AI & ML</span>
                <span>• Automation</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Sustainability</h3>
              <p>
                Create solutions for environmental challenges, circular economy, 
                and sustainable business models.
              </p>
              <div className="cohort-features">
                <span>• Circular Economy</span>
                <span>• Waste Management</span>
                <span>• Green Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cohorts;