
import React from "react";
import "../styles/Timeline.css";
import MidReviewTimeline from "./MidReviewTimeline";
import Footer from "./Footer";
import { motion } from "framer-motion";


const Timeline: React.FC = () => {
  // Timeline data with year, title, and description for infographic style
  const events = [
    { title: 'Application opens', desc: 'Start your journey by registering for the challenge.', date: '20th September 2025' },
    { title: 'Application closes', desc: 'Last date to submit your application.', date: '17th October 2025' },
    { title: 'Announcing selected 30 teams', desc: 'Top 30 teams move to the next round.', date: '26th October 2025' },
    { title: 'Online pitch for 30 teams', desc: 'Pitch your ideas online.', date: '1st-2nd November 2025' },
    { title: 'Announcing selected 15 teams', desc: 'Top 15 teams are selected.', date: '5th November 2025' },
    { title: 'Orientation for selected 15 teams', desc: 'Orientation for the finalists.', date: '8th November 2025' },
    { title: 'Mid review meet', desc: 'Midway review of progress.', date: '14th December 2025' },
    { title: 'Final Online pitch', desc: 'Final pitch round online.', date: '17th-18th January 2026' },
    { title: 'Exhibition and Final pitch', desc: 'Showcase and final pitch event.', date: '31st January 2026' },
  ];

  return (
    <>
      <section className="timeline-area section-padding-100" id="timeline">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading">
                <h4>Program Schedule</h4>
                <h2>Challenge Timeline</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div
                className="timeline-events"
                style={{ transformOrigin: 'top center' }}
              >
                {events.map((item, idx) => (
                  <motion.div
                    className={`single-timeline-event modern-timeline-event ${idx % 2 === 0 ? 'left' : 'right'}`}
                    key={item.title + item.date}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
                  >
                    <div className="timeline-date">
                      <span className="timeline-date-detail">{item.date}</span>
                      <span className="timeline-title">{item.title}</span>
                    </div>
                    <div className="timeline-desc">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  <MidReviewTimeline />
  <Footer />
    </>
  );
};

export default Timeline;
