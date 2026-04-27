"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { ValueDisplay } from "./ValueDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";

export function VariablesPanel() {
  const { snapshots, currentStep, isRunning } = useExecutionStore();
  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const scope = activeSnapshot?.scope || {};

  const entries = Object.entries(scope).filter(([key]) => key !== "self");

  if (!isRunning) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Run the code to see variable states.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-1">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No variables in current scope.</p>
        ) : (
          entries.map(([name, value]) => (
            <ValueDisplay key={name} name={name} value={value} />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
