# AGENTS.md - Antigravity & Agent Instructions for Airport CEO Web

This file provides system context and operational rules for Antigravity and other autonomous coding agents operating in the `airport-game` workspace.

---

## 1. Project Context

- **Project:** Airport CEO Web (Top-down Airport Tycoon Simulation).
- **Core Stack:** React 19 + TypeScript + Vite + PixiJS (v8) + Jotai + Oxlint.
- **Architectural Paradigm:** Decoupled 3-Tier Architecture:
  1. `src/engine/`: Pure headless TypeScript simulation (fixed timestep tick loop, zero DOM / zero PixiJS dependencies).
  2. `src/render/`: PixiJS 2D Viewport / Camera / Layer Containers / Animated Sprites (interpolated visual state).
  3. `src/ui/`: React 19 + Jotai atomic state overlay for HUD, building tools, flight scheduling (Gantt), staff roster, and finance reports.

---

## 2. Agent Operational Rules

### Rule 0: Strict Scope Adherence (No Unsolicited Additions)

- **ONLY** add, modify, or create what the user explicitly asks for.
- **NEVER** add extra features, unsolicited UI elements, speculative code, or unasked-for boilerplate.
- Keep all implementations strictly scoped, minimal, and focused exactly on the user's prompt.

### Rule 1: Simulation Purity

- **NEVER** import React, DOM APIs (`window`, `document`), or rendering libraries (`pixi.js`, `three`, `canvas`) inside `src/engine/`.
- All simulation logic must be 100% testable in a headless Node/Vitest environment.

### Rule 2: Performance & Memory Hygiene

- Do not instantiate heap objects inside per-tick or per-frame hot loops (e.g., `tick()`, `render()`).
- Use reusable object pools for pathfinding nodes, vectors, particles, and transient calculations.
- Always use Spatial Partitioning (Spatial Hash Grid) for proximity checks, collision, and range queries.

### Rule 3: Data-Driven Configuration

- Keep simulation parameters, building dimensions, aircraft specifications, airline data, and staff salaries in `src/data/` config objects rather than hardcoded magic numbers.

### Rule 4: Discrete & Branded Typing

- Use explicit types: `GridCoord` for discrete tiles, `WorldPos` for continuous coordinates, `Cents` for monetary values, `MinuteOfDay` for in-game clock time.

---

## 3. Subsystem Specifications

Refer to the modular rules in `.agents/rules/` for deep dive specifications:

- [Airport CEO Game Design Rules](file:///.agents/rules/airport-ceo-game-design.md): Aircraft turnaround, passenger state machines, baggage conveyor graph, ATC runway operations, service vehicles, zoning.
- [Architecture & Performance Guide](file:///.agents/rules/architecture-and-performance.md): Tick loop timing, ECS / subsystem architecture, spatial hashing, pathfinding strategies.
- [Coding Standards & TypeScript](file:///.agents/rules/coding-standards.md): Style guide, error handling, unit testing rules, file naming conventions.

---

## 4. Standard Tooling Commands

```bash
# Start local dev server
npm run dev

# Run type check and production build
npm run build

# Run Oxlint
npm run lint

# Run unit tests
npm test
```
