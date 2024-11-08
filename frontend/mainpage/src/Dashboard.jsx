import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Check authentication status
    fetch("http://localhost:3000/auth/check", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchUserData();
          fetchDashboardData();
        } else {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login";
        }
      })
      .catch((error) => console.error("Error checking authentication:", error));
  }, [navigate]);

  const fetchUserData = () => {
    fetch("http://localhost:3000/profile/userdata", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const fetchDashboardData = () => {
    fetch("http://localhost:3000/api/dashboard", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setClasses(data.classes || []);
        setAssignments(data.assignments || []);
        setGoals(data.goals || []);
        setAchievements(data.achievements || []);
        setEvents(data.events || []);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  };

  const handleLogout = () => {
    fetch("http://localhost:3000/auth/logout", { // Replace with your logout URL
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login";
        }
      })
      .catch((error) => console.error("Error logging out:", error));
  };

  return (
    isAuthenticated && (
      <div className="dashboard-body">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {userData?.student_name || "User"}!</span>
            <span>Points: {userData?.points || 0}</span>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </header>

        <main className="dashboard-content">
          <Link to="/TodayClass" className="dashboard-section">
            <h2>Today's Classes</h2>
          </Link>

          <Link to="/assignments" className="dashboard-section">
            <h2>Assignments</h2>
          </Link>

          <Link to="/goals" className="dashboard-section">
            <h2>Study Goals</h2>
          </Link>

          <Link to="/achievements" className="dashboard-section">
            <h2>Achievements</h2>
            <div className="achievement-list">
              {achievements.map((achievement, index) => (
                <span key={index} className="achievement-badge">
                  {achievement}
                </span>
              ))}
            </div>
          </Link>

          <Link to="/EventsPage" EventsPage className="dashboard-section">
            <h2>Campus Events</h2>
          </Link>

          <Link to="Club And Committee"  className="dashboard-section">
            <h2>Club And Committee</h2>
          </Link>


        </main>
      </div>
      </div>
    )
  );
}

export default Dashboard;
