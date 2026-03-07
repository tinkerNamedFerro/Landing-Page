import { useState, useEffect } from "react";

function Jump({ callback, setNeedsPermission, setPermissionGranted }) {

 
  // Detect if iOS (requires explicit permission)
  const isIOS = () =>
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";





  useEffect(() => {
    if (isIOS()) {
      // iOS 13+ requires a user gesture to request permission
      setNeedsPermission(true);
    } else if (typeof window.DeviceMotionEvent !== "undefined") {
      // Android / desktop browsers
      setPermissionGranted(true);
      window.addEventListener("devicemotion", callback);
    } else {
      console.warn("DeviceMotionEvent is not supported on this device.");
    }

    return () => {
      window.removeEventListener("devicemotion", callback);
    };
  }, []);

  return null;
}

export default Jump;