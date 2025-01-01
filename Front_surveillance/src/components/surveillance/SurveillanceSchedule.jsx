import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { SessionContext } from '../../contexts/SessionContext';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import './SurveillanceSchedule.css';
import axios from 'axios';


const SurveillanceSchedule = () => {
    const { selectedSessionId } = useContext(SessionContext);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [surveillanceMenuAnchor, setSurveillanceMenuAnchor] = useState(null);
    const [surveillances, setSurveillances] = useState([]);
    const [availableExams, setAvailableExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [sessionDates, setSessionDates] = useState({
        startDate: null,
        endDate: null,
        currentStartDate: null
      });
    const SURVEILLANCE_TYPES = {
        RESERVISTE: 'RR',
        NO_SURVEILLANCE: 'NO',
        TOURNANT: 'TT',
        BACKUP: 'B'
      };
    const getSurveillance = (teacherId, date, timeSlotId) => {
      return surveillances.find(surv => 
        surv.teacherId === teacherId && 
        surv.date === date.toISOString().split('T')[0] && 
        surv.timeSlotId === timeSlotId
      );
    };
    useEffect(() => {
      if (selectedDepartment && sessionDates.currentStartDate) {
        fetchSurveillances();
      }
    }, [selectedDepartment, sessionDates.currentStartDate]);

  
    // Time slots for the schedule
    const fetchTimeSlots = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/timeslots/session/${selectedSessionId}`);
          if (!response.ok) throw new Error('Failed to fetch time slots');
          const data = await response.json();
          
          // Sort time slots by period and start time
          const sortedTimeSlots = data.sort((a, b) => {
            if (a.period === b.period) {
              return a.startTime.localeCompare(b.startTime);
            }
            return a.period === 'MORNING' ? -1 : 1;
          });
          
          setTimeSlots(sortedTimeSlots);
        } catch (err) {
          throw new Error('Error fetching time slots: ' + err.message);
        }
      };
    
      const getFormattedTime = (time) => {
        return time.substring(0, 5); // Format HH:mm
      };
    
      const getPeriodLabel = (period) => {
        return period === 'MORNING' ? 'Matin' : 'Après-midi';
      };

        // Group time slots by period for display
        const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
            if (!acc[slot.period]) {
            acc[slot.period] = [];
            }
            acc[slot.period].push(slot);
            return acc;
        }, {});

    // Render table headers grouped by period (Matin / Après-midi)
    const renderTimeSlotHeaders = () => {
        return Object.entries(groupedTimeSlots).map(([period, slots]) => (
        <React.Fragment key={period}>
            {slots.map((slot) => (
            <th
                key={`${period}-${slot.id || `${slot.startTime}-${slot.endTime}`}`}
                className="border px-4 py-2 bg-gray-50"
            >
                <div>{getPeriodLabel(period)}</div>
                <div className="text-xs">{`${getFormattedTime(slot.startTime)} - ${getFormattedTime(slot.endTime)}`}</div>
            </th>
            ))}
        </React.Fragment>
        ));
    };
  

    useEffect(() => {
        if (selectedSessionId) {
          fetchSessionDates();
          fetchTimeSlots();
        }
      }, [selectedSessionId]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        // Fetch teachers when a department is selected
        if (selectedDepartment) {
            fetchTeachers(selectedDepartment);
        }
    }, [selectedDepartment]);

    const fetchSessionDates = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/sessions/${selectedSessionId}`);
            if (!response.ok) throw new Error('Failed to fetch session dates');
            const sessionData = await response.json();
            
            const startDate = new Date(sessionData.dateDebut);
            const endDate = new Date(sessionData.dateFin);
            
            setSessionDates({
                startDate,
                endDate,
                currentStartDate: startDate // Start with the first date
            });
        } catch (err) {
            setError('Error fetching session dates: ' + err.message);
        }
    };
    
    const getDisplayDates = () => {
        if (!sessionDates.currentStartDate) return [];
        
        const dates = [];
        let currentDate = new Date(sessionDates.currentStartDate);
        
        for (let i = 0; i < 3; i++) {
            if (currentDate <= sessionDates.endDate) {
                dates.push(new Date(currentDate)); // Push a copy of the date
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return dates;
    };
    
    
    const getDateRangeDisplay = () => {
        if (!sessionDates.currentStartDate) return '';
        
        const startDate = new Date(sessionDates.currentStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 2);
        
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        const start = formatter.format(startDate);
        const end = formatter.format(endDate);
        return `${start.split(' ')[0]}-${end.split(' ')[0]} ${end.split(' ')[1]} ${end.split(' ')[2]}`;
    };
    
    
      const navigateDates = (direction) => {
        if (!sessionDates.currentStartDate) return;
        
        const newDate = new Date(sessionDates.currentStartDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 3 : -3));
        
        // Ensure the new date doesn't go outside the bounds
        if (newDate >= sessionDates.startDate && newDate <= sessionDates.endDate) {
            setSessionDates((prev) => ({
                ...prev,
                currentStartDate: newDate
            }));
        }
    };
    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/departments');
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            const data = await response.json();
            setDepartments(data);
            // Set the first department as selected by default if available
            if (data.length > 0) {
                setSelectedDepartment(data[0].id.toString());
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTeachers = async (departmentId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/departments/${departmentId}/teachers`);
            if (!response.ok) throw new Error('Failed to fetch teachers');
            const data = await response.json();
            setTeachers(data);
        } catch (err) {
            setError('Error fetching teachers: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchSurveillances = async () => {
      if (!selectedDepartment || !sessionDates.currentStartDate) return;
    
      try {
        // Format dates to YYYY-MM-DD
        const startDate = sessionDates.currentStartDate.toISOString().split('T')[0];
        const endDate = new Date(sessionDates.currentStartDate);
        endDate.setDate(endDate.getDate() + 2);
        const formattedEndDate = endDate.toISOString().split('T')[0];
    
        console.log('Fetching surveillances with params:', {
          departmentId: selectedDepartment,
          startDate,
          endDate: formattedEndDate
        });
        
        const response = await axios.get('http://localhost:8080/api/surveillances', {
          params: {
            departmentId: selectedDepartment,
            startDate,
            endDate: formattedEndDate
          }
        });
        
        setSurveillances(response.data);
      } catch (error) {
        console.error('Error fetching surveillances:', error);
        setError('Failed to fetch surveillances');
      }
    };
    
    // Add this useEffect to fetch surveillances when needed
    useEffect(() => {
      if (selectedDepartment && sessionDates.currentStartDate) {
        fetchSurveillances();
      }
    }, [selectedDepartment, sessionDates.currentStartDate]);

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const renderSurveillanceType = (type) => {
        switch (type) {
          case 'RESERVISTE':
            return <div className="surveillance-type reserviste">RR</div>;
          case 'TOURNANT':
            return <div className="surveillance-type tournant">TT</div>;
          default:
            return null;
        }
      };
    
      if (loading) {
        return <div className="loading-state">Loading schedule data...</div>;
      }
    
      if (error) {
        return <div className="error-state">Error: {error}</div>;
      }
    const displayDates = getDisplayDates();
    const formatTime = (time) => time.substring(0, 5);
    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const handleCellClick = (event, teacherId, date, timeSlotId) => {
      event.preventDefault();
      setSelectedCell({
        teacherId,
        date,
        timeSlotId
      });
      // First fetch available exams for this date and time slot
      fetchAvailableExams(date, timeSlotId);
      setSurveillanceMenuAnchor(event.currentTarget);
    };
    const handleSurveillanceTypeSelect = async (type) => {
      if (!selectedCell) return;
    
      try {
        const response = await axios.post('http://localhost:8080/api/surveillances', {
          departmentId: selectedDepartment,
          teacherId: selectedCell.teacherId,
          type: type
        });
    
        await fetchSurveillances();
        setSurveillanceMenuAnchor(null);
        setSelectedCell(null);
      } catch (error) {
        console.error('Error creating surveillance:', error.response?.data || error.message);
      }
    };

    const fetchAvailableExams = async (date, timeSlotId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exams`, {
          params: {
            date: date.toISOString().split('T')[0],
            timeSlotId: timeSlotId
          }
        });
        setAvailableExams(response.data);
      } catch (error) {
        console.error('Error fetching available exams:', error);
      }
    };

    const handleSurveillanceCreate = async () => {
      if (!selectedCell || !selectedExam) return;

      try {
        const response = await axios.post('http://localhost:8080/api/surveillances', {
          departmentId: selectedDepartment,
          teacherId: selectedCell.teacherId,
          examId: selectedExam.examId,
          type: selectedExam.type
        });

        await fetchSurveillances();
        // Reset states
        setSurveillanceMenuAnchor(null);
        setSelectedCell(null);
        setSelectedExam(null);
      } catch (error) {
        console.error('Error creating surveillance:', error);
      }
    };

    return (
      <div className="surveillance-wrapper">
        <div className="control-panel">
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="department-selector"
          >
            <option value="">Sélectionner un département</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
  
          <div className="date-navigation">
            <button
              onClick={() => navigateDates('prev')}
              disabled={!sessionDates.currentStartDate || 
                       sessionDates.currentStartDate <= sessionDates.startDate}
              className="nav-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="current-date-range">{getDateRangeDisplay()}</span>
            <button
              onClick={() => navigateDates('next')}
              disabled={!sessionDates.currentStartDate || 
                       new Date(sessionDates.currentStartDate)
                       .setDate(sessionDates.currentStartDate.getDate() + 2) >= 
                       sessionDates.endDate}
              className="nav-btn"
            >
              <ChevronRight size={20} />
            </button>
            <button className="download-btn">
              <Download size={20} />
            </button>
          </div>
        </div>
  
        <div className="schedule-container">
          <table className="schedule-table">
            <thead>
              <tr className="column-headers">
                <th className="teacher-header">Enseignants</th>
                {getDisplayDates().map(date => (
                  <React.Fragment key={date.toISOString()}>
                    <th colSpan={2} className="date-header">
                      {formatDate(date)}
                    </th>
                  </React.Fragment>
                ))}
              </tr>
              <tr className="period-headers">
                <th></th> {/* Empty cell for teacher column */}
                {getDisplayDates().map(date => (
                  <React.Fragment key={date.toISOString()}>
                    <th className="period-cell">Matin</th>
                    <th className="period-cell">Après-midi</th>
                  </React.Fragment>
                ))}
              </tr>
              <tr className="time-headers">
                <th></th> {/* Empty cell for teacher column */}
                {getDisplayDates().map(date => (
                  timeSlots.map(slot => (
                    <th key={`${date}-${slot.id}`} className="time-cell">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id} className="teacher-row">
                <td className="teacher-name">{teacher.nom} {teacher.prenom}</td>
                {getDisplayDates().map(date => 
                  timeSlots.map(slot => {
                    const cellSurveillance = getSurveillance(teacher.id, date, slot.id);
                    return (
                      <td key={`${date}-${slot.id}-${teacher.id}`} className="schedule-cell"
                          onClick={(e) => handleCellClick(e, teacher.id, date, slot.id)}>
                        {cellSurveillance && (
                          <span className={`surveillance-indicator ${cellSurveillance.type}`}>
                            {SURVEILLANCE_TYPES[cellSurveillance.type]}
                          </span>
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <Menu
          anchorEl={surveillanceMenuAnchor}
          open={Boolean(surveillanceMenuAnchor)}
          onClose={() => {
            setSurveillanceMenuAnchor(null);
            setSelectedExam(null);
          }}
          className="surveillance-menu"
        >
          <div className="exam-selection">
            <Typography variant="subtitle2" className="menu-title">
              Available Exams
            </Typography>
            <div className="exam-list">
              {availableExams.map((exam) => (
                <div key={exam.id} className="exam-item">
                  <div className="exam-info">
                    <Typography variant="body2">{exam.moduleName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {exam.type}
                    </Typography>
                  </div>
                  <div className="surveillance-types">
                    {Object.entries(SURVEILLANCE_TYPES).map(([type, label]) => (
                      <Button
                        key={type}
                        size="small"
                        variant={selectedExam?.examId === exam.id && selectedExam?.type === type 
                          ? "contained" 
                          : "outlined"}
                        onClick={() => setSelectedExam({ examId: exam.id, type })}
                        className={`type-button ${type.toLowerCase()}`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Divider />
            <div className="menu-actions">
              <Button 
                onClick={() => {
                  setSurveillanceMenuAnchor(null);
                  setSelectedExam(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!selectedExam}
                onClick={handleSurveillanceCreate}
                color="primary"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Menu>
      </div>
    );
  };
  
  export default SurveillanceSchedule;