import React from 'react';
import './App.css';
import { useQuery } from 'convex/react';
import { api } from './convex/_generated/api';

function Leaderboard({ setCurrentPage }) {
  // fetch all entries from the Convex `leaderboard` collection
  const entries = useQuery(api.leaderboard.getLeaderboard) || [];

  // split survivors / non‑survivors like the original UI did
  const survivedTrue = entries.filter((e) => e.survived);
  const survivedFalse = entries.filter((e) => !e.survived);

  // sort each list by distance
  const distanceDescending = [...survivedFalse].sort((a, b) => b.distance - a.distance);
  const distanceAscending = [...survivedTrue].sort((a, b) => a.distance - b.distance);

  return (
    <div className="sendit-page">
      <h1 className="sendit-headline">Leaderboards</h1>
      <div className="leaderboards-container">
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
      <button className="yeet-button" onClick={() => setCurrentPage('sendit')}>
        Back to Home
      </button>
    </div>
  );

}

export default Leaderboard;
