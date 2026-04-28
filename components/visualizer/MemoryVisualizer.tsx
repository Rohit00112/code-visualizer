"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Layers, Database, ArrowRight, Sparkles, Cpu, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepExplainer } from "@/components/ai/StepExplainer";
import { animate, stagger } from "animejs";
import { useEffect, useRef } from "react";

export function MemoryVisualizer() {
  const { snapshots, currentStep, isRunning } = useExecutionStore();
  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const scope = activeSnapshot?.scope || {};
  const stack = activeSnapshot?.stack || [];
  const variables = Object.entries(scope).filter(([key]) => key !== "self");

  const containerRef = useRef<HTMLDivElement>(null);

  // Cinematic reveal when step changes
  useEffect(() => {
    if (isRunning && containerRef.current) {
      animate(".variable-block", {
        translateY: [20, 0],
        opacity: [0, 1],
        delay: stagger(50),
        duration: 800,
        ease: "spring(1, 80, 10, 0)"
      });
    }
  }, [currentStep, isRunning]);

  if (!isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 cyber-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-glow" />
            <div className="h-24 w-24 rounded-3xl glass-primary flex items-center justify-center border-2 border-primary/30 relative z-10">
              <Cpu className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">System Standby</h2>
            <p className="text-sm text-primary/60 font-mono tracking-widest max-w-[300px]">
              Ready for neural tracing. Execute code to initialize visualization.
            </p>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-1 w-12 rounded-full bg-primary/20 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col gap-8 p-8 overflow-hidden cyber-grid relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

      {/* Cinematic Call Stack */}
      <section className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-1.5 rounded bg-primary/20">
               <Activity className="h-4 w-4 text-primary" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Execution Flow</span>
               <span className="text-xs font-bold text-white">Call Stack Intensity</span>
             </div>
          </div>
          <div className="h-[2px] flex-1 mx-6 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="flex flex-row-reverse items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {stack.length === 0 ? (
            <div className="flex-1 glass border-dashed border-primary/20 rounded-2xl py-8 text-[10px] text-primary/40 uppercase tracking-widest font-black text-center">
              Root Context
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {stack.map((frame, i) => (
                <motion.div
                  key={`${frame}-${i}`}
                  initial={{ opacity: 0, x: 50, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -50, scale: 0.8, filter: "blur(10px)" }}
                  className={`relative flex flex-col min-w-[160px] p-5 rounded-2xl border-2 transition-all duration-500 shadow-[0_0_30px_-10px_rgba(0,242,255,0.3)] ${
                    i === stack.length - 1 
                      ? "bg-primary text-black border-primary scale-110 z-20 shadow-primary/40" 
                      : "glass border-primary/10 opacity-30 grayscale blur-[1px]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black uppercase opacity-60">Layer {i + 1}</span>
                    <Layers className="h-3 w-3 opacity-40" />
                  </div>
                  <span className="text-sm font-mono font-black truncate tracking-tight">{frame}()</span>
                  <div className="mt-4 h-1 w-full bg-black/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-current opacity-30" 
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Advanced Memory Heap */}
      <section className="relative z-10 flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-1.5 rounded bg-primary/20">
               <Database className="h-4 w-4 text-primary" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Neural Memory</span>
               <span className="text-xs font-bold text-white">Heap Allocation Map</span>
             </div>
          </div>
          <div className="h-[2px] flex-1 mx-6 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
              <AnimatePresence mode="popLayout">
                {variables.map(([name, value]) => (
                  <VariableBlock key={name} name={name} value={value} />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="shrink-0 pt-4">
             <StepExplainer />
          </div>
        </div>
      </section>
    </div>
  );
}

function VariableBlock({ name, value }: { name: string, value: any }) {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  
  return (
    <motion.div
      layout
      className="variable-block group relative flex flex-col gap-4 p-6 rounded-[2rem] glass border-primary/10 hover:border-primary/40 hover:shadow-[0_0_50px_-15px_rgba(0,242,255,0.2)] transition-all duration-500"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Cpu className="h-24 w-24 text-primary" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_#00f2ff]" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">{name}</span>
        </div>
        <div className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
          {typeof value}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {isObject ? (
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-[10px] text-primary/40 font-mono font-bold tracking-widest">
               <ArrowRight className="h-4 w-4" />
               ADDR: 0x{Math.abs(name.split("").reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)).toString(16).toUpperCase()}
             </div>
             
             <div className="p-4 rounded-3xl bg-black/40 border border-primary/5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-black text-primary/30 uppercase tracking-tighter">
                  <span>{isArray ? "Sequential Buffer" : "Data structure"}</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {isArray ? `${value.length} nodes` : `${Object.keys(value).length} props`}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(value).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex flex-col p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                      <span className="text-[9px] font-black text-white/30 uppercase mb-1 tracking-tighter">{k}</span>
                      <span className="text-xs font-mono font-bold text-white/80 truncate">
                        {typeof v === "object" ? "REF" : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-2">
            <div className="h-10 w-[3px] rounded-full bg-gradient-to-b from-primary to-transparent shadow-[0_0_10px_#00f2ff]" />
            <AnimatePresence mode="wait">
              <motion.div 
                key={JSON.stringify(value)}
                initial={{ x: -20, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: 20, opacity: 0, filter: "blur(10px)" }}
                className="text-2xl font-mono font-black text-white tracking-tighter"
              >
                {typeof value === "string" ? `"${value}"` : String(value)}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Interactive Ripple on Hover */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
