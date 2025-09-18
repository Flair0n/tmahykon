import React from "react";
import { motion } from "framer-motion";
import "../styles/Timeline.css";
import "../styles/MidReviewTimeline.css";

const MidReviewTimeline: React.FC = () => {
  // Example horizontal timeline data
  const events = [
    { title: "IRP Master class 1", date: "21st October 2025" },
    { title: "IRP Master class 2", date: "23rd October 2025" },
    { title: "IRP Master class 3", date: "22nd November 2025" },
    { title: "IRP Master class 4", date: "3rd January 2026" },
    { title: "IRP Master class 5", date: "10th January 2026" },
  ];

  return (
    <section className="midreview-timeline-area section-padding-100 innovation-readiness-section" id="innovation-readiness-timeline">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading innovation-readiness-heading">
              <h2>Innovation Readiness Programme (IRP) Masterclass</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="horizontal-timeline">
              {events.map((item, idx) => (
                <motion.div
                  className="horizontal-timeline-event"
                  key={item.title + item.date}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
                >
                  <div className="horizontal-timeline-content">
                    <div className="horizontal-timeline-title">{item.title}</div>
                    <div className="horizontal-timeline-date">{item.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidReviewTimeline;
