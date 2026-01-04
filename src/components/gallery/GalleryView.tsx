"use client";

import { useState, useEffect } from "react";
import { DepthCanvas } from "@/components/gallery/DepthCanvas";
import { DepthMemoryCard } from "@/components/gallery/DepthMemoryCard";
import { useMemoryLayout } from "@/components/gallery/hooks/useMemoryLayout";
import { useDepthNavigation } from "@/components/gallery/hooks/useDepthNavigation";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { Memory } from "@/lib/types/neon";

const DEPTH_RANGE = { min: -800, max: 0 };

interface GalleryViewProps {
  memories: Memory[];
}

export function GalleryView({ memories }: GalleryViewProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  const { focalDepth, setFocalDepth } = useDepthNavigation({
    minDepth: DEPTH_RANGE.min,
    maxDepth: DEPTH_RANGE.max,
  });

  const memoryPositions = useMemoryLayout({
    memories: memories,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    depthRange: DEPTH_RANGE,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handleMemoryClick = (memory: Memory, z: number) => {
    setFocalDepth(z);
    setTimeout(() => {
      setSelectedMemory(memory);
    }, 300);
  };

  return (
    <>
      {/* Title overlay */}
      <header className="fixed top-0 left-0 right-0 z-10 p-8 pointer-events-none">
        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground">
          recollection
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          scroll to explore the z-axis
        </p>
      </header>

      {/* Depth indicator */}
      <div className="fixed bottom-8 left-8 z-10 pointer-events-none">
        <p className="font-mono text-xs text-muted-foreground">
          {focalDepth > -200
            ? "recent"
            : focalDepth > -500
              ? "a while ago"
              : "distant past"}
        </p>
      </div>

      <DepthCanvas focalDepth={focalDepth}>
        {memoryPositions.map((pos, index) => (
          <DepthMemoryCard
            key={pos.memory.id}
            memory={pos.memory}
            position={{ x: pos.x, y: pos.y, z: pos.z }}
            focalDepth={focalDepth}
            onClick={() => handleMemoryClick(pos.memory, pos.z)}
            index={index}
            viewportWidth={viewport.width}
            viewportHeight={viewport.height}
          />
        ))}
      </DepthCanvas>

      {selectedMemory && (
        <Lightbox
          isOpen={!!selectedMemory}
          onClose={() => setSelectedMemory(null)}
          imageUrl={selectedMemory.cover_image?.object_key}
          title={selectedMemory.name}
          capturedAt={selectedMemory.date}
          location={selectedMemory.location}
        />
      )}
    </>
  );
}
