"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  StepBack,
  StepForward
} from "lucide-react";
import { useEffect, useState } from "react";

export function ExecutionControls() {
  const { 
    snapshots, 
    currentStep, 
    nextStep, 
    prevStep, 
    jumpToStep, 
    reset,
    isRunning 
  } = useExecutionStore();

  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval: any;
    if (autoPlay && currentStep < snapshots.length - 1) {
      interval = setInterval(() => {
        nextStep();
      }, 500);
    } else {
      setAutoPlay(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentStep, snapshots.length, nextStep]);

  if (!isRunning) return null;

  return (
    <div className="flex items-center justify-between w-full gap-8">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => jumpToStep(0)}
          disabled={currentStep === 0}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevStep}
          disabled={currentStep <= 0}
        >
          <StepBack className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextStep}
          disabled={currentStep >= snapshots.length - 1}
        >
          <StepForward className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => jumpToStep(snapshots.length - 1)}
          disabled={currentStep === snapshots.length - 1}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 px-4 flex items-center gap-4">
        <Slider
          value={[currentStep]}
          max={snapshots.length - 1}
          step={1}
          onValueChange={([val]) => jumpToStep(val)}
          className="cursor-pointer"
        />
        <span className="text-sm font-mono min-w-[80px] text-right">
          Step {currentStep + 1} / {snapshots.length}
        </span>
      </div>

      <Button variant="ghost" size="sm" onClick={reset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
