import React from "react";
import "../styles/Awards.css";

const Awards: React.FC = () => {
  return (
    <section className="awards-area section-padding-100" id="awards">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading">
              <h4>Awards & Support</h4>
              <h2>Recognizing Innovation Excellence</h2>
            </div>
          </div>
        </div>

        {/* Cash Awards Section */}
        <div className="award-category-section">
          <h3 className="award-category-title">Cash Awards</h3>
          <div className="row">
            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-trophy"></i>
                </div>
                <h5>1ST PRIZE</h5>
                <p className="award-amount">₹50,000</p>
              </div>
            </div>

            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-medal"></i>
                </div>
                <h5>2ND PRIZE</h5>
                <p className="award-amount">₹20,000</p>
              </div>
            </div>

            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-award"></i>
                </div>
                <h5>3RD PRIZE</h5>
                <p className="award-amount">₹10,000</p>
              </div>
            </div>

            <div className="col-12">
              <div className="seed-funding">
                <div className="award-icon">
                  <i className="fa fa-seedling"></i>
                </div>
                <h5>Seed Funding</h5>
                <p>Prototyping support of ₹3,000 for selected 15 teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Awards Section */}
        <div className="award-category-section">
          <h3 className="award-category-title">Institutional Awards</h3>
          <div className="row">
            <div className="col-6">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-university"></i>
                </div>
                <h5>Idea Powerhouse</h5>
                <p>Institution with most valid project submissions</p>
              </div>
            </div>

            <div className="col-6">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-users"></i>
                </div>
                <h5>Chapter Powerhouse</h5>
                <p>TMA Chapter with most valid project submissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cohort Awards Section */}
        <div className="award-category-section">
          <h3 className="award-category-title">Cohort Awards</h3>
          <div className="row">
            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-laptop-code"></i>
                </div>
                <h5>Cohort Champion — Coder</h5>
                <p>Excellence in software development</p>
              </div>
            </div>

            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-tools"></i>
                </div>
                <h5>Cohort Champion — Maker</h5>
                <p>Excellence in prototype creation</p>
              </div>
            </div>

            <div className="col-4">
              <div className="single-award">
                <div className="award-icon">
                  <i className="fa fa-chess-king"></i>
                </div>
                <h5>Cohort Champion — Leader</h5>
                <p>Excellence in project management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Support Section */}
        <div className="award-category-section">
          <h3 className="award-category-title">Product Support</h3>
          <div className="product-support-grid">
            <div className="single-award">
              <div className="award-icon">
                <i className="fa fa-briefcase"></i>
              </div>
              <h5>Industry Internships</h5>
              <p>Opportunities at TMA member firms</p>
            </div>
            <div className="single-award">
              <div className="award-icon">
                <i className="fa fa-rocket"></i>
              </div>
              <h5>Fast-track Incubation</h5>
              <p>Access to Ecosystem Partners</p>
            </div>
            <div className="single-award">
              <div className="award-icon">
                <i className="fa fa-gavel"></i>
              </div>
              <h5>IPR Support</h5>
              <p>Patent-drafting assistance</p>
            </div>
            <div className="single-award">
              <div className="award-icon">
                <i className="fa fa-newspaper"></i>
              </div>
              <h5>Media Feature</h5>
              <p>Coverage in TMA journal & local press</p>
            </div>
            <div className="single-award">
              <div className="award-icon">
                <i className="fa fa-handshake"></i>
              </div>
              <h5>Investor Access</h5>
              <p>Connect with potential investors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
