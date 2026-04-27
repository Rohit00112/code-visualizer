"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers } from "lucide-react";

export function CallStackPanel() {
  const { snapshots, currentStep, isRunning } = useExecutionStore();
  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const stack = activeSnapshot?.stack || [];

  if (!isRunning) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Run the code to see the call stack.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col-reverse gap-2">
        {stack.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-muted/50 border border-dashed text-sm font-mono text-muted-foreground">
            (Global Scope)
          </div>
        ) : (
          stack.map((frame, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 px-3 py-2 rounded border transition-all ${
                i === stack.length - 1 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "bg-card border-border opacity-70"
              }`}
            >
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === stack.length - 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-mono">{frame}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Function Frame</span>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
