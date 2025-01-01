import React from "react";

const RecentExams = () => {
  const exams = [
    { id: 1, name: "Culture et Art Skills" },
    { id: 2, name: "Langues étrangères" },
    { id: 3, name: "Mathématiques pour la Chimie" },
    { id: 4, name: "Mécanique Quantique" },
    { id: 5, name: "Chimie descriptive" },
  ];

  return (
    <div className="recent-exams">
      <h2>Exams récentes</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>{exam.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentExams;
