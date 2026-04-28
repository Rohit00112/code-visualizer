"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { ValueDisplay } from "./ValueDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Activity } from "lucide-react";

export function VariablesPanel() {
  const { snapshots, currentStep, isRunning } = useExecutionStore();
  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const scope = activeSnapshot?.scope || {};

  const entries = Object.entries(scope).filter(([key]) => key !== "self");

  if (!isRunning) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-[#0a0a0c] cyber-grid opacity-20">
        <Database className="h-8 w-8 text-primary/20 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">
          State Monitoring Offline
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-2 bg-white/5">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Register States</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-2">
          {entries.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Null State Detected</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {entries.map(([name, value]) => (
                <div key={name} className="glass p-3 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
                  <ValueDisplay name={name} value={value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
