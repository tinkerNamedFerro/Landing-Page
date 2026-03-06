import { useState, useEffect } from "react";

function Jump({ callback }) {
  const [acceleration, setAcceleration] = useState({ x: null, y: null, z: null });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Detect if iOS (requires explicit permission)
  const isIOS = () =>
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  const handleMotion = (event) => {
    const acc = event.accelerationIncludingGravity;
    if (acc) {

      const data = {
        x: acc.x !== null ? acc.x.toFixed(4) : null,
        y: acc.y !== null ? acc.y.toFixed(4) : null,
        z: acc.z !== null ? acc.z.toFixed(4) : null,
      }
      setAcceleration(data);
      if (callback) {
        callback(data);
      }
    }
  };

  const requestIOSPermission = async () => {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === "granted") {
        setPermissionGranted(true);
        window.addEventListener("devicemotion", handleMotion);
      } else {
        alert("Permission denied. Cannot access accelerometer.");
      }
    } catch (err) {
      console.error("Permission request failed:", err);
    }
  };

  useEffect(() => {
    if (isIOS()) {
      // iOS 13+ requires a user gesture to request permission
      setNeedsPermission(true);
    } else if (typeof window.DeviceMotionEvent !== "undefined") {
      // Android / desktop browsers
      setPermissionGranted(true);
      window.addEventListener("devicemotion", handleMotion);
    } else {
      console.warn("DeviceMotionEvent is not supported on this device.");
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Accelerometer</h2>

      {needsPermission && !permissionGranted && (
        <button onClick={requestIOSPermission} style={{ marginBottom: "16px", padding: "10px 20px" }}>
          Enable Accelerometer (iOS)
        </button>
      )}

      {permissionGranted ? (
        <div>
          <p>X: {acceleration.x ?? "—"}</p>
          <p>Y: {acceleration.y ?? "—"}</p>
          <p>Z: {acceleration.z ?? "—"}</p>
        </div>
      ) : (
        !needsPermission && <p>Accelerometer not supported on this device.</p>
      )}
    </div>
  );
}

export default Jump;