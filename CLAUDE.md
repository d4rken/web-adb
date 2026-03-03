# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (polling watcher, localhost:5173/web-adb/)
npm run build    # tsc -b && vite build (TypeScript checked first, then bundled)
npm run test     # vitest run (single pass, non-watch)
npm run lint     # eslint .
```

Tests live alongside source as `*.test.ts`. There's no single-test flag needed — vitest filters by filename:
```bash
npx vitest run src/lib/router.test.ts
```

Vite base path is `/web-adb/` (matches GitHub repo name). This affects all asset URLs and dev server path.

## Architecture

**Two-panel layout**: Wizard (left, scrollable) + Terminal (right, xterm.js read-only output). They communicate through props — `writeln` is passed from `App.tsx` into `WizardContainer`. No shared context or event bus.

### Wizard step derivation

The active wizard step is a **pure function of connection state + URL hash**. There is no wizard state machine. The hash is the source of truth:

| State | Hash | Step |
|---|---|---|
| disconnected | any | Connect |
| connected | `#/` | Select App |
| connected | `#/{appId}` | Select Command |
| connected | `#/{appId}/{commandId}` | Review |
| connected | (after execution) | Result |

`WizardContainer.tsx` derives the step on every render. `navigateTo()` updates the hash, which triggers a `hashchange` event and re-render.

### ADB connection lifecycle

Module-level singleton `currentAdb` in `connection.ts` ↔ `adbRef` in `useAdbConnection` hook. Both are kept in sync via `transport.disconnected` promise. Auto-reconnect on mount tries `manager.getDevices()` (no picker) for previously-paired devices.

Auth timeout: 30s. Command timeout: 10s. Both support `AbortSignal` cancellation.

Shell protocol (v2, with exit codes) is preferred; falls back to none protocol for older devices.

### Command registry

To add a new app:
1. Create `src/data/apps/<app-id>.ts` exporting an `AppCategory`
2. Import and add it to the `apps` array in `src/data/registry.ts`

Simple commands: set `command: "shell command string"`.

Multi-step commands: set `command: null` and implement `execute(run)` where `run` is `(cmd: string) => Promise<string>`. See `enable-accessibility-service` in `sdmaid-se.ts` — it does a read-modify-write on a colon-separated settings list to avoid overwriting other accessibility services.

### Key packages

- `@yume-chan/adb` + `adb-daemon-webusb` + `adb-credential-web`: ADB over WebUSB with IndexedDB key storage
- `@xterm/xterm` + `@xterm/addon-fit`: Terminal output (stdin disabled)
- TailwindCSS v4: No `tailwind.config.js` — uses `@import "tailwindcss"` directive + Vite plugin

### TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`. Two project references: `tsconfig.app.json` (browser, ES2022+DOM) and `tsconfig.node.json` (vite config only).

## Deployment

GitHub Pages via Actions (`.github/workflows/deploy.yml`). Push to `main` triggers build + deploy. Pages source must be set to "GitHub Actions" in repo settings.
