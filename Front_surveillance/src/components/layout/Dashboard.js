import React, { useState, useEffect } from 'react';
import { 
  Description, 
  Person, 
  Business, 
  Visibility 
} from '@mui/icons-material';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch teachers count
      const teachersResponse = await axios.get('http://localhost:8080/api/teachers');
      setTeacherCount(teachersResponse.data.length);

      // Fetch departments count
      const departmentsResponse = await axios.get('http://localhost:8080/api/departments');
      setDepartmentCount(departmentsResponse.data.length);

      const examsResponse = await axios.get('http://localhost:8080/api/exams/all');
      setExamCount(examsResponse.data.length);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching counts:', error);
      setLoading(false);
    }
  };
  const stats = [
    {
      title: "Exams",
      value: examCount,
      subtitle: "Nombre total d'exams du dernier session",
      icon: <Description />,
    },
    {
      title: "Enseignants",
      value: teacherCount,
      trend: "+19% par rapport au mois dernier",
      subtitle: "Nombre total d'enseignants dans la faculté",
      icon: <Person />,
    },
    {
      title: "Nombre total de départements",
      value: departmentCount,
      subtitle: "",
      icon: <Business />,
    },
    {
      title: "Surveillance actuelle",
      value: "0.22",
      subtitle: "Moyenne de surveillance par enseignant dans la dernière session par demi journé",
      icon: <Visibility />,
    }
  ];

  const recentExams = [
    { code: "NA", prof: "ABOUAVM", name: "culture et art skills" },
    { code: "NA", prof: "BENYISS", name: "langues etrangeres" },
    { code: "NA", prof: "EL HADRANI", name: "mathematiques pour la chimie" },
    { code: "NA", prof: "ZAKARIA", name: "mecanique quantique" },
    { code: "NA", prof: "EL HADRANI", name: "chimie descriptive i/diagrammes de" }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Sessions</h1>
        <p className="subtitle">Gérer les sessions</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.title}</h3>
            </div>
            <div className="stat-value">
              {loading ? 'Loading...' : stat.value}
            </div>
            {stat.trend && <div className="stat-trend">{stat.trend}</div>}
            <div className="stat-subtitle">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Aperçu</h2>
          <div className="chart-container">
            {/* Add your chart component here */}
          </div>
        </div>

        <div className="recent-exams">
          <h2>Exams récentes</h2>
          <p className="section-subtitle">Les cinq dernier exams</p>
          <div className="exams-list">
            {recentExams.map((exam, index) => (
              <div className="exam-item" key={index}>
                <div className="exam-code">{exam.code}</div>
                <div className="exam-prof">{exam.prof}</div>
                <div className="exam-name">{exam.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;