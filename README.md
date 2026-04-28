# Code Visualizer

Cinematic JavaScript execution visualizer. Step through code, watch variables and the call stack mutate in real time, and ask an AI to explain any frame.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-149eca) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## Features

- **Monaco editor** with active-line highlighting synced to execution
- **Trace engine** — Babel transpiles ES2022 → ES5, JS-Interpreter steps an AST sandbox
- **Snapshot timeline** — scrub, step, autoplay at 1×–10×
- **Memory visualizer** — heap blocks, call stack frames, console output
- **AI step explainer** — Gemini 1.5 Flash describes the active step
- **Glassmorphism UI** with framer-motion + animejs reveals

## Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| State | Zustand |
| Editor | `@monaco-editor/react` |
| Trace | `js-interpreter` + `@babel/standalone` |
| UI | Tailwind v4, shadcn primitives, framer-motion, animejs |
| AI | `@google/generative-ai` (Gemini 1.5 Flash) |

## Quick start

```bash
npm install
cp .env.example .env.local      # add your Gemini API key
npm run dev
```

Open http://localhost:3000.

## Environment

| Var | Required | Use |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | for AI explainer | https://aistudio.google.com/app/apikey |

App runs without the key — only the *Explain this step* button needs it.

## Architecture

```
app/                    Next.js routes (page + /api/explain)
components/
  editor/               Monaco wrapper, active-line decorations
  visualizer/           Memory, variables, console, call stack panels
  controls/             Playback timeline, autoplay, speed
  ai/                   StepExplainer (Gemini caller)
  layout/               Resizable split-view
lib/engine/Tracer.ts    Babel transform + JS-Interpreter step loop
store/useExecutionStore Zustand store: code, snapshots, currentStep
```

The `Tracer` walks `interpreter.step()`, captures `{line, scope, stack, output, type}` on interesting AST node types, and dedupes consecutive identical frames. The store drives every panel from `snapshots[currentStep]`.

## Scripts

```bash
npm run dev     # Turbopack dev server
npm run build   # production build + type-check
npm run lint    # eslint
```

## License

MIT