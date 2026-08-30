import React from "react";
import { Link } from "wouter";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-8 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-xl text-slate-950 shadow-lg shadow-sky-500/20">
            ✈️
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Airport CEO Web
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              v0.1.0 • 2D Airport Tycoon Simulation
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/test"
            className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            🧪 Test Suite
          </Link>
          <Link
            href="/debug"
            className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            🛠️ Debug Inspector
          </Link>
        </nav>
      </header>

      {/* Main Hero & Quick Actions */}
      <main className="max-w-4xl mx-auto w-full my-auto text-center py-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800 text-sky-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready to Simulate
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
          Build & Manage Your International Airport
        </h2>

        <p className="mt-4 text-lg text-slate-400 max-w-xl">
          Construct runways, design multi-floor terminals, optimize baggage
          conveyor networks, and coordinate aircraft turnarounds in your
          browser.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/game"
            className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base shadow-xl shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Play Airport Game</span>
            <span className="text-lg">➔</span>
          </Link>

          <Link
            href="/debug"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all hover:border-slate-600"
          >
            Open Debugger
          </Link>
        </div>

        {/* Quick Links Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <Link
            href="/game"
            className="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all"
          >
            <div className="text-2xl mb-2">🛫</div>
            <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors">
              Main Simulation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top-down 2D PixiJS viewport with full UI HUD, building tools, and
              flight operations.
            </p>
          </Link>

          <Link
            href="/test"
            className="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
          >
            <div className="text-2xl mb-2">🧪</div>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
              Test Bench
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify simulation engines, turnaround state machines, and
              pathfinding algorithms headlessly.
            </p>
          </Link>

          <Link
            href="/debug"
            className="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all"
          >
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
              System Debugger
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspect spatial hash grid buckets, performance metrics, tick
              counters, and memory pooling.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 py-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          Airport CEO Web • Pure TypeScript Engine + PixiJS + React 19 + Jotai
        </span>
        <div className="flex gap-4">
          <Link href="/game" className="hover:text-slate-400">
            /game
          </Link>
          <Link href="/test" className="hover:text-slate-400">
            /test
          </Link>
          <Link href="/debug" className="hover:text-slate-400">
            /debug
          </Link>
        </div>
      </footer>
    </div>
  );
};
