import { useState, useEffect } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("projectForm");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Calculate progress and save to localStorage
  useEffect(() => {
    // Core required fields
    const coreFields = [
      "Cohort", "Track", "FullName", "Institution", "InstitutionType", "Course", "Year",
      "City", "State", "Email", "Phone", "ProjectTitle", "ProblemStatement", "Context",
      "Stakeholders", "Solution", "WorkingPrinciple", "Novelty", "Impact",
      "Budget", "Timeline", "TeamMembers", "HasMentor", "TMAMember"
    ];
    
    // Add conditional fields based on form state
    let totalFields = [...coreFields];
    let filledFields = coreFields.filter((f) => formData[f] && formData[f].trim() !== "");
    
    // Add mentor fields if HasMentor is "Yes"
    if (formData.HasMentor === "Yes") {
      const mentorFields = ["MentorName", "MentorEmail", "MentorDepartment", "MentorInstitution", "MentorPhone"];
      totalFields = [...totalFields, ...mentorFields];
      filledFields = [...filledFields, ...mentorFields.filter((f) => formData[f] && formData[f].trim() !== "")];
    }
    
    // Add TMA chapter field if TMAMember starts with "Yes"
    if (formData.TMAMember && formData.TMAMember.startsWith("Yes")) {
      totalFields = [...totalFields, "TMAChapter"];
      if (formData.TMAChapter && formData.TMAChapter.trim() !== "") {
        filledFields = [...filledFields, "TMAChapter"];
      }
    }
    
    const progressPercentage = Math.round((filledFields.length / totalFields.length) * 100);
    setProgress(progressPercentage);
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