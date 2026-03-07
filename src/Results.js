import React, { useEffect, useState } from 'react';
import './App.css';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

function Results({ setCurrentPage, dropHeight, flightTime }) {
  const addEntry = useMutation(api.leaderboard.addEntry);
  const [entrySent, setEntrySent] = useState(false);

  // list of random names to assign to each jump
  const names = [
    'Apollo', 'Buzz', 'Cosmo', 'Delta', 'Echo',
    'Falcon', 'Gemini', 'Hawk', 'Icarus', 'Jupiter'
  ];

  useEffect(() => {
    if (!entrySent) {
      // choose a random name and send the result when component mounts
      const randomName = names[Math.floor(Math.random() * names.length)];
      addEntry({
        name: randomName,
        distance: dropHeight,
        time: flightTime,
        survived: true,
      });
      setEntrySent(true);
    }
  }, [addEntry, dropHeight, flightTime, entrySent]);

  return (
    <div className="results-page">
      <h1 className="sendit-headline">Results</h1>
      <div className="results-content">
        <div className="results-card">
          <div className="result-item">
            <span className="result-label">Distance (m):</span>
            <span className="result-value">{dropHeight.toFixed(2)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Time (s):</span>
            <span className="result-value">{flightTime.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button className="yeet-button" onClick={() => setCurrentPage('sendit')}>
        Back to Home
      </button>
    </div>
  );
}

export default Results;