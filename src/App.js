
import { useRef, useState } from "react";
import bomboclatSound from './sounds/bomboclat.mp3';
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

  const timeOfFreeFall = useRef(null);
  const freeFallDetected = useRef(false);
  const audioRef = useRef(new Audio(bomboclatSound));
  const audioUnlocked = useRef(false);
  const [totalAcceleration, setTotalAcceleration] = useState(0);

  function unlockAudio() {
    if (!audioUnlocked.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioUnlocked.current = true;
      }).catch(() => {});
    }
  }

  function accelerometerHandler(acc) {
    if (!acc) return;
    console.log(`Acceleration X: ${acc.x}, Y: ${acc.y}, Z: ${acc.z}`);
    const totalAcceleration = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    setTotalAcceleration(totalAcceleration);
    if (totalAcceleration < freefallThreshold && !freeFallDetected.current) {
      console.log("Free fall detected!");
      freeFallDetected.current = true;
      timeOfFreeFall.current = Date.now();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    if(freeFallDetected.current && totalAcceleration >= freefallThreshold) {
      console.log("Device has landed.");
      freeFallDetected.current = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      const dropHeight = calculateDropHeight(timeOfFreeFall.current);
      setDropHeight(dropHeight);
      setCurrentPage('results'); // auto-navigate to results
    }
  }

  return (
    <div className="App" onClick={unlockAudio}>
      {currentPage === 'leaderboard' && <Leaderboard />}
      {currentPage === 'results' && <Results />}
      {currentPage === 'sendit' && <SendIt setCurrentPage={setCurrentPage} unlockAudio={unlockAudio} />}
      <Jump callback={accelerometerHandler} />
      {freeFallDetected.current && <p style={{ color: "red" }}>Free fall detected!</p>}
      {<p>Drop height: {dropHeight.toFixed(2)} meters</p>}

      {totalAcceleration > 0 && <p>Total Acceleration: {totalAcceleration.toFixed(4)} m/s²</p>}
    </div>
  );
}

export default App;
