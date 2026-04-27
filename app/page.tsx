"use client";

import { SplitView } from "@/components/layout/SplitView";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Box, Layers, Play, SkipBack, SkipForward, RotateCcw } from "lucide-react";
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
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeLine, setActiveLine] = useState(0);

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
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
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
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Variables will appear here during execution.</p>
                      {/* Placeholder for variable tree */}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="stack" className="flex-1 p-0 m-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Call stack will appear here during execution.</p>
                      {/* Placeholder for call stack */}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          }
          bottom={
            <div className="flex h-full w-full flex-col bg-card">
              <div className="flex items-center gap-2 border-b px-4 py-2 text-sm font-medium">
                <Terminal className="h-4 w-4" />
                Console
              </div>
              <ScrollArea className="flex-1 p-4 font-mono text-sm">
                <div className="text-muted-foreground italic">No output yet. Run the code to see results.</div>
              </ScrollArea>
            </div>
          }
        />
      </div>

      {/* Footer / Controls */}
      <footer className="border-t bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm font-medium">
              Step 0 / 0
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl px-8">
            {/* Timeline Slider Placeholder */}
            <div className="h-2 w-full bg-muted rounded-full relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 h-4 w-4 bg-primary rounded-full border-2 border-background shadow-sm" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            JavaScript (ES5 Sandbox)
          </div>
        </div>
      </footer>
    </main>
  );
}
