import React, { useState } from "react";
import { Link } from "wouter";

export const GamePage: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [activeTool, setActiveTool] = useState<string>("select");

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col select-none">
      {/* Top HUD Bar */}
      <header className="h-12 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white font-bold text-sm bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors"
          >
            <span>🏠 Home</span>
          </Link>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Airport:
            </span>
            <span className="text-sm font-bold text-white">
              Skyline International (SKL)
            </span>
          </div>
        </div>

        {/* Center: In-game Metrics */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
            <span className="text-emerald-400 font-bold">$100,000</span>
            <span className="text-[10px] text-slate-400">(+$420/h)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
            <span className="text-amber-400">🕒 08:00 AM</span>
            <span className="text-slate-400">• Day 1</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
            <span className="text-sky-400">👥 0 Pax</span>
            <span className="text-slate-400">| 0 Flights</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
            <span className="text-yellow-400">⭐ 85%</span>
            <span className="text-slate-400">Rating</span>
          </div>
        </div>

        {/* Right: Controls & Navigation */}
        <div className="flex items-center gap-3">
          {/* Floor Selector */}
          <div className="flex bg-slate-900 rounded-md p-0.5 border border-slate-800 text-xs font-bold">
            {[-1, 0, 1, 2].map((floor) => (
              <button
                key={floor}
                onClick={() => setActiveFloor(floor)}
                className={`px-2 py-1 rounded transition-colors ${
                  activeFloor === floor
                    ? "bg-sky-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {floor === -1 ? "B1" : `F${floor}`}
              </button>
            ))}
          </div>

          {/* Game Speed Controls */}
          <div className="flex bg-slate-900 rounded-md p-0.5 border border-slate-800 text-xs">
            {[
              { label: "⏸", speed: 0 },
              { label: "▶", speed: 1 },
              { label: "▶▶", speed: 2 },
              { label: "▶▶▶", speed: 3 },
            ].map(({ label, speed }) => (
              <button
                key={speed}
                onClick={() => setGameSpeed(speed)}
                className={`px-2 py-1 rounded transition-colors ${
                  gameSpeed === speed
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href="/debug"
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded border border-slate-800"
          >
            🛠️ Debug
          </Link>
        </div>
      </header>

      {/* Main PixiJS Viewport Area */}
      <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* Placeholder Grid Canvas / Viewport */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <div className="z-10 text-center max-w-md p-6 bg-slate-950/80 backdrop-blur rounded-2xl border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            🛫
          </div>
          <h2 className="text-lg font-bold text-white">
            Simulation Viewport Ready
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            PixiJS rendering layer will mount here. Currently on Floor{" "}
            <span className="font-mono text-sky-400 font-bold">
              {activeFloor === -1 ? "B1 (Basement)" : `Floor ${activeFloor}`}
            </span>{" "}
            at speed{" "}
            <span className="font-mono text-amber-400 font-bold">
              {gameSpeed}x
            </span>
            .
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-300">
            <span>Selected Tool:</span>
            <span className="font-mono font-bold text-sky-400 capitalize">
              {activeTool}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Construction & Management Toolbar */}
      <footer className="h-14 bg-slate-950/90 backdrop-blur border-t border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          {[
            { id: "select", label: "👆 Select", icon: "👆" },
            { id: "runway", label: "🛫 Runway / Taxiway", icon: "🛫" },
            { id: "stand", label: "🅿️ Aircraft Stand", icon: "🅿️" },
            { id: "terminal", label: "🏢 Terminal Walls", icon: "🏢" },
            { id: "zones", label: "🏷️ Zones (Secure/Staff)", icon: "🏷️" },
            { id: "desks", label: "🛂 Check-in / Security", icon: "🛂" },
            { id: "baggage", label: "🧳 Baggage Belts", icon: "🧳" },
            { id: "demolish", label: "💣 Demolish", icon: "💣" },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                activeTool === tool.id
                  ? "bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors">
            📅 Flight Planner
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors">
            💼 Staff & Airlines
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors">
            📊 Finances
          </button>
        </div>
      </footer>
    </div>
  );
};
