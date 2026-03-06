import React from 'react';
import data from './data/data.json';
import './App.css';

function Leaderboard() {
  const leaderboardData = data.leaderboard;

  // Sort by distance descending for distance leaderboard
  const distanceDescending = [...leaderboardData].sort((a, b) => b.distance - a.distance);
  
  // Sort by distance ascending for the new leaderboard
  const distanceAscending = [...leaderboardData].sort((a, b) => a.distance - b.distance);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Leaderboards</h1>
        <div className="leaderboards-container">
          <div className="leaderboard-section">
            <h2>Those who didn't</h2>
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Distance (m)</th>
                    <th>Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {distanceDescending.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.distance}</td>
                      <td>{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="leaderboard-section">
            <h2>Those who did it</h2>
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Distance (m)</th>
                    <th>Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {distanceAscending.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.distance}</td>
                      <td>{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

}

export default Leaderboard;
