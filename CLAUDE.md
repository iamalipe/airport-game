# Airport CEO Web - AI Assistant & Development Guidelines

Welcome to the **Airport CEO Web** project. This file provides critical rules, architectural guidelines, domain concepts, and development workflows for AI assistants (Claude Code, Antigravity, and other agents) and developers working on this codebase.

---

## 1. Project Overview & Philosophy

**Airport CEO Web** is a deep 2D top-down airport management and tycoon simulation game designed to run smoothly at 60 FPS in modern web browsers.

### Core Pillars

1. **Deep, Emergent Simulation:** Realistic airport operations including flight turnaround logistics (fueling, catering, baggage, cleaning, de-icing), multi-zone passenger flow with individual needs/moods, baggage handling conveyor networks, employee scheduling, and complex airline contracts.
2. **Strict Decoupled Architecture:** Strict separation between **Simulation Engine** (headless, tick-based), **Rendering Engine** (Canvas/WebGL/PixiJS 2D view), and **UI/HUD** (React 19 overlay).
3. **High Performance & Zero GC Spikes:** Web-first optimization with spatial partitioning, object pooling, hierarchical pathfinding, and deterministic simulation ticks.
4. **Data-Driven & Extensible:** Flight types, airlines, passenger archetypes, building materials, and equipment configured through structured data schemas.

---

### 2. Architecture & Layer Separation

All development must maintain a strict 3-tier boundary:

```
┌────────────────────────────────────────────────────────┐
│               React 19 + Jotai UI Layer                │
│   (HUD, Build Menus, Flight Scheduler, Reports, Modals)│
└───────────────────────────▲────────────────────────────┘
                            │ (Jotai Atoms & Throttled Sync)
┌───────────────────────────┴────────────────────────────┐
│              PixiJS Renderer (View Layer)              │
│    (PixiJS Stage, Containers, Sprites, Viewport/Camera)│
└───────────────────────────▲────────────────────────────┘
                            │ (Interpolated State Reads)
┌───────────────────────────┴────────────────────────────┐
│             Simulation Engine (Core Logic)             │
│ (Fixed Timestep Loop, Subsystems, Entities, Pathfinding)│
└────────────────────────────────────────────────────────┘
```

### Layer Rules:

- **`src/engine/` (Simulation Core):**
  - **Zero DOM/Canvas/React/PixiJS dependencies.** Must be runnable headlessly in tests and Web Workers.
  - Operates on a fixed timestep tick loop (e.g. 20–60 TPS).
  - All game state mutations happen strictly inside engine ticks.
  - Uses discrete grid coordinates (`GridCoord`: x, y, floor) and float world positions for moving entities.
- **`src/render/` (PixiJS View Layer):**
  - Built with **PixiJS**: Stage, Viewport, Layer Containers, Sprites, and Graphics.
  - Reads simulation state (read-only) and renders interpolated positions between ticks.
  - Manages camera pan/zoom, tile rendering, sprite animations, selection highlights, and visual particles.
  - Must never mutate simulation state directly; sends player input commands to the Engine.
- **`src/ui/` (React 19 + Jotai Interface):**
  - State management powered by **Jotai** atoms (`src/ui/state/`):
    - UI state atoms: `activeBuildToolAtom`, `selectedEntityAtom`, `activeFloorAtom`, `gameSpeedAtom`, modal toggle atoms.
    - Synced simulation atoms: `cashAtom`, `inGameTimeAtom`, `airportRatingAtom`, `activeAlertsAtom` (updated at throttled intervals, e.g. 10–20Hz).
  - Manages overlays: Build/Demolish toolbar, Flight Planner (Gantt schedule), Finance dashboards, Staff hiring, Zoning inspector, Passenger detail views, Game speed controls.

---

## 3. Directory & File Structure

```
src/
├── engine/              # Pure simulation engine (Headless / Zero DOM / Zero PixiJS)
│   ├── core/            # GameLoop, World, Time/Clock, EventBus, Config, CommandQueue
│   ├── grid/            # Multi-floor tile grid, zoning (Public, Secure, Staff, Airside)
│   ├── entities/        # Entity definitions & state machines (Aircraft, Pax, Staff, Vehicles)
│   ├── systems/         # Simulation subsystems:
│   │   ├── atc/         # Runway scheduling, approach, taxi routing, gate allocation
│   │   ├── turnaround/  # Service turnaround workflows (fuel, baggage, catering, cleaning)
│   │   ├── passenger/   # Pax life cycle, needs (hunger, bladder, boredom), boarding flow
│   │   ├── baggage/     # Conveyor graph routing, security scanners, sorting bays
│   │   ├── vehicles/    # Service vehicle dispatch, road pathfinding
│   │   ├── staff/       # Employee shifts, task dispatching (security, ramp, tech, janitor)
│   │   └── economy/     # Cash balance, hourly OpEx/CapEx, loans, landing fees, pricing
│   ├── pathfinding/     # A*, Flow Fields, Waypoint/Taxiway graphs, Spatial Hash Grid
│   └── serialization/   # Save/Load, JSON state schemas, version migrations
├── render/              # PixiJS 2D Rendering Engine
│   ├── app/             # PixiJS Application lifecycle & canvas mounting
│   ├── camera/          # Viewport, zoom, panning, screen-to-world/grid conversion
│   ├── layers/          # PixiJS Containers: terrain, floor tiles, walls, zones, objects, baggage belts
│   ├── sprites/         # Aircraft, pax, vehicle sprite renderers & animation pools
│   └── RenderController.ts
├── ui/                  # React 19 UI Overlay
│   ├── state/           # Jotai atoms (UI state, tool selection, engine snapshot atoms)
│   ├── components/      # Reusable UI widgets (buttons, modals, sliders, tabs)
│   ├── hud/             # Top bar (Clock, Cash, Rating, Speed) and Bottom Toolbar (Build, Zones)
│   ├── windows/         # Flight Scheduler, Finance, Airline Contracts, Staff Roster, Build Menu
│   └── hooks/           # React hooks bridging Engine events and Jotai atoms
├── data/                # Data-driven definitions (Airlines, Aircraft specs, Items, Research)
├── types/               # Shared TypeScript definitions & domain interfaces
└── utils/               # Math, spatial helpers, random seeds, object pools
```

