"use client";

import { SplitView } from "@/components/layout/SplitView";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useExecutionStore } from "@/store/useExecutionStore";
import { ExecutionControls } from "@/components/controls/ExecutionControls";
import { VariablesPanel } from "@/components/visualizer/VariablesPanel";
import { CallStackPanel } from "@/components/visualizer/CallStackPanel";
import { ConsolePanel } from "@/components/visualizer/ConsolePanel";
import { MemoryVisualizer } from "@/components/visualizer/MemoryVisualizer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, RotateCcw, Box, Terminal, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_CODE = `// Welcome to Code Visualizer
// Write some JavaScript and see it run!

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const result = factorial(3);
console.log("Factorial of 3 is:", result);

let count = 0;
for (let i = 0; i < 3; i++) {
  count += i;
}
`;

export default function Home() {
  const { 
    code, 
    setCode, 
    runTrace, 
    snapshots, 
    currentStep, 
    reset,
    isRunning 
  } = useExecutionStore();

  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;
  const activeLine = activeSnapshot?.line || 0;

  return (
    <main className="flex h-screen flex-col bg-[#0a0a0c] text-white overflow-hidden relative">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] animate-glow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[150px] animate-glow pointer-events-none" />

      {/* Futuristic Header */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-8 py-4 glass backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative z-10 shadow-lg shadow-primary/20">
              <Cpu className="h-6 w-6 text-black" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter uppercase">NeuralTrace</h1>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Kernel v1.0.4 Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 font-mono text-[10px] text-white/40">
            <Activity className="h-3 w-3" />
            MEM_USAGE: 42.4MB
          </div>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/80 text-black font-black uppercase tracking-tighter px-6 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
            onClick={runTrace}
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Initialize Trace
          </Button>
        </div>
      </header>

      {/* Cinematic Main Content */}
      <div className="flex-1 overflow-hidden relative z-10">
        <SplitView
          left={
            <div className="h-full p-4">
              <div className="h-full rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <CodeEditor 
                  code={code} 
                  onChange={(v) => setCode(v || "")} 
                  activeLine={activeLine} 
                />
              </div>
            </div>
          }
          right={
            <div className="h-full p-4">
              <div className="h-full rounded-[2rem] overflow-hidden border border-white/5 glass relative">
                <Tabs defaultValue="visual" className="flex h-full flex-col">
                  <div className="border-b border-white/5 px-6 py-2 bg-white/5">
                    <TabsList className="bg-transparent h-10 gap-8">
                      <TabsTrigger value="visual" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-2 h-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Visual Matrix
                      </TabsTrigger>
                      <TabsTrigger value="variables" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-2 h-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        States Table
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="visual" className="flex-1 p-0 m-0 overflow-hidden">
                    <MemoryVisualizer />
                  </TabsContent>

                  <TabsContent value="variables" className="flex-1 p-0 m-0 overflow-hidden bg-[#0c0c0e]">
                    <VariablesPanel />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          }
          bottom={
            <div className="h-full p-4 pt-0">
              <div className="h-full rounded-[2rem] overflow-hidden border border-white/5 glass shadow-2xl">
                <ConsolePanel />
              </div>
            </div>
          }
        />
      </div>

      {/* Cyber Deck Controls */}
      <footer className="p-8 pt-0 relative z-20">
        <ExecutionControls />
      </footer>
    </main>
  );
}
