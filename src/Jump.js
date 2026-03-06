import { useState, useEffect, useCallback } from 'react';

// iOS 13+ requires explicit permission for DeviceMotionEvent
const isIOS = () =>
  typeof DeviceMotionEvent !== 'undefined' &&
  typeof DeviceMotionEvent.requestPermission === 'function';

function useAccelerometer() {
  const [accel, setAccel] = useState({ x: null, y: null, z: null });
  const [permission, setPermission] = useState(
    isIOS() ? 'prompt' : 'granted'
  );
  const [error, setError] = useState(null);

  const startListening = useCallback(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setError('DeviceMotionEvent is not supported on this device.');
      return;
    }

    const handler = (event) => {
      const a = event.accelerationIncludingGravity;
      if (!a) return;
      setAccel({
        x: a.x !== null ? +a.x.toFixed(4) : null,
        y: a.y !== null ? +a.y.toFixed(4) : null,
        z: a.z !== null ? +a.z.toFixed(4) : null,
      });
    };

    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
  }, []);

  const requestIOSPermission = useCallback(async () => {
    try {
      const result = await DeviceMotionEvent.requestPermission();
      setPermission(result);
    } catch (err) {
      setError(err.message);
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;
    return startListening();
  }, [permission, startListening]);

  return { accel, permission, error, requestIOSPermission };
}

export default function Jump() {
  const { accel, permission, error, requestIOSPermission } = useAccelerometer();

  if (error) {
    return <p style={styles.error}>Error: {error}</p>;
  }

  if (permission === 'prompt') {
    return (
      <div style={styles.container}>
        <p style={styles.label}>Accelerometer access requires permission on iOS.</p>
        <button style={styles.button} onClick={requestIOSPermission}>
          Enable Accelerometer
        </button>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <p style={styles.error}>
        Permission denied. Enable motion access in Settings.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Accelerometer</h2>
      <div style={styles.grid}>
        <Axis label="X" value={accel.x} />
        <Axis label="Y" value={accel.y} />
        <Axis label="Z" value={accel.z} />
      </div>
      <p style={styles.hint}>Values include gravity (m/s²)</p>
    </div>
  );
}

function Axis({ label, value }) {
  return (
    <div style={styles.axis}>
      <span style={styles.axisLabel}>{label}</span>
      <span style={styles.axisValue}>
        {value !== null ? value : '—'}
      </span>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
  },
  grid: {
    display: 'flex',
    gap: '2rem',
  },
  axis: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  axisLabel: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#888',
  },
  axisValue: {
    fontSize: '1.4rem',
  },
  hint: {
    fontSize: '0.75rem',
    color: '#aaa',
    margin: 0,
  },
  label: {
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
    background: '#0070f3',
    color: '#fff',
  },
  error: {
    color: 'red',
    fontFamily: 'monospace',
    padding: '1rem',
  },
};
