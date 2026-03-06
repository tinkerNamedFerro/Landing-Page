import React from 'react';
import data from './data/data.json';
import './App.css';

function Results() {
  const resultsData = data.results;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Results</h1>
        <div className="results-content">
          <div className="results-card">
            <div className="result-item">
              <span className="result-label">Name:</span>
              <span className="result-value">{resultsData.name}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Distance (m):</span>
              <span className="result-value">{resultsData.distance}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time (s):</span>
              <span className="result-value">{resultsData.time}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Flips:</span>
              <span className="result-value">{resultsData.flips}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Survived:</span>
              <span className="result-value">{resultsData.survived ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Results;