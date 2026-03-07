import React, { useEffect, useState } from 'react';
import './App.css';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

function useCountUp(target, { duration = 1300, decimals = 2, delay = 0 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const timer = setTimeout(() => {
      let startTime = null;
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((ease * target).toFixed(decimals)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, decimals, delay]);
  return val;
}

function Results({ setCurrentPage, dropHeight, flightTime, died }) {
  const addEntry = useMutation(api.leaderboard.addEntry);
  const [entrySent, setEntrySent] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(died); // If died, skip name input

  useEffect(() => {
    if (!entrySent && nameSubmitted && !died) {
      addEntry({ name: playerName, distance: dropHeight, time: flightTime, survived: true });
      setEntrySent(true);
    }
  }, [addEntry, dropHeight, flightTime, entrySent, died, playerName, nameSubmitted]);

  const animDist = useCountUp(dropHeight, { delay: 320 });
  const animTime = useCountUp(flightTime, { delay: 500 });

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setNameSubmitted(true);
    }
  };

  // Show name input form if user survived and hasn't submitted name yet
  if (!died && !nameSubmitted) {
    return (
      <div className="results-page">
        <div className="results-trophy">🏆</div>
        <h1 className="sendit-headline results-headline">You Survived!</h1>
        <div className="results-content">
          <form className="name-input-form" onSubmit={handleNameSubmit}>
            <label className="name-input-label">Enter Your Name:</label>
            <input
              type="text"
              className="name-input-field"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="yeet-button" disabled={!playerName.trim()}>
              <span className="yeet-button-text">Submit</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-trophy">{died ? '💀' : '🏆'}</div>
      <h1 className="sendit-headline results-headline">You Sent It!</h1>
      <div className="results-content">
        <div className="results-card">
          <div className="result-stat">
            <span className="result-stat-label">Distance</span>
            <span className="result-stat-value">
              {animDist.toFixed(2)}<span className="result-stat-unit"> m</span>
            </span>
          </div>
          <div className="result-divider" />
          <div className="result-stat">
            <span className="result-stat-label">Air Time</span>
            <span className="result-stat-value">
              {animTime.toFixed(2)}<span className="result-stat-unit"> s</span>
            </span>
          </div>
        </div>
      </div>
      <button className="yeet-button" onClick={() => setCurrentPage('sendit')}>
        <span className="yeet-button-text">Jump Again</span>
      </button>
      <button className="leaderboard-link" onClick={() => setCurrentPage('leaderboard')}>
        View Leaderboard
      </button>
    </div>
  );
}

export default Results;