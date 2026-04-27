"use client";

import { SplitView } from "@/components/layout/SplitView";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useExecutionStore } from "@/store/useExecutionStore";
import { ExecutionControls } from "@/components/controls/ExecutionControls";
import { VariablesPanel } from "@/components/visualizer/VariablesPanel";
import { CallStackPanel } from "@/components/visualizer/CallStackPanel";
import { ConsolePanel } from "@/components/visualizer/ConsolePanel";
import { StepExplainer } from "@/components/ai/StepExplainer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Box, Layers, Play, RotateCcw } from "lucide-react";
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
    <main className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-3 bg-card">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CodeVisualizer</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={runTrace}
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Run Tracing
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          left={
            <CodeEditor 
              code={code} 
              onChange={(v) => setCode(v || "")} 
              activeLine={activeLine} 
            />
          }
          right={
            <div className="flex h-full w-full flex-col bg-muted/30">
              <Tabs defaultValue="variables" className="flex h-full flex-col">
                <div className="border-b px-4 py-1 bg-card/50">
                  <TabsList className="bg-transparent h-9 gap-4">
                    <TabsTrigger value="variables" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 h-9">
                      <Box className="mr-2 h-4 w-4" />
                      Variables
                    </TabsTrigger>
                    <TabsTrigger value="stack" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 h-9">
                      <Layers className="mr-2 h-4 w-4" />
                      Call Stack
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="variables" className="flex-1 p-0 m-0 overflow-hidden">
                  <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-hidden">
                      <VariablesPanel />
                    </div>
                    <div className="p-4 border-t bg-card/30">
                      <StepExplainer />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stack" className="flex-1 p-0 m-0 overflow-hidden">
                  <CallStackPanel />
                </TabsContent>
              </Tabs>
            </div>
          }
          bottom={
            <ConsolePanel />
          }
        />
      </div>

      {/* Footer / Controls */}
      <footer className="border-t bg-card px-6 py-4">
        <ExecutionControls />
      </footer>
    </main>
  );
}
