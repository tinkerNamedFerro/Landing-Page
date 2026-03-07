import React from 'react';
import './App.css';

function Results({ setCurrentPage, dropHeight, flightTime }) {
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