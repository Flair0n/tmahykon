import React from "react";
import "../styles/Process.css";

const Process = () => {
  return (
    <section className="process-area section-padding-100-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="process-content">
              <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="single-process-content text-center">
                    <div className="process-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <h4>Register</h4>
                    <p>
                      Sign up with your team and submit your innovative idea. 
                      Early bird registration includes special mentorship access.
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="single-process-content text-center">
                    <div className="process-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h4>Collaborate</h4>
                    <p>
                      Work with industry mentors and fellow innovators. 
                      Access exclusive resources and networking opportunities.
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="single-process-content text-center">
                    <div className="process-icon">
                      <i className="fas fa-rocket"></i>
                    </div>
                    <h4>Launch</h4>
                    <p>
                      Present your solution to industry leaders and investors. 
                      Win prizes and get real opportunities to scale your innovation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;