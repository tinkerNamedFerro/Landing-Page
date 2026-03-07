import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const TOTAL = 10;

function StillAlive({ setCurrentPage, setAnswered, answered, playWhatKindNarration, setDied }) {
  const [remaining, setRemaining] = useState(TOTAL);

  const intervalRef = useRef(null);

  // Count down; auto-navigate when timer hits 0
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimeout(() => {
            setCurrentPage("results");
            const playerDied = true;
             setDied(playerDied);
            playWhatKindNarration(playerDied);
          }, 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [setCurrentPage]);

  const handleAnswer = (answer) => {
    clearInterval(intervalRef.current);
    setAnswered(answer);
    setTimeout(() => {
      setCurrentPage("results");
      const playerDied = answer == "yes" ? false : true;
      setDied(playerDied);
      playWhatKindNarration(playerDied);
    }, 1400);
  };

  const progress = remaining / TOTAL; // 1 → 0
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="alive-page">
      <div className="alive-card">
        {answered === null ? (
          <>
            <div className="alive-timer">
              <svg className="alive-ring" viewBox="0 0 100 100">
                <circle className="alive-ring-bg" cx="50" cy="50" r={radius} />
                <circle
                  className="alive-ring-fill"
                  cx="50"
                  cy="50"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition:
                      remaining === TOTAL
                        ? "none"
                        : "stroke-dashoffset 1s linear",
                  }}
                />
              </svg>
              <span className="alive-countdown">{remaining}</span>
            </div>

            <h1 className="alive-headline">Are you still alive?</h1>
            <p className="alive-sub">Respond before time runs out…</p>

            <div className="alive-buttons">
              <button
                className="alive-btn alive-btn--yes"
                onClick={() => handleAnswer("yes")}
              >
                Yeah 🙌
              </button>
              <button
                className="alive-btn alive-btn--no"
                onClick={() => handleAnswer("no")}
              >
                Nope 💀
              </button>
            </div>
          </>
        ) : (
          <div className="alive-response">
            {answered === "yes" ? (
              <>
                <span className="alive-response-emoji">🙌</span>
                <p className="alive-response-text">Glad you made it!</p>
              </>
            ) : (
              <>
                <span className="alive-response-emoji">💀</span>
                <p className="alive-response-text">F in chat.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StillAlive;
