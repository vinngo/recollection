"use client";

import { useState, useEffect } from "react";
import { DepthCanvas } from "@/components/gallery/DepthCanvas";
import { DepthMemoryCard } from "@/components/gallery/DepthMemoryCard";
import { useMemoryLayout } from "@/components/gallery/hooks/useMemoryLayout";
import { useDepthNavigation } from "@/components/gallery/hooks/useDepthNavigation";
import { Lightbox } from "@/components/gallery/Lightbox";

const DEPTH_RANGE = { min: -800, max: 0 };

const mockMemories = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop",
    title: "Tokyo Streets",
    capturedAt: "October 2024",
    location: "Shibuya, Tokyo",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop",
    title: "Sunset Waves",
    capturedAt: "September 2024",
    location: "Santa Cruz, CA",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    title: "Mountain View",
    capturedAt: "August 2024",
    location: "Yosemite National Park",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop",
    title: "Lake Reflection",
    capturedAt: "July 2024",
    location: "Lake Tahoe",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
    title: "Starry Night",
    capturedAt: "June 2024",
    location: "Big Sur, CA",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
    title: "Forest Path",
    capturedAt: "May 2024",
    location: "Muir Woods",
  },
];

export default function Home() {
  const [selectedMemory, setSelectedMemory] = useState<
    (typeof mockMemories)[0] | null
  >(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  const { focalDepth, setFocalDepth, handleWheel } = useDepthNavigation({
    minDepth: DEPTH_RANGE.min,
    maxDepth: DEPTH_RANGE.max,
  });

  const memoryPositions = useMemoryLayout({
    memories: mockMemories,
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

  const handleMemoryClick = (memory: (typeof mockMemories)[0], z: number) => {
    // Animate to the memory's depth, then open lightbox
    setFocalDepth(z);
    setTimeout(() => {
      setSelectedMemory(memory);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title overlay */}
      <header className="fixed top-0 left-0 right-0 z-10 p-8 pointer-events-none">
        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground">
          recollection
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          scroll to explore
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

      <DepthCanvas focalDepth={focalDepth} onWheel={handleWheel}>
        {memoryPositions.map((pos, index) => (
          <DepthMemoryCard
            key={pos.memory.id}
            memory={pos.memory}
            position={{ x: pos.x, y: pos.y, z: pos.z }}
            focalDepth={focalDepth}
            onClick={() => handleMemoryClick(pos.memory, pos.z)}
            index={index}
          />
        ))}
      </DepthCanvas>

      {selectedMemory && (
        <Lightbox
          isOpen={!!selectedMemory}
          onClose={() => setSelectedMemory(null)}
          imageUrl={selectedMemory.imageUrl}
          title={selectedMemory.title}
          capturedAt={selectedMemory.capturedAt}
          location={selectedMemory.location}
        />
      )}
    </div>
  );
}
