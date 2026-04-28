import { animate, JSAnimation, AnimationParams } from "animejs";
import { useEffect, useRef } from "react";

export function useAnime(targets: any, options: AnimationParams, deps: any[] = []) {
  const animationRef = useRef<JSAnimation | null>(null);

  useEffect(() => {
    animationRef.current = animate(targets, options);
    return () => {
      if (animationRef.current) animationRef.current.pause();
    };
  }, deps);

  return animationRef;
}
