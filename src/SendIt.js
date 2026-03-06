import React from 'react';
import './App.css';

function SendIt({ setCurrentPage, unlockAudio }) {
  return (
    <div className="App">
      <header className="App-header">
        <button
          className="nav-button"
          onClick={() => { unlockAudio?.(); setCurrentPage('sendit'); }}
        >
          Send it
        </button>
        <div className="sendit-content">
          <img src={require('./images/bombardino-crocodilo.png')} alt="Bombardino Crocodilo" className="sendit-image" />
        </div>
        <button
          className="nav-button"
          onClick={() => setCurrentPage('leaderboard')}
        >
          Leaderboard
        </button>
      </header>
    </div>
  );
}

export default SendIt;