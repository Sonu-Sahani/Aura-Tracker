import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodayClass.css';

function Routine() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todayClasses, setTodayClasses] = useState([]);
  const [today, setToday] = useState(new Date().getDay());

  useEffect(() => {
    // Check authentication status
    fetch("http://localhost:3000/auth/check", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchTodayClasses();
        } else {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login";
        }
      })
      .catch((error) => console.error("Error checking authentication:", error));

    const interval = setInterval(() => {
      const newDay = new Date().getDay();
      if (newDay !== today) {
        setToday(newDay);
        fetchTodayClasses();
      }
    }, 60000); // Check every minute if the day has changed

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [today, navigate]);

  const fetchTodayClasses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/class/routine?day=${today}`, { credentials: "include" });
      const data = await response.json();
      setTodayClasses(data);
    } catch (error) {
      console.error("Error fetching today's routine data:", error);
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    isAuthenticated && (
      <div className="routine-container">
        <h1>Class Routine for {daysOfWeek[today]}</h1>
        <div className="class-details">
          {todayClasses.length > 0 ? (
            todayClasses.map((classItem, idx) => (
              <div key={idx} className="class-item">
                <p><strong>Time:</strong> {classItem.time}</p>
                <p><strong>Subject:</strong> {classItem.subject}</p>
                <p><strong>Teacher:</strong> {classItem.teacher}</p>
                <p><strong>Venue:</strong> {classItem.Venue}</p>
              </div>
            ))
          ) : (
            <p>No classes scheduled for today.</p>
          )}
        </div>
      </div>
    )
  );
}

export default Routine;