---

## 4. Key Simulation Systems & Domain Specifications

### A. Aircraft & Turnaround Lifecycle

1. **Flight Phases:** `Scheduled` -> `Inbound Approach` -> `Touchdown` -> `Taxi to Stand` -> `On Stand (Turnaround)` -> `Pushback` -> `Taxi to Runway` -> `Takeoff` -> `Departed`.
2. **Turnaround Service Operations (parallel & sequential):**
   - Passenger Deboarding (via jet bridge or bus/stairs).
   - Baggage Unloading (belt loader -> baggage tug -> baggage bay).
   - Cabin Cleaning & Waste Removal (janitor crew / service vehicle).
   - Aircraft Refueling (Jet-A1 or Avgas via fuel truck / hydrant).
   - In-Flight Catering (catering truck).
   - Baggage Loading (sorted bags -> baggage tug -> belt loader).
   - Passenger Boarding (check-in validated -> security passed -> gate boarding).
   - Pushback & Engine Start.

### B. Passenger (PAX) Life Cycle & AI State Machine

- **Departing PAX:** Arrive at Airport -> Check-in (Desk / Self-Service Kiosk) -> Bag Drop -> Security Screening -> Dwell Zone (Shopping / Food / Restroom / Waiting) -> Gate Arrival -> Boarding Pass Scan -> Board Aircraft.
- **Arriving PAX:** Deplane -> Walk to Terminal -> Baggage Claim Carousel -> Customs / Exit Airport.
- **Passenger Needs:** Hunger, Thirst, Rest, Bladder, Boredom, Stress/Punctuality. High stress or missed steps lead to missed flights and airport rating penalties.

### C. Multi-Floor & Zoning System

- **Floors:** Basement / Level -1 (Baggage conveyor belts, service tunnels), Level 0 (Ground/Apron, Check-in, Baggage claim), Level 1 (Departures, Security, Boarding gates), Level 2+ (Lounges, Offices).
- **Zone Types:**
  - `Public Area`: Non-secure entrance, check-in, landside retail.
  - `Secure Area`: Post-security departures and gates (requires passenger security screening).
  - `Staff Only`: Office, employee breakrooms, control rooms.
  - `Airside / Ramp`: Service roads, taxiways, stands (requires security clearance).

### D. Baggage Handling System

- Modeled as a **directed conveyor belt graph**.
- Elements: Check-in conveyor, tilt trays, high-speed straight belts, level transitions (elevators/chutes), X-Ray scanners (Tier 1-3 security), destination baggage sortation bay, baggage claim carousel.

---

## 5. Performance & Coding Guidelines

### Memory & Performance Rules:

1. **No Allocations in Hot Loops:** Never instantiate objects, arrays, or anonymous functions in the render loop (`requestAnimationFrame`) or the simulation tick loop (`tick()`).
2. **Object Pooling:** Use reusable object pools for particles, temporary vectors, pathfinding nodes, and short-lived state packets.
3. **Spatial Partitioning:** Use a Spatial Hash Grid or Quadtree for fast range queries (e.g. finding nearest restroom, aircraft proximity, passenger collision/spacing).
4. **Hierarchical Pathfinding:**
   - Aircraft & Service Vehicles: Node-edge Waypoint Graphs (Runway/Taxiway/Road graph).
   - Passengers: Flow Fields (for common destinations like security/gates) and Grid A\* with caching.
   - Baggage: Discrete directed graph routing.

### TypeScript & Code Standards:

- **Strict Mode:** Use strict TypeScript without `any` or `unknown` escape hatches.
- **Domain Primitive Types:** Use branded/explicit types for coordinates and currency:
  ```ts
  export type GridCoord = { x: number; y: number; floor: number };
  export type WorldPos = { x: number; y: number; floor: number };
  export type Cents = number; // Avoid float rounding errors in financial transactions
  export type MinuteOfDay = number; // 0 to 1439
  ```
- **Immutability where appropriate:** Simulation snapshots passed to the UI must be immutable or read-only views.

---

## 6. Build, Test & Development Commands

- `npm run dev`: Start local development server with Vite.
- `npm run build`: Build production assets (`tsc -b && vite build`).
- `npm run lint`: Lint code with Oxlint.
- `npm test`: Run unit tests (Vitest) for simulation engine subsystems.

---

## 7. AI Assistant Instructions (How to work on this repo)

1. **Keep Engine Independent:** When implementing game mechanics, implement them in `src/engine/` first with comprehensive unit tests before connecting to rendering or UI.
2. **Design for Extensibility:** Create data-driven configs in `src/data/` (JSON/TS constants) instead of hardcoding aircraft sizes, building costs, or passenger parameters.
3. **Step-by-Step Implementation:** When building complex features (e.g., Baggage System or ATC), break the work into:
   - Data structures & State interfaces
   - Simulation system & Tick logic
   - Pathfinding/Routing integration
   - Unit tests
   - Visual rendering hooks
   - React UI inspector/management dashboard
