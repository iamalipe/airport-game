# GEMINI.md - Antigravity Guidelines

This workspace is configured for **Airport CEO Web**, a 2D web-based airport tycoon simulation.

Detailed guidelines and architectural rules are defined in:

- [`CLAUDE.md`](file:///Users/abhiseck/Documents/Dev_Files/MyGithub/airport-game/CLAUDE.md)
- [`AGENTS.md`](file:///Users/abhiseck/Documents/Dev_Files/MyGithub/airport-game/AGENTS.md)
- [`.agents/rules/airport-ceo-game-design.md`](file:///Users/abhiseck/Documents/Dev_Files/MyGithub/airport-game/.agents/rules/airport-ceo-game-design.md)
- [`.agents/rules/architecture-and-performance.md`](file:///Users/abhiseck/Documents/Dev_Files/MyGithub/airport-game/.agents/rules/architecture-and-performance.md)
- [`.agents/rules/coding-standards.md`](file:///Users/abhiseck/Documents/Dev_Files/MyGithub/airport-game/.agents/rules/coding-standards.md)

### Key Priorities:

1. **No direct code without approval:** Keep architecture decoupled into Engine (headless), Renderer (PixiJS 2D), and UI (React 19 + Jotai).
2. **Deterministic & Headless Simulation:** All game logic in `src/engine/` is completely independent of DOM/React/PixiJS.
3. **High Performance:** Object pooling, spatial hash partitioning, flow field/graph pathfinding, Jotai atomic UI updates, 60fps web target.
