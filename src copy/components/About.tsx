import React from "react";
import "../styles/About.css";

const About: React.FC = () => {
  return (
    <section className="about-us-area section-padding-100" id="about">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12">
            <div className="section-heading">
              <h4>About Us</h4>
              <h2>TMA HYKON Innovation Challenge</h2>
            </div>
          </div>

          <div className="col-12">
            <div className="about-content-text">
              <p>
                TMA–Hykon Innovation Challenge is a maker-first,
                industry-aligned program that turns student ideas into working
                prototypes in ~90 days. Teams get dual mentorship, seed support,
                and pitch training, culminating in a jury-reviewed Final Pitch
                and a public Investor Exhibition.
              </p>

              <p>
                Outcomes go beyond awards—internships and hiring, pilots/PoCs
                with industry, incubation referrals, and IP support—creating
                measurable employability and entrepreneurship impact for
                students and value for partners.
              </p>

              <p>
                The challenge creates pathways for college youth to develop
                real-world projects while fostering innovation and maker culture
                in educational institutions.
              </p>

              <div className="about-btn">
                <a href="/how-it-works" className="btn confer-btn">
                  Learn More <i className="fa fa-long-arrow-right"></i>
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
