import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard'; // Ensure this file is named Dashboard.jsx
import Profile from './Profile'; // Ensure this file is named Profile.jsx
import Assignment from './Assignments';
import EventsPage from './EventsPage';
import LeaderBoard from './LeaderBoard';
import TodayClass from './TodayClass';
import StudyGoal from './Studygoal'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Assignments" element={<Assignment />} />
        <Route path="EventsPage" element={<EventsPage />} />
        <Route path="LeaderBoard" element={<LeaderBoard />} />
        <Route path="TodayClass" element={<TodayClass />} />
        <Route path="/goals" element={<StudyGoal />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
