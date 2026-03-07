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

function Results({ setCurrentPage, dropHeight, flightTime }) {
  const addEntry = useMutation(api.leaderboard.addEntry);
  const [entrySent, setEntrySent] = useState(false);

  const names = [
    'Apollo', 'Buzz', 'Cosmo', 'Delta', 'Echo',
    'Falcon', 'Gemini', 'Hawk', 'Icarus', 'Jupiter'
  ];

  useEffect(() => {
    if (!entrySent) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      addEntry({ name: randomName, distance: dropHeight, time: flightTime, survived: true });
      setEntrySent(true);
    }
  }, [addEntry, dropHeight, flightTime, entrySent]);

  const animDist = useCountUp(dropHeight, { delay: 320 });
  const animTime = useCountUp(flightTime, { delay: 500 });

  return (
    <div className="results-page">
      <div className="results-trophy">🏆</div>
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