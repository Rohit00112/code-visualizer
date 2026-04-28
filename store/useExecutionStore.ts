import { create } from "zustand";
import { ExecutionSnapshot, Tracer } from "@/lib/engine/Tracer";

interface ExecutionState {
  code: string;
  snapshots: ExecutionSnapshot[];
  currentStep: number;
  isRunning: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  
  // Actions
  setCode: (code: string) => void;
  runTrace: () => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const result = factorial(3);
console.log("Factorial of 3 is:", result);
`,
  snapshots: [],
  currentStep: -1,
  isRunning: false,
  playbackSpeed: 500,

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setCode: (code) => set({ code, snapshots: [], currentStep: -1, isRunning: false }),

  runTrace: () => {
    const { code } = get();
    const tracer = new Tracer(code);
    const snapshots = tracer.trace();
    set({ snapshots, currentStep: 0, isRunning: true });
  },

  nextStep: () => {
    const { currentStep, snapshots } = get();
    if (currentStep < snapshots.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  jumpToStep: (step) => {
    const { snapshots } = get();
    if (step >= 0 && step < snapshots.length) {
      set({ currentStep: step });
    }
  },

  reset: () => set({ snapshots: [], currentStep: -1, isRunning: false }),
}));
