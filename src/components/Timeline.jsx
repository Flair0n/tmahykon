import React from "react";
import "../styles/Timeline.css";

const Timeline = () => {
  return (
    <section className="timeline-area section-padding-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading text-center">
              <h2>Challenge Timeline</h2>
              <p>A detailed 90-day journey from idea to innovation</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="timeline-content">
              <div className="single-timeline-content timeline-event-masterclass">
                <div className="timeline-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <span className="timeline-year">Day 1-7</span>
                <h4 className="timeline-title">Registration & Kick-off</h4>
                <p className="timeline-desc">
                  Team registration, idea submission, and challenge orientation. 
                  Meet mentors and understand the evaluation criteria.
                </p>
                <span className="timeline-date-detail">Week 1: Foundation</span>
              </div>

              <div className="single-timeline-content timeline-event-review">
                <div className="timeline-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <span className="timeline-year">Day 8-21</span>
                <h4 className="timeline-title">Ideation & Validation</h4>
                <p className="timeline-desc">
                  Refine your concept, conduct market research, and validate 
                  technical feasibility with mentor guidance.
                </p>
                <span className="timeline-date-detail">Week 2-3: Research & Planning</span>
              </div>

              <div className="single-timeline-content timeline-event-masterclass">
                <div className="timeline-icon">
                  <i className="fas fa-cogs"></i>
                </div>
                <span className="timeline-year">Day 22-60</span>
                <h4 className="timeline-title">Development Phase</h4>
                <p className="timeline-desc">
                  Build your prototype with continuous mentorship. Weekly check-ins 
                  and milestone reviews to track progress.
                </p>
                <span className="timeline-date-detail">Week 4-8: Build & Iterate</span>
              </div>

              <div className="single-timeline-content timeline-event-review">
                <div className="timeline-icon">
                  <i className="fas fa-search"></i>
                </div>
                <span className="timeline-year">Day 61-75</span>
                <h4 className="timeline-title">Mid-Review & Testing</h4>
                <p className="timeline-desc">
                  Present your prototype to review panel. Receive feedback 
                  and implement improvements for final submission.
                </p>
                <span className="timeline-date-detail">Week 9-10: Review & Refine</span>
              </div>

              <div className="single-timeline-content timeline-event-pitch">
                <div className="timeline-icon">
                  <i className="fas fa-presentation"></i>
                </div>
                <span className="timeline-year">Day 76-85</span>
                <h4 className="timeline-title">Pitch Preparation</h4>
                <p className="timeline-desc">
                  Professional pitch training, presentation coaching, and 
                  final prototype refinements for the grand finale.
                </p>
                <span className="timeline-date-detail">Week 11-12: Presentation Prep</span>
              </div>

              <div className="single-timeline-content timeline-event-pitch">
                <div className="timeline-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <span className="timeline-year">Day 86-90</span>
                <h4 className="timeline-title">Final Pitch & Awards</h4>
                <p className="timeline-desc">
                  Present to industry experts and investors. Winners receive 
                  cash prizes, incubation support, and career opportunities.
                </p>
                <span className="timeline-date-detail">Week 13: Grand Finale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;