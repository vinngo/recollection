"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { clamp, lerp } from "@/lib/utils";

interface UseDepthNavigationOptions {
  minDepth: number;
  maxDepth: number;
  sensitivity?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface UseDepthNavigationReturn {
  focalDepth: number;
  setFocalDepth: (depth: number) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
}

export function useDepthNavigation({
  minDepth,
  maxDepth,
  sensitivity = 0.5,
  containerRef,
}: UseDepthNavigationOptions): UseDepthNavigationReturn {
  const [focalDepth, setFocalDepth] = useState(maxDepth);
  const targetDepth = useRef(maxDepth);
  const touchStart = useRef<{ y: number; depth: number } | null>(null);
  const animationFrame = useRef<number | null>(null);

  // Use ref to store animation function to avoid circular dependency
  const animateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    animateRef.current = () => {
      setFocalDepth((current) => {
        const newDepth = lerp(current, targetDepth.current, 0.15);

        if (Math.abs(newDepth - targetDepth.current) < 0.5) {
          animationFrame.current = null;
          return targetDepth.current;
        }

        animationFrame.current = requestAnimationFrame(() =>
          animateRef.current?.(),
        );
        return newDepth;
      });
    };
  }, []);

  const startAnimation = useCallback(() => {
    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(() =>
        animateRef.current?.(),
      );
    }
  }, []);

  const updateTargetDepth = useCallback(
    (newTarget: number) => {
      targetDepth.current = clamp(newTarget, minDepth, maxDepth);
      startAnimation();
    },
    [minDepth, maxDepth, startAnimation],
  );

  // Attach wheel listener with passive: false
  useEffect(() => {
    const element = containerRef?.current || window;

    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      e.preventDefault();
      updateTargetDepth(targetDepth.current - wheelEvent.deltaY * sensitivity);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [sensitivity, containerRef, updateTargetDepth]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStart.current = {
        y: e.touches[0].clientY,
        depth: focalDepth,
      };
    },
    [focalDepth],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const deltaY = e.touches[0].clientY - touchStart.current.y;
      updateTargetDepth(touchStart.current.depth + deltaY * sensitivity * 2);
    },
    [sensitivity, updateTargetDepth],
  );

  return {
    focalDepth,
    setFocalDepth: (depth: number) => {
      updateTargetDepth(depth);
    },
    handleTouchStart,
    handleTouchMove,
  };
}
