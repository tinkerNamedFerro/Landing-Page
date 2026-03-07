import { useRef, useState, useEffect } from "react";
import manScreamSrc from "./sounds/man_scream.mp3";
import darkSoulsSrc from "./sounds/Dark souls death.mp3";
import okayLetsGoSrc from "./sounds/okay_lets_go.mp3";
import whenIsHeGonnaJumpSrc from "./sounds/narration/when_is_he_gonna_jump.mp3";
import iDontKnowSrc from "./sounds/narration/i_dont_fucking_know.mp3";
import whatJumpSrc from "./sounds/narration/what_the_fucking_kind_of_jump.mp3";
import NoobJumpSrc from "./sounds/narration/noob_jump.mp3";
import AreYouAliveSrc from "./sounds/narration/are_you_alive.mp3";
import MaybeNotSrc from "./sounds/narration/maybe_not.mp3";
import broDeadSrc from "./sounds/narration/bro_dead.mp3";
import Leaderboard from "./leaderboard";
import Results from "./Results";
import SendIt from "./SendIt";
import StillAlive from "./StillAlive";
import "./App.css";

const freefallThreshold = 0.5; // m/s²

function calculateDropHeight(timeOfFreefall) {
  const timeOfFlight = (Date.now() - timeOfFreefall) / 1000; // Convert ms to seconds
  return 0.5 * 9.81 * timeOfFlight ** 2; // h = 0.5 * g * t²
}
function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const [currentPage, setCurrentPage] = useState("sendit");

  const [dropHeight, setDropHeight] = useState(0);
  const [flightTime, setFlightTime] = useState(0);

  const [freeFalling, setFreeFalling] = useState(false);
  const timeOfFreeFall = useRef(null);
  const freeFallDetected = useRef(false);
  // Web Audio API refs (works reliably on iOS)
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const buffersRef = useRef({ scream: null, death: null, okay: null });
  const screamSourceRef = useRef(null);
  const [died, setDied] = useState(false);
  const yeetActive = useRef(false);
  const audioUnlocked = useRef(false);
  const mutedRef = useRef(false);
  const answeredRef = useRef(null);
  const [totalAcceleration, setTotalAcceleration] = useState(0);
  const [accelXYZ, setAccelXYZ] = useState({ x: 0, y: 0, z: 0 });
  const [muted, setMuted] = useState(false);
  const [answered, setAnswered] = useState(null); // 'yes' | 'no'
  const isIOS = () =>
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  // Create AudioContext and preload all audio buffers on mount
  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;

    const loadBuffer = async (src) => {
      const res = await fetch(src);
      const ab = await res.arrayBuffer();
      return ctx.decodeAudioData(ab);
    };

    Promise.all([
      loadBuffer(manScreamSrc),
      loadBuffer(darkSoulsSrc),
      loadBuffer(okayLetsGoSrc),
      loadBuffer(whenIsHeGonnaJumpSrc),
      loadBuffer(iDontKnowSrc),
      loadBuffer(whatJumpSrc),
      loadBuffer(NoobJumpSrc),
      loadBuffer(AreYouAliveSrc),
      loadBuffer(MaybeNotSrc),
      loadBuffer(broDeadSrc)
    ])
      .then(
        ([
          scream,
          death,
          okay,
          whenJump,
          iDontKnow,
          whatJump,
          noobJump,
          areYouAlive,
          maybeNot,
          broDead
        ]) => {
          buffersRef.current = {
            scream,
            death,
            okay,
            whenJump,
            iDontKnow,
            whatJump,
            noobJump,
            areYouAlive,
            maybeNot,
            broDead
          };
        },
      )
      .catch((e) => console.error("Audio preload error:", e));

    return () => ctx.close();
  }, []);

  useEffect(() => {
    if (isIOS()) {
      // iOS 13+ - check if permission is already granted
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            setPermissionGranted(true);
            window.addEventListener("devicemotion", accelerometerHandler);
          } else {
            setNeedsPermission(true);
          }
        })
        .catch(() => {
          // Permission not yet requested, show button
          setNeedsPermission(true);
        });
    } else if (typeof window.DeviceMotionEvent !== "undefined") {
      // Android / desktop browsers
      setPermissionGranted(true);
      window.addEventListener("devicemotion", accelerometerHandler);
    } else {
      console.warn("DeviceMotionEvent is not supported on this device.");
    }

    return () => {
      window.removeEventListener("devicemotion", accelerometerHandler);
    };
  }, []);

  const requestIOSPermission = async () => {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === "granted") {
        setPermissionGranted(true);
        window.addEventListener("devicemotion", accelerometerHandler);
      } else {
        alert("Permission denied. Cannot access accelerometer.");
      }
    } catch (err) {
      console.error("Permission request failed:", err);
    }
  };
  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = next ? 0 : 1;
      }
      return next;
    });
  }

  function unlockAudio() {
    // Resume suspended AudioContext on first user gesture (iOS requirement)
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    audioUnlocked.current = true;
  }

  function playSound(bufferName) {
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    const buffer = buffersRef.current[bufferName];
    if (!ctx || !gain || !buffer) return null;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.start(0);
    return source;
  }

  function playWhenJumpNarration() {
    const source = playSound("whenJump");
    if (source) {
      source.onended = () => playSound("iDontKnow");
    }
  }
  function playWhatKindNarration(died) {
    playSound(died ? "death" : "okay");

    const source = playSound("whatJump");
    if (source) {
      source.onended = () => {
       if(died)
       {
        playSound("broDead");
       }
       else
       {
        playSound("noobJump");
       }
      };
    }
  }
  function playAreYouAliveNarration() {
    const source = playSound("areYouAlive");
    if (source) {
      source.onended = () => {
        setTimeout(() => {
          // Only play if user hasn't answered yet
          if (answeredRef.current === null) {
            playSound("maybeNot");
          }
        }, 1600);
      };
    }
  }

  function stopScream() {
    if (screamSourceRef.current) {
      try {
        screamSourceRef.current.stop();
      } catch (_) {}
      screamSourceRef.current = null;
    }
  }

  function accelerometerHandler(event) {
    const acc = event.accelerationIncludingGravity;

    if (!acc) return;

    const data = {
      x: acc.x !== null ? acc.x.toFixed(4) : null,
      y: acc.y !== null ? acc.y.toFixed(4) : null,
      z: acc.z !== null ? acc.z.toFixed(4) : null,
    };
    console.log(`Acceleration X: ${acc.x}, Y: ${acc.y}, Z: ${acc.z}`);
    const totalAcceleration = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

    // Filter out small fluctuations during freefall
    const effectiveAcceleration =
      freeFallDetected.current && totalAcceleration < 2.0
        ? 0
        : totalAcceleration;
    setTotalAcceleration(effectiveAcceleration);
    setAccelXYZ(data);

    if (
      effectiveAcceleration < freefallThreshold &&
      !freeFallDetected.current &&
      yeetActive.current
    ) {
      console.log("Free fall detected!");
      freeFallDetected.current = true;
      setFreeFalling(true);
      timeOfFreeFall.current = Date.now();
      screamSourceRef.current = playSound("scream");
    }

    if (
      freeFallDetected.current &&
      effectiveAcceleration >= freefallThreshold
    ) {
      console.log("Device has landed.");
      freeFallDetected.current = false;
      setFreeFalling(false);
      const dropHeight = calculateDropHeight(timeOfFreeFall.current);
      const flightTime = (Date.now() - timeOfFreeFall.current) / 1000;
      setDropHeight(dropHeight);
      setFlightTime(flightTime);
      if (yeetActive.current) {
        stopScream();
        yeetActive.current = false;
        setTimeout(() => {
          playAreYouAliveNarration();
          setAnswered(null);
          answeredRef.current = null;
          setCurrentPage("stillalive");
        }, 500);
      }
    }
  }

  return (
    <div className="App" onClick={unlockAudio}>
      {currentPage === "leaderboard" && (
        <Leaderboard setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "stillalive" && (
        <StillAlive
          setCurrentPage={setCurrentPage}
          setAnswered={(value) => {
            setAnswered(value);
            answeredRef.current = value;
          }}
          answered={answered}
          playWhatKindNarration={playWhatKindNarration}
          dropHeight={dropHeight}
          setDied={setDied}
        />
      )}
      {currentPage === "results" && (
        <Results
          setCurrentPage={setCurrentPage}
          dropHeight={dropHeight}
          flightTime={flightTime}
          died={died}
        />
      )}
      {currentPage === "sendit" && (
        <SendIt
          setCurrentPage={setCurrentPage}
          unlockAudio={unlockAudio}
          accelXYZ={accelXYZ}
          totalAcceleration={totalAcceleration}
          dropHeight={dropHeight}
          freeFalling={freeFalling}
          onYeet={() => {
            yeetActive.current = true;
          }}
          muted={muted}
          toggleMute={toggleMute}
          permissionGranted={permissionGranted}
          requestIOSPermission={requestIOSPermission}
          playWhenJumpNarration={playWhenJumpNarration}
          playWhatKindNarration={playWhatKindNarration}
        />
      )}
    </div>
  );
}

export default App;
