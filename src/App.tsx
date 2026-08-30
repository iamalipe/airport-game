import React, { useEffect, useRef } from "react";
import { pixiApp } from "./pixi-app";

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      void pixiApp.init(containerRef.current);
    }

    return () => {
      pixiApp.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black select-none"
    />
  );
};

export default App;
