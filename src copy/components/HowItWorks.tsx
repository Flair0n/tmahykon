import React from "react";
import "../styles/HowItWorks.css";
import Cohorts from "./Cohorts";
import Process from "./Process";
import Timeline from "./Timeline";

const HowItWorks: React.FC = () => {
  return (
    <div className="how-it-works-page">
      <section className="how-it-works-intro section-padding-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading">
                <h4>Program Details</h4>
                <h2>Innovation Challenge Overview</h2>
              </div>
              <div className="intro-content">
                <p>
                  The TMA-Hykon Innovation Challenge is designed to transform
                  student ideas into working prototypes in approximately 90
                  days. Our structured program provides comprehensive support
                  through mentorship, resources, and guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cohorts />
      <Process />
      <Timeline />
    </div>
  );
};

export default HowItWorks;
