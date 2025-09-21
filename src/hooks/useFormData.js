import { useState, useEffect } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);

  // Load saved form data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("projectForm");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Calculate progress and save to localStorage
  useEffect(() => {
    const fields = [
      "Cohort", "Track", "FullName", "Institution", "Course", "Year",
      "Email", "Phone", "ProjectTitle", "ProblemStatement", "Context",
      "Stakeholders", "Solution", "WorkingPrinciple", "Novelty", "Impact",
      "Budget", "Timeline", "TeamMembers", "HasMentor", "TMAMember", "TMAChapter"
    ];
    
    const filled = fields.filter((f) => formData[f] && formData[f].trim() !== "").length;
    setProgress(Math.round((filled / fields.length) * 100));
    localStorage.setItem("projectForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearFormData = () => {
    setFormData({});
    localStorage.removeItem("projectForm");
  };

  return {
    formData,
    setFormData,
    progress,
    handleChange,
    clearFormData
  };
};