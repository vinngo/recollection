"use client";

import { useMemo } from "react";
import type { Memory } from "@/lib/types/neon";

export interface MemoryPosition {
  memory: Memory;
  x: number;
  y: number;
  z: number;
}

interface UseMemoryLayoutOptions {
  memories: Memory[];
  viewportWidth: number;
  viewportHeight: number;
  depthRange: { min: number; max: number };
}

function parseDate(dateStr: string): Date {
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const parts = String(dateStr).toLowerCase().split(" ");
  const month = months[parts[0]] ?? 0;
  const year = parseInt(parts[1]) || 2024;

  return new Date(year, month, 1);
}

// Simple seeded random generator for consistent but pseudo-random positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function useMemoryLayout({
  memories,
  viewportWidth,
  viewportHeight,
  depthRange,
}: UseMemoryLayoutOptions): MemoryPosition[] {
  return useMemo(() => {
    if (memories.length === 0) return [];

    // Parse dates and find range
    const memoriesWithDates = memories.map((m) => ({
      memory: m,
      date: parseDate(m.date),
    }));

    const dates = memoriesWithDates.map((m) => m.date.getTime());
    const oldestTime = Math.min(...dates);
    const newestTime = Math.max(...dates);
    const timeRange = newestTime - oldestTime || 1;

    const padding = 150;
    const cardWidth = 280;
    const cardHeight = 280;

    const availableWidth = Math.max(
      viewportWidth - cardWidth - padding * 2,
      100,
    );
    const availableHeight = Math.max(
      viewportHeight - cardHeight - padding * 2,
      100,
    );

    // Use a combination of viewport dimensions and memory count as seed
    // This gives different layouts when viewport changes or memories change
    const baseSeed =
      viewportWidth * 0.1 + viewportHeight * 0.01 + memories.length;

    const positions: MemoryPosition[] = memoriesWithDates.map(
      ({ memory, date }, index) => {
        // Z position: newest = max (foreground), oldest = min (background)
        const normalizedAge = (newestTime - date.getTime()) / timeRange;
        const z =
          depthRange.max - normalizedAge * (depthRange.max - depthRange.min);

        // Use seeded random for positions (deterministic but varies with viewport)
        const seedX = baseSeed + index * 1.5;
        const seedY = baseSeed + index * 2.7;

        const x = padding + seededRandom(seedX) * availableWidth;
        const y = padding + seededRandom(seedY) * availableHeight;

        return {
          memory,
          x,
          y,
          z,
        };
      },
    );

    // Sort by Z so furthest renders first (painter's algorithm)
    return positions.sort((a, b) => a.z - b.z);
  }, [memories, viewportWidth, viewportHeight, depthRange]);
}
