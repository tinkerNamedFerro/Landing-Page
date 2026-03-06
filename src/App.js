import React, { useState } from 'react';
import Leaderboard from './leaderboard';
import Results from './Results';
import SendIt from './SendIt';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('leaderboard');

  return (
    <div className="App">
      <nav className="app-navigation">
        <button
          className={currentPage === 'leaderboard' ? 'active' : ''}
          onClick={() => setCurrentPage('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={currentPage === 'results' ? 'active' : ''}
          onClick={() => setCurrentPage('results')}
        >
          Results
        </button>
        <button
          className={currentPage === 'sendit' ? 'active' : ''}
          onClick={() => setCurrentPage('sendit')}
        >
          Send it
        </button>
      </nav>
      {currentPage === 'leaderboard' && <Leaderboard />}
      {currentPage === 'results' && <Results />}
      {currentPage === 'sendit' && <SendIt />}
    </div>
  );
}

export default App;
