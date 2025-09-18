import React from "react";
import "../styles/Cohorts.css";

const Cohorts: React.FC = () => {
  return (
    <section className="cohorts-area section-padding-100" id="cohorts">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading">
              <h4>Participation Tracks</h4>
              <h2>Who Can Participate</h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="cohort-info">
              <p>
                College Track (any UG/PG/PhD discipline) / Fresher Track (2025
                pass outs)
              </p>
              <p>Team of 3-5 members.</p>
              <p>
                Problem statements can be chosen between Curated Industry
                problem by TMA partners or student-owned
              </p>
              <p>Cross-disciplinary teams welcome; Max two ideas per cohort.</p>
            </div>
          </div>
        </div>

        <div className="row cohort-cards">
          <div className="col-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fa fa-microchip"></i>
              </div>
              <h3>HARDWARE / IOT / ROBOTICS, MEDICAL PROTOTYPES</h3>
              <div className="cohort-name">
                <h5>Maker Cohort</h5>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fa fa-briefcase"></i>
              </div>
              <h3>BUSINESS & SOCIAL ENTERPRISE IDEAS</h3>
              <div className="cohort-name">
                <h5>Leader Cohort</h5>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="single-cohort">
              <div className="cohort-icon">
                <i className="fa fa-code"></i>
              </div>
              <h3>SOFTWARE / DATA / AI SOLUTIONS</h3>
              <div className="cohort-name">
                <h5>Coder Cohort</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cohorts;
