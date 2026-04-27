"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

export function ConsolePanel() {
  const { snapshots, currentStep, isRunning } = useExecutionStore();
  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const output = activeSnapshot?.output || [];
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [output]);

  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-2 text-sm font-medium bg-card/50">
        <Terminal className="h-4 w-4" />
        Console
      </div>
      <ScrollArea className="flex-1 p-4">
        {!isRunning ? (
          <div className="text-muted-foreground italic text-sm">
            No output yet. Run the code to see results.
          </div>
        ) : (
          <div className="space-y-1 font-mono text-sm">
            {output.length === 0 ? (
              <div className="text-muted-foreground/50 italic">Process started...</div>
            ) : (
              output.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-muted-foreground select-none opacity-50">{">"}</span>
                  <span className="text-foreground">{line}</span>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
