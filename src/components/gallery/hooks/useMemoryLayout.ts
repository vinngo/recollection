"use client";

import { useMemo, useState } from "react";

export interface Memory {
  id: string;
  imageUrl: string;
  title: string;
  capturedAt: string;
  location?: string;
}

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

  const parts = dateStr.toLowerCase().split(" ");
  const month = months[parts[0]] ?? 0;
  const year = parseInt(parts[1]) || 2024;

  return new Date(year, month, 1);
}

export function useMemoryLayout({
  memories,
  viewportWidth,
  viewportHeight,
  depthRange,
}: UseMemoryLayoutOptions): MemoryPosition[] {
  // Generate random seed once on mount (stable across re-renders, random on page refresh)
  const [randomSeed] = useState(() => Math.random());

  return useMemo(() => {
    if (memories.length === 0) return [];

    // Use randomSeed to trigger recalculation
    const _ = randomSeed;

    // Parse dates and find range
    const memoriesWithDates = memories.map((m) => ({
      memory: m,
      date: parseDate(m.capturedAt),
    }));

    const dates = memoriesWithDates.map((m) => m.date.getTime());
    const oldestTime = Math.min(...dates);
    const newestTime = Math.max(...dates);
    const timeRange = newestTime - oldestTime || 1;

    // Calculate positions
    const padding = 150;
    const cardWidth = 280;
    const cardHeight = 280;

    const positions: MemoryPosition[] = memoriesWithDates.map(
      ({ memory, date }) => {
        // Z position: newest = max (foreground), oldest = min (background)
        const normalizedAge = (newestTime - date.getTime()) / timeRange;
        const z =
          depthRange.max - normalizedAge * (depthRange.max - depthRange.min);

        // Random X and Y within viewport bounds
        const availableWidth = Math.max(
          viewportWidth - cardWidth - padding * 2,
          100,
        );
        const availableHeight = Math.max(
          viewportHeight - cardHeight - padding * 2,
          100,
        );

        const x = padding + Math.random() * availableWidth;
        const y = padding + Math.random() * availableHeight;

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
  }, [memories, viewportWidth, viewportHeight, depthRange, randomSeed]);
}
