"use client";

import { useState, useCallback, useRef } from "react";
import { clamp, lerp } from "@/lib/utils";

interface UseDepthNavigationOptions {
  minDepth: number;
  maxDepth: number;
  sensitivity?: number;
}

interface UseDepthNavigationReturn {
  focalDepth: number;
  setFocalDepth: (depth: number) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
}

export function useDepthNavigation({
  minDepth,
  maxDepth,
  sensitivity = 0.5,
}: UseDepthNavigationOptions): UseDepthNavigationReturn {
  const [focalDepth, setFocalDepth] = useState(maxDepth); // Start at foreground (newest)
  const targetDepth = useRef(maxDepth);
  const touchStart = useRef<{ y: number; depth: number } | null>(null);
  const animationFrame = useRef<number | null>(null);

  const animateToTarget = useCallback(() => {
    setFocalDepth((current) => {
      const newDepth = lerp(current, targetDepth.current, 0.15);

      // Stop animating when close enough
      if (Math.abs(newDepth - targetDepth.current) < 0.5) {
        animationFrame.current = null;
        return targetDepth.current;
      }

      animationFrame.current = requestAnimationFrame(animateToTarget);
      return newDepth;
    });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      // deltaY > 0 = scroll down = go deeper (into past, lower Z)
      targetDepth.current = clamp(
        targetDepth.current - e.deltaY * sensitivity,
        minDepth,
        maxDepth
      );

      if (!animationFrame.current) {
        animationFrame.current = requestAnimationFrame(animateToTarget);
      }
    },
    [minDepth, maxDepth, sensitivity, animateToTarget]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      y: e.touches[0].clientY,
      depth: focalDepth,
    };
  }, [focalDepth]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const deltaY = e.touches[0].clientY - touchStart.current.y;
      targetDepth.current = clamp(
        touchStart.current.depth + deltaY * sensitivity * 2,
        minDepth,
        maxDepth
      );

      if (!animationFrame.current) {
        animationFrame.current = requestAnimationFrame(animateToTarget);
      }
    },
    [minDepth, maxDepth, sensitivity, animateToTarget]
  );

  return {
    focalDepth,
    setFocalDepth: (depth: number) => {
      targetDepth.current = clamp(depth, minDepth, maxDepth);
      if (!animationFrame.current) {
        animationFrame.current = requestAnimationFrame(animateToTarget);
      }
    },
    handleWheel,
    handleTouchStart,
    handleTouchMove,
  };
}
