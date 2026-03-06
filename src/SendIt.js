import React, { useState } from 'react';
import './App.css';

function SendIt({ setCurrentPage, unlockAudio, accelXYZ, totalAcceleration, dropHeight, onYeet, freeFalling }) {
  const [showAccel, setShowAccel] = useState(false);
  const [yeetCount, setYeetCount] = useState(0);

  const YEET_LABELS = [
    'YEET THIS SHIT',
    'GO',
    'CHICKEN',
    "Knew u wouldn't",
    'Pussy 🐱',
    'Why r you still here',
  ];
  const x = parseFloat(accelXYZ?.x ?? 0);
  const y = parseFloat(accelXYZ?.y ?? 0);
  const z = parseFloat(accelXYZ?.z ?? 0);

  return (
    <div className="sendit-page">
      <h1 className="sendit-headline">Can you mog the height?</h1>
      <div className="sendit-illustration">
        <img src={require('./images/main_logo.png')} alt="Send It" className="sendit-image" />
      </div>
      <button
        className={`yeet-button${yeetCount > 0 ? ' yeet-button--chickened' : ''}`}
        disabled={yeetCount >= YEET_LABELS.length - 1}
        onClick={() => {
          if (yeetCount === 0) { unlockAudio?.(); onYeet?.(); }
          setYeetCount(c => Math.min(c + 1, YEET_LABELS.length - 1));
        }}
      >
        {YEET_LABELS[yeetCount]}
      </button>
      <button className="leaderboard-link" onClick={() => setCurrentPage('leaderboard')}>
        Leaderboard
      </button>
      {showAccel && (
        <div className="accel-panel">
          <div className="accel-panel-title">Sensor Data</div>
          <div className="accel-row"><span>X</span><span>{x.toFixed(3)}</span></div>
          <div className="accel-row"><span>Y</span><span>{y.toFixed(3)}</span></div>
          <div className="accel-row"><span>Z</span><span>{z.toFixed(3)}</span></div>
          <div className="accel-divider" />
          <div className="accel-row"><span>Total</span><span>{(totalAcceleration ?? 0).toFixed(4)} m/s²</span></div>
          <div className="accel-row"><span>Drop</span><span>{(dropHeight ?? 0).toFixed(2)} m</span></div>
          {freeFalling && <div className="accel-freefall">FREE FALL</div>}
        </div>
      )}
      <button
        className="accel-toggle"
        onClick={e => { e.stopPropagation(); setShowAccel(v => !v); }}
        aria-label="Toggle accelerometer data"
      >
        📡
      </button>
    </div>
  );
}

export default SendIt;
