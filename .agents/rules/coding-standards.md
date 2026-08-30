# Coding Standards & TypeScript Conventions

This document specifies the code style, typing rules, error handling, and testing strategies for all developers and AI assistants working on the Airport CEO Web project.

---

## 0. Strict Scope Adherence (No Unsolicited Additions)

- **Rule:** ONLY implement, modify, or add what the user explicitly requests.
- **Prohibited:** Do NOT add unasked-for UI buttons, extra features, speculative helper code, or unsolicited widgets.
- Keep every implementation minimal, tight, and strictly confined to the exact instructions in the user's prompt.

---

## 1. TypeScript Standards & Domain Typing

### 1.1 Strict Type Safety

- **No `any` or `unknown` escape hatches:** Always define explicit interfaces and union types.
- **Explicit Function Return Types:** All public methods, engine functions, and exported helpers must have explicit return types.
- **Enums vs Const Unions:** Prefer string literal union types or `as const` objects over numeric TypeScript enums for better serialization and debugging:
  ```ts
  export const ZoneType = {
    PUBLIC: "public",
    SECURE: "secure",
    STAFF: "staff",
    AIRSIDE: "airside",
  } as const;
  export type ZoneType = (typeof ZoneType)[keyof typeof ZoneType];
  ```

### 1.2 Branded & Domain Primitives

Avoid raw numbers for distinct domain concepts:

```ts
/** Discrete tile grid coordinate (integers) */
export interface GridCoord {
  x: number;
  y: number;
  floor: number;
}

/** Continuous world space coordinate (floats in world pixels/meters) */
export interface WorldPos {
  x: number;
  y: number;
  floor: number;
}

/** Monetary value in integer cents to eliminate floating-point currency errors */
export type Cents = number;

/** In-game time represented as minutes from midnight (0 to 1439) */
export type MinuteOfDay = number;

/** Unique Entity ID */
export type EntityId = string;
```

---

## 2. Code Organization & Patterns

### 2.1 File & Directory Conventions

- **PascalCase** for React components and Class files: `FlightScheduler.tsx`, `World.ts`, `SpatialHashGrid.ts`.
- **camelCase** for utility files, subsystems, hooks, and types: `passengerSystem.ts`, `useEngineSnapshot.ts`, `gridMath.ts`.
- **Index Exports:** Each major module folder should have an `index.ts` exporting clean public APIs.

### 2.2 Entity Component / Subsystem Pattern

- Keep entity state pure and serializable:
  ```ts
  export interface AircraftEntity {
    id: EntityId;
    flightNumber: string;
    airlineId: string;
    aircraftTypeId: string;
    status: FlightStatus;
    assignedStandId: string | null;
    position: WorldPos;
    heading: number; // in radians or degrees
    turnaroundProgress: TurnaroundState;
    fuelLevel: number; // liters
    assignedRunwayId: string | null;
  }
  ```
- Keep systems logic pure and modular:
  ```ts
  export interface ISubsystem {
    name: string;
    init(world: World): void;
    tick(world: World, dt: number): void;
    reset(): void;
  }
  ```

### 2.3 Jotai State & Atom Conventions

- Define atoms with explicit suffix `Atom` in `src/ui/state/`:

  ```ts
  // Primitive UI atoms
  export const activeBuildToolAtom = atom<BuildToolType>("select");
  export const activeFloorAtom = atom<number>(0);
  export const selectedEntityIdAtom = atom<EntityId | null>(null);

  // Read-only / Derived snapshot atoms from Engine
  export const cashBalanceAtom = atom<Cents>(100_000_00);
  export const inGameTimeAtom = atom<MinuteOfDay>(360); // 06:00 AM
  ```

- Use write-only action atoms to dispatch commands to the Engine:
  ```ts
  export const dispatchCommandAtom = atom(
    null,
    (get, set, command: GameCommand) => {
      engineInstance.commandQueue.enqueue(command);
    },
  );
  ```

### 2.4 PixiJS Rendering Conventions

- PixiJS code is strictly contained inside `src/render/`.
- Manage display objects through container hierarchies (`Stage` -> `Viewport` -> Layer Containers).
- Reuse Sprite instances via pooling for dynamic entities (passengers, baggage, vehicles) rather than creating new `PIXI.Sprite` instances each tick.
- Use `pixi.js` textures loaded through `Assets.load()` in a centralized asset manifest.

### 2.5 Command Pattern for Player Inputs

All actions initiated by the user or UI must pass through the `CommandQueue`:

```ts
export interface BuildTileCommand {
  type: 'BUILD_TILE';
  coord: GridCoord;
  tileType: TileType;
  cost: Cents;
}

export interface ScheduleFlightCommand {
  type: 'SCHEDULE_FLIGHT';
  flightId: string;
  standId: string;
  arrivalTime: MinuteOfDay;
}

export type GameCommand = BuildTileCommand | ScheduleFlightCommand | ...;
```

---

## 3. Error Handling & Robustness

1. **Engine Tick Isolation:** A failure in one entity's state machine (e.g. invalid path for one passenger) must not crash the entire game loop. Log a warning, flag the entity for reset/removal, and proceed with other systems.
2. **Defensive Pathfinding:** Always handle unreachable destination scenarios gracefully (e.g. passenger cannot reach gate -> set status to `WANDERING` or `LOST` and display warning icon).
3. **Data Schema Validation:** Validate save files and mod configurations with runtime schema validation (e.g. Zod or lightweight type guards) to prevent corrupted states.

---

## 4. Testing Strategy

1. **Unit Testing (Vitest):**
   - Test all engine subsystems in isolation headlessly.
   - Example tests:
     - `TurnaroundSystem.test.ts`: Verify full 7-step turnaround sequence transitions.
     - `EconomySystem.test.ts`: Verify daily balance sheet calculation, interest, and bankruptcy checks.
     - `BaggageRouting.test.ts`: Verify luggage reaches correct baggage bay via conveyor DAG.
     - `Pathfinding.test.ts`: Verify A\* finds optimal route and handles blocked walls.
2. **Deterministic Simulation Tests:**
   - Run a simulated 24-hour day in fast-forward headlessly with 50 scheduled flights, verifying 0 memory leaks and correct departure counts.
3. **UI Component Tests:**
   - Test React UI panels (Build menu, Flight Scheduler Gantt chart) using React Testing Library.

---

## 5. Oxlint & Linting Rules

- Follow standard Oxlint configuration (`.oxlintrc.json`).
- Ensure all TypeScript files pass type checking without errors (`npm run build` or `tsc --noEmit`).
