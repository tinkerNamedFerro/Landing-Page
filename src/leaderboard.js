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

  // sort survivors by distance descending (highest distance = best)
  const survivorsByDistance = [...survivedTrue].sort((a, b) => b.distance - a.distance);
  const failedByDistance = [...survivedFalse].sort((a, b) => b.distance - a.distance);

  return (
    <div className="sendit-page">
      <h1 className="sendit-headline">Leaderboards</h1>
      <div className="leaderboards-container leaderboards-fade-in">
          <div className="leaderboard-section">
            <h2 className="leaderboard-title">Those who did it</h2>
            <div className="leaderboard">
              <table>
                <thead>
                  <tr className="leaderboard-header-row">
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Distance (m)</th>
                    <th>Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {survivorsByDistance.map((entry, index) => (
                    <tr 
                      key={index} 
                      className="leaderboard-row"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <td className="rank-cell">{index + 1}</td>
                      <td className="name-cell">{entry.name}</td>
                      <td className="distance-cell">{entry.distance}</td>
                      <td className="time-cell">{entry.time}</td>
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
