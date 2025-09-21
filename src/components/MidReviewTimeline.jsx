import React from "react";
import "../styles/MidReviewTimeline.css";

const MidReviewTimeline = () => {
  return (
    <section className="innovation-readiness-section">
      <div className="container">
        <div className="innovation-readiness-heading">
          <h2>Innovation Readiness Program</h2>
        </div>
        
        <div className="midreview-timeline-area">
          <div className="horizontal-timeline">
            <div className="horizontal-timeline-event">
              <div className="horizontal-timeline-dot"></div>
              <div className="horizontal-timeline-title">
                <h4>Ideation</h4>
                <span>Week 1-2</span>
              </div>
              <div className="horizontal-timeline-content">
                <p>Concept development and market validation</p>
              </div>
            </div>

            <div className="horizontal-timeline-event">
              <div className="horizontal-timeline-dot"></div>
              <div className="horizontal-timeline-title">
                <h4>Planning</h4>
                <span>Week 3-4</span>
              </div>
              <div className="horizontal-timeline-content">
                <p>Technical architecture and resource planning</p>
              </div>
            </div>

            <div className="horizontal-timeline-event">
              <div className="horizontal-timeline-dot"></div>
              <div className="horizontal-timeline-title">
                <h4>Development</h4>
                <span>Week 5-10</span>
              </div>
              <div className="horizontal-timeline-content">
                <p>Prototype building with mentor guidance</p>
              </div>
            </div>

            <div className="horizontal-timeline-event">
              <div className="horizontal-timeline-dot"></div>
              <div className="horizontal-timeline-title">
                <h4>Review</h4>
                <span>Week 11</span>
              </div>
              <div className="horizontal-timeline-content">
                <p>Mid-program evaluation and feedback</p>
              </div>
            </div>

            <div className="horizontal-timeline-event">
              <div className="horizontal-timeline-dot"></div>
              <div className="horizontal-timeline-title">
                <h4>Refinement</h4>
                <span>Week 12-13</span>
              </div>
              <div className="horizontal-timeline-content">
                <p>Final improvements and pitch preparation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidReviewTimeline;