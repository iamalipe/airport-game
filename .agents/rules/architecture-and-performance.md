# Architecture & Performance Guidelines

This document details the architectural standards, performance constraints, and engine-rendering-UI bridges for the Airport CEO Web codebase.

---

## 1. Decoupled 3-Tier Architecture

The system is strictly divided into three distinct layers with unidirectional data flow:

```
┌────────────────────────────────────────────────────────┐
│                   React 19 UI Layer                    │
│   (HUD, Build Menus, Flight Scheduler, Reports, Modals)│
└───────────────────────────▲────────────────────────────┘
                            │ (Events / Reactive Selectors)
┌───────────────────────────┴────────────────────────────┐
│                  Renderer (View Layer)                 │
│      (PixiJS / WebGL / Canvas2D, Camera, Sprites)      │
└───────────────────────────▲────────────────────────────┘
                            │ (Interpolated State Reads)
┌───────────────────────────┴────────────────────────────┐
│             Simulation Engine (Core Logic)             │
│ (Fixed Timestep Loop, Subsystems, Entities, Pathfinding)│
└───────────────────────────▲────────────────────────────┘
                            │ (Player Actions & Commands)
                    [ Input Controller ]
```

### Layer 1: Simulation Engine (`src/engine/`)

- **Purity:** Absolutely no references to DOM, `window`, `document`, HTMLCanvasElement, or React.
- **Fixed Timestep:** Runs on fixed delta time (e.g. 50ms = 20 ticks per second, or 16.6ms = 60 TPS).
- **Time Scaling:** Supports `0x` (Paused), `1x` (Normal), `2x` (Fast), `3x` (Ultra-Fast) via tick accumulator.
- **Subsystem Registration:**
  - `World`: Container for Grid, Zones, Entities, Spatial Index.
  - Subsystems run sequentially in `World.tick(dt)`:
    1. `TimeSystem` (in-game minutes, day/night clock)
    2. `EconomySystem` (hourly cashflow, salaries, maintenance)
    3. `ATCSystem` (runway queue, approach, taxi allocation)
    4. `TurnaroundSystem` (service steps per stand)
    5. `PassengerSystem` (needs, path state, queues, boarding)
    6. `StaffSystem` (shift schedules, job dispatcher)
    7. `VehicleSystem` (road routing, service dispatch)
    8. `BaggageSystem` (conveyor routing, scan, sorting)
    9. `MovementSystem` (entity position updates on paths)

### Layer 2: PixiJS Renderer (`src/render/`)

- **Rendering Engine:** **PixiJS (v8)** for high-performance 2D WebGL/WebGPU rendering.
- **Read-Only Data Access:** Reads current and previous tick state from the Engine to compute interpolated render positions:
  $$\text{RenderPos} = \text{PrevPos} + (\text{CurrPos} - \text{PrevPos}) \times \alpha$$
  where $\alpha = \frac{\text{accumulator}}{\text{tickDuration}}$.
- **Viewport & Camera:** Managed via PixiJS Container transforms (pan `x`, `y`, zoom factor `0.2x` to `3.0x`), screen-to-world conversion, and world-to-grid snapping.
- **Layer Stacking (PixiJS Containers in Render Order):**
  1. `terrainContainer`: Base terrain, grass, water.
  2. `infrastructureContainer`: Chunked floor tiles, apron asphalt, runways, taxiways.
  3. `markingContainer`: Taxi lines, hold lines, service road markings.
  4. `conveyorContainer`: Baggage belts and sorting machines (Floor -1 / 0).
  5. `structureContainer`: Walls, windows, doors, interior furniture, rooms.
  6. `vehicleContainer`: Parked and moving service vehicles, pushback tugs.
  7. `aircraftContainer`: Parked and taxiing aircraft sprites with rotation/shadows.
  8. `agentContainer`: Passenger and staff sprites (batched/pooled).
  9. `overlayContainer`: Zoning overlays, grid overlay, selection outlines, hover previews.

### Layer 3: React 19 + Jotai UI (`src/ui/`)

- **State Management with Jotai:**
  - **Fine-Grained Atomic Reactivity:** Minimal re-renders through isolated Jotai atoms.
  - **UI State Atoms (`src/ui/state/uiAtoms.ts`):**
    - `activeBuildToolAtom` (selected tool: Wall, Foundation, Runway, Belt, Desk, Demolish).
    - `selectedEntityAtom` (inspected passenger, aircraft, stand, or staff member).
    - `activeFloorAtom` (-1, 0, 1, 2).
    - `gameSpeedAtom` (0 = pause, 1 = 1x, 2 = 2x, 3 = 3x).
    - `openWindowsAtom` (Flight Planner, Finances, Staff, Contracts).
  - **Engine-to-Jotai Bridge (`src/ui/state/engineAtoms.ts`):**
    - Throttled sync pushes game metrics (Cash balance, Time/Day, Rating, Flight counts) into Jotai atoms at 10–20Hz.
    - React UI components subscribe only to the specific atoms they render (e.g. `<ClockDisplay />` subscribes only to `inGameTimeAtom`).
  - **Player Command Dispatch:** User actions invoke Jotai write-only action atoms or dispatchers that enqueue typed `GameCommand` objects to the Engine's `CommandQueue`.

---

## 2. Web Performance & Memory Rules

To maintain solid 60 FPS in browsers with thousands of active passengers, baggage items, and vehicles:

### 2.1 Zero Allocations in Hot Loops

- **Rule:** Never allocate objects, arrays, or lambdas inside `tick()`, `update()`, or `render()`.
- **Pre-allocation & Pools:**
  - `ObjectPool<T>` for:
    - Pathfinding A\* nodes (`PathNode`)
    - Vector2 math instances
    - Transient event payloads
    - Visual particle effects
    - Conveyor luggage item representations

### 2.2 Spatial Partitioning (Spatial Hash Grid)

- Divide the world into buckets (e.g., 8x8 or 16x16 grid cells).
- Entities (Pax, Staff, Vehicles, Aircraft) register in their current spatial bucket.
- Lookups for proximity (e.g., finding nearest restroom, nearby passengers for social interactions, or rendering viewport culling) query only relevant bounding buckets in $\mathcal{O}(1)$ time.

### 2.3 Pathfinding Architecture

- **Hierarchical Approach:**
  - **Runway & Taxiway Graph:** Pre-computed waypoint network. Aircraft use Dijkstra / A\* over sparse graph nodes.
  - **Service Road Graph:** Road waypoint nodes for vehicle routing.
  - **Passenger Terminal Navigation:**
    - High-volume common flows (e.g. Entrance -> Security, Security -> Gate Lounge): Pre-computed **Flow Fields / Vector Fields**.
    - Local pathing & obstruction avoidance: Fast Grid A\* with Manhattan distance heuristic and diagonal smoothing.
  - **Baggage Routing:** Conveyor network is a directed acyclic graph (DAG) evaluated via cached route tables.

### 2.4 Rendering Optimization

- **Viewport Culling:** Only draw tiles, walls, furniture, and entities that intersect the camera's visible viewport bounding box.
- **Batched Tilemap Rendering:** Group static floor and apron tiles into chunked mesh / sprite batches (e.g. 32x32 tile chunks) rather than individual draw calls.
- **Multi-Floor Visibility:** Only render active floor level, with optional subtle ghosting/dimming of lower floors.
