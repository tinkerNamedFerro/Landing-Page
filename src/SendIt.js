import React from 'react';
import './App.css';

function SendIt() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Send it</h1>
        <div className="sendit-content">
          <img src={require('./images/bombardino-crocodilo.png')} alt="Bombardino Crocodilo" className="sendit-image" />
        </div>
      </header>
    </div>
  );
}

export default SendIt;