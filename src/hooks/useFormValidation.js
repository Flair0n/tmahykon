import { useState } from 'react';

export const useFormValidation = (formData) => {
  const [missingFields, setMissingFields] = useState([]);

  const fields = [
    "Cohort", "Track", "FullName", "Institution", "InstitutionType", "Course", "Year",
    "City", "State", "Email", "Phone", "ProjectTitle", "ProblemStatement", "Context",
    "Stakeholders", "Solution", "WorkingPrinciple", "Novelty", "Impact",
    "Budget", "Timeline", "TeamMembers", "HasMentor", "TMAMember"
  ];

  const mentorFields = [
    "MentorName", "MentorEmail", "MentorDepartment", "MentorInstitution", "MentorPhone"
  ];

  const getRequiredFields = () => {
    let requiredFields = fields.filter(field => {
      if (field === "TMAChapter") {
        return formData.TMAMember && formData.TMAMember.startsWith("Yes");
      }
      return true;
    });

    if (formData.HasMentor && formData.HasMentor === "Yes") {
      requiredFields.push(...mentorFields);
    }

    if (formData.TMAMember && formData.TMAMember.startsWith("Yes")) {
      requiredFields.push("TMAChapter");
    }

    return requiredFields;
  };

  const validateForm = () => {
    const requiredFields = getRequiredFields();
    const missing = requiredFields.filter(field => 
      !(formData[field] && formData[field].toString().trim() !== "")
    );
    
    setMissingFields(missing);
    return missing.length === 0;
  };

  const isFormComplete = () => {
    const requiredFields = getRequiredFields();
    const missing = requiredFields.filter(field => 
      !(formData[field] && formData[field].toString().trim() !== "")
    );
    return missing.length === 0;
  };

  return {
    missingFields,
    setMissingFields,
    validateForm,
    isFormComplete: isFormComplete()
  };
};