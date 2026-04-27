"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function StepExplainer() {
  const { code, snapshots, currentStep, isRunning } = useExecutionStore();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeSnapshot = currentStep >= 0 ? snapshots[currentStep] : null;

  const handleExplain = async () => {
    if (!activeSnapshot) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          line: activeSnapshot.line,
          scope: activeSnapshot.scope,
          stack: activeSnapshot.stack,
        }),
      });
      
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation("Sorry, I couldn't generate an explanation right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!isRunning || !activeSnapshot) return null;

  return (
    <Card className="mt-4 border-primary/20 bg-primary/5">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            AI Step Explainer
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExplain} 
            disabled={loading}
            className="h-8 text-xs"
          >
            {loading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-3 w-3" />
            )}
            Explain this step
          </Button>
        </div>

        {explanation && (
          <ScrollArea className="max-h-[300px] rounded-md border bg-card p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
