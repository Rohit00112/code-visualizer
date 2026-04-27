# Code Execution Visualizer Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a modern web platform that visualizes code execution step-by-step, showing variable states, call stack, and memory allocation.

**Architecture:** Next.js App Router for the shell. A custom-built execution tracer (using JS-Interpreter or AST-based walking) that generates a serializable execution trace. React-based visualization components to render this trace.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Zustand, Monaco Editor, Acorn (Parser), JS-Interpreter.

---

### Task 1: Project Initialization & Foundation

**Files:**
- Create: `package.json`, `app/layout.tsx`, `app/page.tsx`
- Create: `components/editor/CodeEditor.tsx`
- Create: `components/layout/SplitView.tsx`

**Step 1: Initialize Next.js project**
Run: `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*" --use-npm --yes`

**Step 2: Install dependencies**
Run: `npm install @monaco-editor/react zustand lucide-react acorn js-interpreter`

**Step 3: Create the main SplitView layout**
Create a responsive split-pane component using Tailwind.

**Step 4: Integrate Monaco Editor**
Setup a basic code editor in the left panel.

**Step 5: Commit**
```bash
git add .
git commit -m "chore: initial next.js setup with monaco editor"
```

---

### Task 2: Core Execution Engine (JavaScript)

**Files:**
- Create: `lib/engine/Tracer.ts`
- Create: `lib/engine/interpreter.d.ts` (Type definitions for js-interpreter)

**Step 1: Define Trace Types**
```typescript
interface ExecutionSnapshot {
  line: number;
  column: number;
  scope: Record<string, any>;
  stack: string[];
  output: string[];
}
```

**Step 2: Implement the Tracer class**
Use `JS-Interpreter` to step through code and capture snapshots.
Capture `interpreter.stateStack` for call stack and `interpreter.getScope()` for variables.

**Step 3: Create a test script to verify tracing**
Ensure a simple loop `for(let i=0; i<3; i++) console.log(i)` generates 10+ steps with correct `i` values.

**Step 4: Commit**
```bash
git add lib/engine/
git commit -m "feat: core javascript execution engine with step-by-step tracing"
```

---

### Task 3: State Management & Stepping Controls

**Files:**
- Create: `store/useExecutionStore.ts`
- Create: `components/controls/ExecutionControls.tsx`

**Step 1: Create Zustand Store**
Store code, trace array, current step index, and execution status (idle, running, paused).

**Step 2: Implement Stepping Logic**
Functions for `stepForward`, `stepBackward`, `jumpTo(index)`.

**Step 3: Build the Controls UI**
Buttons for Play, Pause, Step Forward, Step Backward, and a slider for the timeline.

**Step 4: Commit**
```bash
git add store/ components/controls/
git commit -m "feat: execution state management and playback controls"
```

---

### Task 4: Variable Visualization Panel

**Files:**
- Create: `components/visualizer/VariablesPanel.tsx`
- Create: `components/visualizer/ValueDisplay.tsx`

**Step 1: Build a recursive Tree view for objects**
Handle primitives, arrays, and nested objects with color-coding.

**Step 2: Connect panel to Current Step state**
Map the `scope` of the current snapshot to the tree view.

**Step 3: Commit**
```bash
git add components/visualizer/
git commit -m "feat: variable state visualization with nested object support"
```

---

### Task 5: Call Stack & Console

**Files:**
- Create: `components/visualizer/CallStackPanel.tsx`
- Create: `components/visualizer/ConsolePanel.tsx`

**Step 1: Visualize the Function Stack**
Show current function frames and their parameters.

**Step 2: Implement Real-time Console**
Accumulate `console.log` output per step.

**Step 3: Commit**
```bash
git add components/visualizer/
git commit -m "feat: call stack and console panels"
```

---

### Task 6: Polish UI & Line Highlighting

**Files:**
- Modify: `components/editor/CodeEditor.tsx`
- Modify: `app/page.tsx`

**Step 1: Sync Editor Line Highlighting**
Use Monaco's `deltaDecorations` to highlight the line being executed in the current snapshot.

**Step 2: Add smooth transitions**
Use Framer Motion for value changes in the visualization panels.

**Step 3: Commit**
```bash
git add .
git commit -m "ui: polish layout and sync line highlighting with editor"
```

---

### Task 7: AI Explainer Integration

**Files:**
- Create: `app/api/explain/route.ts`
- Create: `components/ai/StepExplainer.tsx`

**Step 1: Implement Gemini API Route**
Prompt: "Explain this specific step in the execution. Code: ..., Current Line: ..., Variables: ..."

**Step 2: UI for AI Chat/Explanation**
A panel that updates when requested to explain the 'why' behind the current state.

**Step 3: Commit**
```bash
git add app/api/ explain/
git commit -m "feat: ai-assisted step explanation using gemini"
```

---

## Success Criteria
1. User can type JS code.
2. User can step forward/backward.
3. Variables panel updates correctly.
4. Call stack shows recursion depth.
5. AI explains the logic correctly.
