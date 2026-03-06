
import { useRef, useState } from "react";
import manScreamSound from './sounds/man_scream.mp3';
import Jump from "./components/Jump";
import Leaderboard from './leaderboard';
import Results from './Results';
import SendIt from './SendIt';
import './App.css';


const freefallThreshold = 0.5; // m/s²

  function calculateDropHeight(timeOfFreefall) {
    const timeOfFlight = (Date.now() - timeOfFreefall) / 1000; // Convert ms to seconds
    return 0.5 * 9.81 * timeOfFlight ** 2; // h = 0.5 * g * t²
  }
function App() {


  const [currentPage, setCurrentPage] = useState('sendit');

  const [dropHeight, setDropHeight] = useState(0);
  const [flightTime, setFlightTime] = useState(0);

  const [freeFalling, setFreeFalling] = useState(false);
  const timeOfFreeFall = useRef(null);
  const freeFallDetected = useRef(false);
  const audioRef = useRef(new Audio(manScreamSound));
  const yeetActive = useRef(false);
  const audioUnlocked = useRef(false);
  const [totalAcceleration, setTotalAcceleration] = useState(0);
  const [accelXYZ, setAccelXYZ] = useState({ x: 0, y: 0, z: 0 });

  function unlockAudio() {
    if (!audioUnlocked.current) {
      const wasYeetActive = yeetActive.current;
      audioRef.current.play().then(() => {
        if (!wasYeetActive) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioUnlocked.current = true;
      }).catch(() => {});
    }
  }

  function accelerometerHandler(acc) {
    if (!acc) return;
    console.log(`Acceleration X: ${acc.x}, Y: ${acc.y}, Z: ${acc.z}`);
    const totalAcceleration = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    setTotalAcceleration(totalAcceleration);
    setAccelXYZ({ x: acc.x, y: acc.y, z: acc.z });
    if (freeFallDetected.current) {
      setDropHeight(calculateDropHeight(timeOfFreeFall.current));
    }
    if (totalAcceleration < freefallThreshold && !freeFallDetected.current && yeetActive.current) {
      console.log("Free fall detected!");
      freeFallDetected.current = true;
      setFreeFalling(true);
      timeOfFreeFall.current = Date.now();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    if (freeFallDetected.current && totalAcceleration >= freefallThreshold) {
      console.log("Device has landed.");
      freeFallDetected.current = false;
      setFreeFalling(false);
      const dropHeight = calculateDropHeight(timeOfFreeFall.current);
      const flightTime = (Date.now() - timeOfFreeFall.current) / 1000;
      setDropHeight(dropHeight);
      setFlightTime(flightTime);
      if (yeetActive.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        yeetActive.current = false;
        setCurrentPage('results');
      }
    }
  }

  return (
    <div className="App" onClick={unlockAudio}>
      {currentPage === 'leaderboard' && <Leaderboard setCurrentPage={setCurrentPage} />}
      {currentPage === 'results' && <Results setCurrentPage={setCurrentPage} dropHeight={dropHeight} flightTime={flightTime} />}
      {currentPage === 'sendit' && (
        <SendIt
          setCurrentPage={setCurrentPage}
          unlockAudio={unlockAudio}
          accelXYZ={accelXYZ}
          totalAcceleration={totalAcceleration}
          dropHeight={dropHeight}
          freeFalling={freeFalling}
          onYeet={() => { yeetActive.current = true; }}
        />
      )}
      <Jump callback={accelerometerHandler} />
    </div>
  );
}

export default App;
