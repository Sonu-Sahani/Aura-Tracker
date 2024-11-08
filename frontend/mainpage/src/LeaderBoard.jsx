// src/Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/user/leaderboard')
      .then((response) => {
        // Sort players by score in descending order
        const sortedPlayers = response.data.sort((a, b) => b.points - a.points);
        setPlayers(sortedPlayers);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);
  

  return (
    <div id='leaderboard-body'>
    <div  className="leaderboard-container">
      <div className="leaderboard-header">
        {/* <img src="logo.png" alt="Logo" className="leaderboard-logo" /> */}
        <h1>LEADERBOARD</h1>
      </div>
      <div className="leaderboard-list">
        {players.map((player, index) => (
          <div
            className={`leaderboard-item color-${(index % 5) + 1}`}
            key={player.user_id}
          >
            <div className="leaderboard-rank">
              <span>{index + 1}</span>
            </div>
            <div className="leaderboard-info">
              <h3>{player.student_name}</h3>
              <p>{player.profile_id || "Participant"}</p>
            </div>
            <div className="leaderboard-score">
              <span>{player.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Leaderboard;
