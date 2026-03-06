import React, { useState } from 'react';
import Leaderboard from './leaderboard';
import Results from './Results';
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
      </nav>
      {currentPage === 'leaderboard' ? <Leaderboard /> : <Results />}
    </div>
  );
}

export default App;
