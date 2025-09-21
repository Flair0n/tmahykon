export const getFieldMeta = (field) => {
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
    };
  } else if (field === "Email" || field === "MentorEmail") {
    return { name: field, type: "email" };
  } else if (field === "Phone" || field === "MentorPhone") {
    return { name: field, type: "tel" };
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
    };
  } else if ([
    "Course", "FullName", "Institution", "ProjectTitle",
    "MentorName", "MentorDepartment", "MentorInstitution"
  ].includes(field)) {
    return { name: field, type: "text" };
  } else if ([
    "ProblemStatement", "Context", "Stakeholders", "Solution",
    "WorkingPrinciple", "Novelty", "Impact", "Timeline", "TeamMembers"
  ].includes(field)) {
    return { name: field, type: "textarea" };
  } else if (field === "Budget") {
    return { name: field, type: "number", min: 0, max: 9999999999 };
  } else {
    return { name: field, type: "textarea" };
  }
};