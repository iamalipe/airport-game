import React, { useState } from "react";
import { Link } from "wouter";

export const DebugPage: React.FC = () => {
  const [debugFlags, setDebugFlags] = useState({
    showGrid: true,
    showSpatialHash: true,
    showPathNodes: false,
    showEntityBoxes: true,
    showZoningOverlay: true,
    logTurnaroundEvents: false,
  });

  const toggleFlag = (key: keyof typeof debugFlags) => {
    setDebugFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
            >
              ⬅ Home
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                🛠️ Simulation Debugger & Inspector
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Spatial Partitions, Heap Pools & Subsystem Metrics
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/game"
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
            >
              Open Game View
            </Link>
          </div>
        </div>

        {/* Real-time Telemetry Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Tick Rate (TPS)
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              60.0
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Target: 60.0 TPS
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Active Entities
            </div>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
              0
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Pax: 0 | Aircraft: 0 | Vehicles: 0
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Spatial Buckets
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              0 / 256
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              16x16 Grid Cells
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              Object Pool Capacity
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              1,024
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Active Leases: 0
            </div>
          </div>
        </div>

        {/* Debug Overlay Toggles */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Visual Debug Overlays & Engine Flags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(debugFlags).map(([key, enabled]) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="text-xs font-mono text-slate-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleFlag(key as keyof typeof debugFlags)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-800 border-slate-700"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-600 pt-8 border-t border-slate-900 mt-12">
        <span>
          Spatial Hash Debugger • Live Subsystem Inspection • Command Log
        </span>
      </footer>
    </div>
  );
};
