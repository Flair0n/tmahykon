import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./formScrollbar.css";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FormSection from "./components/FormSection";
import { useRef } from "react";
import ProgressBar from "./components/ProgressBar";
// RazorpayButton will be replaced with inline Razorpay integration
import Navbar from "../src copy/components/Navbar";
import Footer from "../src copy/components/Footer";
import heroBg from "../src copy/assets/hero-bg.svg";

export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const [status, setStatus] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [openSections, setOpenSections] = useState({});

  const mentorFields = [
    "MentorName", "MentorEmail", "MentorDepartment", "MentorInstitution", "MentorPhone"
  ];
  const fields = [
    "Cohort", "Track", "FullName", "Institution", "Course", "Year",
    "Email", "Phone", "ProjectTitle", "ProblemStatement", "Context",
    "Stakeholders", "Solution", "WorkingPrinciple", "Novelty", "Impact",
    "Budget", "Timeline", "TeamMembers", "HasMentor", "TMAMember", "TMAChapter"
  ];

  const questions = {
    Cohort: "Which cohort does your project belong to (Coder / Maker / Leader)?",
    Track: "Are you applying under College Track (UG / PG / PhD) or Fresher Track (2025 pass-out)?",
  FullName: "Team Leader",
  Institution: "Institution",
    Course: "Course",
    Year: "Year",
    Email: "Contact Email",
    Phone: "Contact Phone",
    ProjectTitle: "What is your project title?",
    ProblemStatement: "What is the problem you are solving?",
    Context: "Why is this problem important or relevant today?",
    Stakeholders: "Who are the key stakeholders/beneficiaries affected by this problem?",
    Solution: "Describe your solution in simple words.",
    WorkingPrinciple: "What is the working principle of your solution?",
    Novelty: "How does your solution stand out from existing alternatives?",
    Impact: "What impact will your solution create (social, environmental, business)?",
    Budget: "Budget (in ₹)",
    Timeline: "Outline a 90-day timeline with major milestones.",
    TeamMembers: "List your team members (name, discipline, year).",
    HasMentor: "Do you have a mentor?",
    MentorName: "Mentor's Full Name",
    MentorEmail: "Mentor's Email Address",
    MentorDepartment: "Mentor's Department",
    MentorInstitution: "Mentor's Institution",
    MentorPhone: "Mentor's Contact Number",
  TMAMember: "Are you a member of a TMA student chapter?",
  TMAChapter: "If yes, which TMA student chapter do you belong to?"
  };

  const sections = {
    "Basic Information": [
      "Cohort", "Track", "FullName", "Institution", "Course", "Year",
      "Email", "Phone", "ProjectTitle"
    ],
    "Problem & Need-Gap": ["ProblemStatement", "Context", "Stakeholders"],
    "Solution & Working": ["Solution", "WorkingPrinciple", "Novelty"],
    "Impact": ["Impact"],
    "Budget & Timeline": ["Budget", "Timeline"],
    "Team & Mentors": [
      "TeamMembers"
    ],
    "Membership": ["TMAMember"]
  };

  useEffect(() => {
    const saved = localStorage.getItem("projectForm");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const filled = fields.filter((f) => formData[f] && formData[f].trim() !== "").length;
    setProgress(Math.round((filled / fields.length) * 100));
    localStorage.setItem("projectForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Two-step: Pay, then Submit

  // Payment removed: direct submission only

  // Track missing required fields for highlighting
  const [missingFields, setMissingFields] = useState([]);
  const formRef = useRef();
  const requiredFields = fields.filter(field => {
    if (field === "TMAChapter") {
      return formData.TMAMember && formData.TMAMember.startsWith("Yes");
    }
    return true;
  });
  if (formData.HasMentor && formData.HasMentor === "Yes") {
    requiredFields.push(...mentorFields);
  }
  const missing = requiredFields.filter(field => !(formData[field] && formData[field].toString().trim() !== ""));
  const isFormComplete = missing.length === 0;

  const submitToFirebase = async () => {
    setStatus("Submitting...");
    try {
      const payload = { ...formData, submittedAt: Timestamp.now() };
      await addDoc(collection(db, "registrations"), payload);
      setStatus("✅ Submission successful!");
      setFormData({});
      setPaymentDone(false);
      localStorage.removeItem("projectForm");
    } catch (err) {
      setStatus("❌ Error submitting form. Check console.");
      console.error(err);
    }
  };

  // Direct submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      setMissingFields(missing);
      setStatus("❌ Please fill all required fields.");
      // Scroll to first missing field
      if (missing.length > 0) {
        const el = formRef.current?.querySelector(`[name=\"${missing[0]}\"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setMissingFields([]);
    setStatus("Submitting...");
    try {
      const payload = { ...formData, submittedAt: Timestamp.now() };
      await addDoc(collection(db, "registrations"), payload);
      setStatus("✅ Submission successful!");
      setFormData({});
      localStorage.removeItem("projectForm");
      if (e.target && typeof e.target.reset === 'function') {
        e.target.reset();
      }
    } catch (err) {
      setStatus("❌ Error submitting form. Check console.");
      console.error(err);
    }
  };

  // Payment handler
  const handlePayment = (e) => {
    e.preventDefault();
    if (formData.TMAMember && formData.TMAMember.startsWith("Yes")) {
      window.open("https://rzp.io/rzp/HKi39maX", "_blank");
    } else if (formData.TMAMember && formData.TMAMember.startsWith("No")) {
      window.open("https://rzp.io/rzp/4Dn4L26", "_blank");
    } else {
      setStatus("❌ Please select if you are a TMA member.");
      return;
    }
    setPaymentDone(true);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const fieldStyle = {
    width: "100%",
    maxWidth: "600px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#eee",
    display: "block",
    height: "44px",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...fieldStyle,
    height: "44px",
    resize: "none",
  };

  const largeTextareaStyle = {
    ...textareaStyle,
    height: "120px",
  };

  const labelStyle = {
    width: "100%",
    maxWidth: "600px",
    textAlign: "left",
    color: "#ccc",
    fontSize: "14px",
    marginBottom: "12px",
    paddingLeft: "8px",
    paddingTop: "12px",
    paddingBottom: "12px",
    margin: 0,
    boxSizing: "border-box",
  };

  const getFieldMeta = (field) => {
    if (field === "Cohort") {
      return {
        name: "Cohort",
        type: "select",
        options: [
          { value: "", label: "Select Cohort" },
          { value: "Coder", label: "Coder" },
          { value: "Maker", label: "Maker" },
          { value: "Leader", label: "Leader" },
        ],
        labelStyle,
      };
    } else if (field === "Track") {
      return {
        name: "Track",
        type: "select",
        options: [
          { value: "", label: "Select Track" },
          { value: "College Track", label: "College Track" },
          { value: "Fresher Track", label: "Fresher Track" },
        ],
        labelStyle,
      };
    } else if (field === "TMAMember") {
      return {
        name: "TMAMember",
        type: "select",
        options: [
          { value: "", label: "Select TMA membership status" },
          { value: "Yes ₹500", label: "Yes (₹500)" },
          { value: "No ₹1000", label: "No (₹1000)" },
        ],
        labelStyle,
      };
    } else if (field === "Email" || field === "MentorEmail") {
      return { name: field, type: "email", labelStyle };
    } else if (field === "Phone" || field === "MentorPhone") {
      return { name: field, type: "tel", labelStyle };
    } else if (field === "Year") {
      return {
        name: "Year",
        type: "select",
        options: [
          { value: "", label: "Select Year" },
          ...Array.from({ length: 5 }, (_, i) => {
            const year = 2025 + i;
            return { value: year.toString(), label: year.toString() };
          })
        ],
        labelStyle,
      };
    } else if ([
      "Course", "FullName", "Institution", "ProjectTitle",
      "MentorName", "MentorDepartment", "MentorInstitution"
    ].includes(field)) {
      return { name: field, type: "text", labelStyle };
    } else if ([
      "ProblemStatement", "Context", "Stakeholders", "Solution",
      "WorkingPrinciple", "Novelty", "Impact", "Timeline", "TeamMembers"
    ].includes(field)) {
      return { name: field, type: "textarea", labelStyle, textareaStyle: largeTextareaStyle };
    } else if (field === "Budget") {
      return { name: field, type: "number", labelStyle, min: 0, max: 9999999999 };
    } else {
      return { name: field, type: "textarea", labelStyle, textareaStyle };
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      {/* Progress bar fixed to the right edge of the viewport, full height */}
      {/* Progress bar as the page background */}
      {window.location.pathname === "/form" && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
          <ProgressBar progress={progress} />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1,
          color: "#eee",
          padding: "40px 20px 0 20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Main Form Container (scrollable) */}
        <div
          style={{
            maxWidth: "800px",
            margin: "100px auto 0", // offset for floating bar
            background: "#1e1e1e",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            textAlign: "center",
            height: "calc(100vh - 140px)",
            overflowY: "auto",
            marginBottom: "48px", // space before footer
          }}
          className="form-scrollbar"
        >
          <h1 style={{ color: "#fff" }}>TMA-Hykon Application Form</h1>
          <form
            ref={formRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* Render all sections, but inject mentor question/section right after TeamMembers */}
            {Object.entries(sections).map(([sectionName, sectionFields]) => (
              <React.Fragment key={sectionName}>
                <FormSection
                  sectionName={sectionName}
                  sectionFields={sectionFields.map(getFieldMeta)}
                  open={!!openSections[sectionName]}
                  toggleSection={toggleSection}
                  questions={questions}
                  formData={formData}
                  onChange={handleChange}
                  fieldStyle={fieldStyle}
                  textareaStyle={textareaStyle}
                  labelStyle={labelStyle}
                  missingFields={missingFields}
                />
                {/* After TeamMembers, show mentor question/section */}
                {sectionFields.includes("TeamMembers") && (
                  <>
                    <div style={{ width: "100%", maxWidth: 600, margin: "16px 0", textAlign: "left" }}>
                      <label style={{ color: "#ccc", fontSize: 16, display: "block", marginBottom: 8 }}>
                        Do you have a mentor?
                      </label>
                      <select
                        name="HasMentor"
                        value={formData.HasMentor || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", background: "#222", color: "#eee" }}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {formData.HasMentor === "Yes" && (
                      <FormSection
                        key="MentorSection"
                        sectionName="Mentor Details"
                        sectionFields={mentorFields.map(getFieldMeta)}
                        open={true}
                        toggleSection={() => {}}
                        questions={questions}
                        formData={formData}
                        onChange={handleChange}
                        fieldStyle={fieldStyle}
                        textareaStyle={textareaStyle}
                        labelStyle={labelStyle}
                      />
                    )}
                  </>
                )}
                {/* After TMAMember, show TMAChapter if Yes */}
                {sectionFields.includes("TMAMember") && formData.TMAMember && formData.TMAMember.startsWith("Yes") && (
                  <div style={{ width: "100%", maxWidth: 600, margin: "16px 0", textAlign: "left" }}>
                    <label style={{ color: "#ccc", fontSize: 16, display: "block", marginBottom: 8 }}>
                      If yes, which TMA student chapter do you belong to?
                    </label>
                    <select
                      name="TMAChapter"
                      value={formData.TMAChapter || ""}
                      onChange={handleChange}
                      style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", background: "#222", color: "#eee" }}
                    >
                      <option value="">Select your TMA student chapter</option>
                      <option value="College of Cooperation Banking and Management (KAU) Agri Business Management, Vellanikkara, Thrissur">College of Cooperation Banking and Management (KAU) Agri Business Management, Vellanikkara, Thrissur</option>
                      <option value="Jyothi Engineering College, Cheruthuruthy, Thrissur">Jyothi Engineering College, Cheruthuruthy, Thrissur</option>
                      <option value="Sahrdaya College of Advanced Studies, Kodakara">Sahrdaya College of Advanced Studies, Kodakara</option>
                      <option value="Sahrdaya Institute of Management Studies (SIMS), Kodakara, Thrissur">Sahrdaya Institute of Management Studies (SIMS), Kodakara, Thrissur</option>
                      <option value="Sahrdaya College of Engineering and Technology(Autonomous)">Sahrdaya College of Engineering and Technology(Autonomous)</option>
                      <option value="Government Engineering College, Thrissur">Government Engineering College, Thrissur</option>
                      <option value="Holy Grace Academy of Management Studies, Mala, Thrissur">Holy Grace Academy of Management Studies, Mala, Thrissur</option>
                      <option value="IES College of Engineering, Chittilappilly, Thrissur">IES College of Engineering, Chittilappilly, Thrissur</option>
                      <option value="Nirmala College of Management Studies, Chalakkudy, Thrissur">Nirmala College of Management Studies, Chalakkudy, Thrissur</option>
                      <option value="St.Mary's College, Thrissur">St.Mary's College, Thrissur</option>
                      <option value="Nirmala Engineering college">Nirmala Engineering college</option>
                      <option value="LIttle Flower College, Guruvayoor">LIttle Flower College, Guruvayoor</option>
                      <option value="Christ College (Autonomous), Irinjalakuda, Thrissur">Christ College (Autonomous), Irinjalakuda, Thrissur</option>
                      <option value="Nehru School of Management, Pampady, Thrissur">Nehru School of Management, Pampady, Thrissur</option>
                      <option value="Mar Dionysius College, Pazhanji">Mar Dionysius College, Pazhanji</option>
                      <option value="Dr John Matthai Centre, Thrissur">Dr John Matthai Centre, Thrissur</option>
                      <option value="Prajyoti Niketan College, Pudukad, Thrissur">Prajyoti Niketan College, Pudukad, Thrissur</option>
                    </select>
                  </div>
                )}
              </React.Fragment>
            ))}
            {/* Payment/Submit button block - only one set, styled */}
            <div className="form-actions" style={{ marginTop: 24 }}>
              {!paymentDone ? (
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handlePayment}
                  style={{
                    padding: "10px 20px",
                    background: "#528FF0",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginTop: "10px",
                    cursor: "pointer",
                    opacity: 1,
                  }}
                >
                  Go to Payment
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={status === "Submitting..."}
                  style={{
                    padding: "10px 20px",
                    background: "#528FF0",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginTop: "10px",
                    cursor: "pointer",
                    opacity: 1,
                  }}
                >
                  Submit Registration
                </button>
              )}
            </div>
            {/* Status/Success/Error message */}
            {status && (
              status.startsWith("✅") ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}
                >
                  <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />
                  <motion.svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                  >
                    <circle cx="30" cy="30" r="28" fill="#4CAF50" />
                    <polyline
                      points="18,32 27,41 43,23"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <span style={{ color: "#4CAF50", fontSize: 20, marginTop: 12 }}>
                    {status.replace(/^✅\s*/, "")}
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  initial={false}
                  animate={status.includes("Error") ? { x: [0, -5, 5, -5, 5, 0] } : { opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    marginTop: "20px",
                    fontSize: "16px",
                    color: "#FF5252",
                  }}
                >
                  {status}
                </motion.p>
              )
            )}
            {/* Disclaimer and Contact inside the form */}
            <div
              style={{
                maxWidth: 600,
                margin: '32px auto 0',
                background: '#232526',
                borderRadius: 10,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                border: '1px solid #2c2c2c',
                padding: '28px 32px',
                textAlign: 'left',
                color: '#eee',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, letterSpacing: 1, color: '#FF5252', textTransform: 'uppercase', textAlign: 'center' }}>
                Disclaimer
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 18, color: '#e0e0e0', textAlign: 'center' }}>
                All information provided in this registration form must be accurate and truthful. If any detail is found to be false or misleading, the team will be subject to immediate disqualification from the event.
              </div>
              {/* If you have any doubts section removed as per request */}
            </div>
          </form>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
