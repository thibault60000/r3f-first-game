import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";

import useGame from "./stores/useGame.js";

export default function Interface() {
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);

  const status = useGame((state) => state.status);

  const restart = useGame((state) => state.restart);

  const timeRef = useRef();

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.status === "playing") {
        elapsedTime = (Date.now() - state.startTime) / 1000;
      } else if (state.status === "ending") {
        elapsedTime = (state.endTime - state.startTime) / 1000;
      }

      elapsedTime = elapsedTime.toFixed(2);
      if (timeRef.current) timeRef.current.textContent = elapsedTime;
    });

    return () => {
      unsubscribeEffect;
    };
  }, []);

  return (
    <div className='interface'>
      {/* Timer */}
      <div className='timer' ref={timeRef}>
        0.00
      </div>

      {/* Restart */}
      {status === "ending" && (
        <div className='restart' onClick={restart}>
          Restart
        </div>
      )}

      {/* Controls */}
      <div className='controls'>
        <div className='raw'>
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className='raw'>
          <div className={`key ${left ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${right ? "active" : ""}`}></div>
        </div>
        <div className='raw'>
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}
