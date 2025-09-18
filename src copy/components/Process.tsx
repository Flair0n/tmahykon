
import React from "react";
import "../styles/Process.css";
import { motion } from "framer-motion";

const Process: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Registration",
      desc: "Teams or individuals register for the challenge through our online portal.",
    },
    {
      num: "02",
      title: "Idea Submission",
      desc: "Participants submit their innovative ideas for renewable energy solutions.",
    },
    {
      num: "03",
      title: "Evaluation",
      desc: "Our panel of experts evaluates submissions based on innovation, feasibility, and impact.",
    },
    {
      num: "04",
      title: "Finalists Selection",
      desc: "Top ideas are selected as finalists for the next round of the challenge.",
    },
    {
      num: "05",
      title: "Prototype Development",
      desc: "Finalists receive resources and mentorship to develop prototypes of their solutions.",
    },
    {
      num: "06",
      title: "Final Presentation",
      desc: "Finalists present their prototypes to a panel of judges and industry experts.",
    },
  ];

  return (
    <section className="process-area section-padding-100" id="process">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-heading">
              <h4>How It Works</h4>
              <h2>Our Process</h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="process-timeline">
              {steps.map((step, idx) => (
                <motion.div
                  className="single-timeline-area"
                  key={step.num}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                >
                  <div className="timeline-date">
                    <p>{step.num}</p>
                  </div>
                  <div className="timeline-content">
                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
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

export default Process;
