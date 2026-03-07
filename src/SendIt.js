import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function SendIt({ setCurrentPage, unlockAudio, accelXYZ, totalAcceleration, dropHeight, onYeet, freeFalling, muted, toggleMute, permissionGranted, requestIOSPermission, playWhenJumpNarration}) {
  const [showAccel, setShowAccel] = useState(false);
  const [yeetCount, setYeetCount] = useState(0);
  const narrationTimerRef = useRef(null);

  // Cancel narration timer as soon as a jump is detected
  useEffect(() => {
    if (freeFalling && narrationTimerRef.current) {
      clearTimeout(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }
  }, [freeFalling]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    };
  }, []);

  const YEET_LABELS = [
    'YEET THIS SHIT',
    'GO',
    'CHICKEN',
    "Knew u wouldn't",
    'Pussy 🐱',
    'Why r you still here',
  ];

  if(!permissionGranted) {

    requestIOSPermission();

  }
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
          if (yeetCount === 0) {
            unlockAudio?.();
            onYeet?.();
            // Play narration after 5s if no jump detected yet
            narrationTimerRef.current = setTimeout(() => {
              narrationTimerRef.current = null;
              playWhenJumpNarration?.();
            }, 5000);
          }
          setYeetCount(c => Math.min(c + 1, YEET_LABELS.length - 1));
        }}
      >
        <span key={yeetCount} className="yeet-button-text">{YEET_LABELS[yeetCount]}</span>
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
        className="mute-toggle"
        onClick={e => { e.stopPropagation(); toggleMute(); }}
        aria-label="Toggle mute"
      >
        {muted ? '🔇' : '🔊'}
      </button>
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
