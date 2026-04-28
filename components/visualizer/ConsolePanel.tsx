"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Cpu, Activity } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function ConsolePanel() {
  const { snapshots, currentStep } = useExecutionStore();
  const logs = currentStep >= 0 ? snapshots[currentStep].output : [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      
      animate(".console-line:last-child", {
        translateX: [-10, 0],
        opacity: [0, 1],
        duration: 300,
        ease: "outQuad"
      });
    }
  }, [logs]);

  return (
    <div className="flex h-full flex-col bg-[#0c0c0e] relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-2 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Data Stream Output</span>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/30 uppercase tracking-tighter">
             <Activity className="h-2 w-2 text-green-500" />
             Link: Stable
           </div>
        </div>
      </div>

      <ScrollArea className="flex-1 font-mono text-xs p-6" ref={scrollRef}>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-white/20 italic opacity-50 flex items-center gap-2 animate-pulse">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Listening for system output...
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="console-line flex gap-3 text-primary/80 group">
                <span className="text-primary/20 select-none">[{String(i).padStart(3, '0')}]</span>
                <span className="text-white/90 group-hover:text-primary transition-colors">{log}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
