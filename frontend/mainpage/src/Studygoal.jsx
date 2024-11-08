import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studygoal.css';

const StudyGoals = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/check', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchGoals(); // Fetch goals only if authenticated
        } else {
          window.location.href='http://localhost:3000/auth/login'
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Fetch goals from the backend
  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:3000/study/goals', {
        credentials: 'include',
      });
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Add a new goal to the backend and update the state
  const handleAddGoal = async () => {
    if (goalInput && targetDate) {
      const newGoal = { goal: goalInput, targetDate, notes, completed: false };

      try {
        const response = await fetch('http://localhost:3000/study/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newGoal),
        });

        const savedGoal = await response.json();
        setGoals([...goals, savedGoal]);
        setGoalInput('');
        setTargetDate('');
        setNotes('');
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    } else {
      alert('Please fill in both goal and target date');
    }
  };

  // Toggle goal completion and update it on the backend
  const handleToggleCompletion = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3000/study/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !completed }),
      });

      const updatedGoal = await response.json();
      setGoals(goals.map((goal) => (goal.id === id ? updatedGoal : goal)));
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Delete a goal from the backend and update the state
  const handleDeleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:3000/study/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    isAuthenticated && (
      <div className="study-goals">
        <h2>Set Your Study Goals</h2>
        <div className="goal-input">
          <input
            type="text"
            placeholder="Enter your study goal"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <textarea
            placeholder="Add notes or resources"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <button onClick={handleAddGoal}>Add Goal</button>
        </div>
        <div className="goal-list">
          {goals.length === 0 && <p>No goals set yet. Start adding your goals!</p>}
          {goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <h3 style={{ textDecoration: goal.completed ? 'line-through' : 'none' }}>
                {goal.goal}
              </h3>
              <p>Target Date: {goal.targetDate}</p>
              <p>{goal.notes}</p>
              <button onClick={() => handleToggleCompletion(goal.id, goal.completed)}>
                {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => handleDeleteGoal(goal.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default StudyGoals;
