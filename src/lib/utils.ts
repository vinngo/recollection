import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export interface DepthEffects {
  blur: number;
  opacity: number;
  scale: number;
  shadowOpacity: number;
}

export function calculateDepthEffects(
  cardZ: number,
  focalDepth: number,
  focalRange: number = 400,
): DepthEffects {
  const distance = Math.abs(cardZ - focalDepth);
  const normalized = Math.min(distance / focalRange, 1);

  return {
    blur: normalized * 8,
    opacity: 1 - normalized * 0.6,
    scale: 1 - normalized * 0.3,
    shadowOpacity: 1 - normalized,
  };
}
