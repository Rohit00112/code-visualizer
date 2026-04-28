"use client";

import { useExecutionStore } from "@/store/useExecutionStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FastForward,
  Activity,
  Zap
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";

export function ExecutionControls() {
  const {
    snapshots,
    currentStep,
    nextStep,
    prevStep,
    jumpToStep,
    reset,
    isRunning,
    playbackSpeed,
    setPlaybackSpeed
  } = useExecutionStore();

  const [autoPlay, setAutoPlay] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (autoPlay && currentStep < snapshots.length - 1) {
      interval = setInterval(() => {
        nextStep();
      }, playbackSpeed);
    } else {
      if (currentStep >= snapshots.length - 1) {
        setAutoPlay(false);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentStep, snapshots.length, nextStep, playbackSpeed]);

  // AnimeJS animation for progress bar
  useEffect(() => {
    if (progressRef.current) {
      animate(".progress-node", {
        scale: (el: any, i: number) => i === currentStep ? [1, 2, 1.5] : 1,
        opacity: (el: any, i: number) => i <= currentStep ? 1 : 0.2,
        duration: 400,
        ease: "outElastic(1, .8)"
      });
    }
  }, [currentStep]);

  if (!isRunning) return null;

  return (
    <div className="flex flex-col gap-6 w-full glass p-6 rounded-3xl border-primary/20 shadow-[0_-20px_50px_-20px_rgba(0,242,255,0.15)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="flex items-center justify-between gap-8 relative z-10">
        {/* Playback Cyber Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
            onClick={prevStep}
            disabled={currentStep <= 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="relative group">
            <div className={`absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-opacity duration-500 ${autoPlay ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
            <Button
              variant="default"
              size="icon"
              className={`h-14 w-14 rounded-2xl shadow-2xl transition-all duration-500 relative z-10 ${autoPlay ? "bg-secondary hover:bg-secondary/80 scale-110" : "bg-primary hover:bg-primary/80"
                }`}
              onClick={() => setAutoPlay(!autoPlay)}
            >
              {autoPlay ? (
                <Pause className="h-6 w-6 text-white fill-current" />
              ) : (
                <Play className="h-6 w-6 text-black fill-current ml-1" />
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
            onClick={nextStep}
            disabled={currentStep >= snapshots.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Neural Timeline */}
        <div className="flex-1 px-8 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">Neural Timeline</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xl font-black text-white">{String(currentStep + 1).padStart(2, '0')}</span>
              <span className="text-xs font-bold text-primary/40 pt-1">/ {String(snapshots.length).padStart(2, '0')}</span>
            </div>
          </div>
          <Slider
            value={[currentStep]}
            max={snapshots.length - 1}
            step={1}
            onValueChange={(val) => {
              const step = Array.isArray(val) ? val[0] : val;
              jumpToStep(step);
            }}
            className="cursor-pointer"
          />
        </div>

        {/* System Settings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 glass-primary px-4 py-2 rounded-2xl border-primary/20">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Sync Speed</span>
              <select
                className="bg-transparent text-xs font-black text-primary outline-none cursor-pointer appearance-none"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              >
                <option value={1000}>1.0X</option>
                <option value={500}>2.0X</option>
                <option value={200}>5.0X</option>
                <option value={100}>10.0X</option>
              </select>
            </div>
            <Activity className="h-4 w-4 text-primary opacity-50" />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-2xl border-white/10 hover:bg-white/5 active:scale-90 transition-all"
            onClick={reset}
          >
            <RotateCcw className="h-5 w-5 text-white/50" />
          </Button>
        </div>
      </div>

      {/* Visual Execution Pulse Map */}
      <div ref={progressRef} className="h-2 w-full flex gap-1 rounded-full overflow-hidden px-1">
        {snapshots.map((_, i) => (
          <div
            key={i}
            className={`progress-node flex-1 h-full rounded-full transition-colors duration-500 ${i <= currentStep ? "bg-primary shadow-[0_0_10px_#00f2ff]" : "bg-white/5"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
