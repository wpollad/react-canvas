import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { CellularAutomaton } from "./CellularAutomaton";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const cellularAutomaton = new CellularAutomaton(canvas);

      return () => {
        cellularAutomaton.dispose();
      };
    }
  });

  return (
    <>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </>
  );
}

export default App;
