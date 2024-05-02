import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { CellularAutomaton } from "./CellularAutomaton";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handlerRef = useRef<CellularAutomaton | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const handler = new CellularAutomaton(canvas);
      handlerRef.current = handler;

      return () => {
        handler.dispose();
        handlerRef.current = null;
      };
    }
  }, []);

  return (
    <>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </>
  );
}

export default App;
