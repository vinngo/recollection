import { Photo } from "@/lib/types/neon";
import Image from "next/image";
import { HoverCaption } from "./HoverCaption";
import * as React from "react";

interface LightboxImageProps {
  photo: Photo;
}

// Track mouse position at module level to avoid ref access during render
let lastMousePosition = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    lastMousePosition = { x: e.clientX, y: e.clientY };
  });
}

export function LightboxImage({ photo }: LightboxImageProps) {
  const [hoverState, setHoverState] = React.useState<{
    hovered: boolean;
    initialX: number;
    initialY: number;
  }>({ hovered: false, initialX: 0, initialY: 0 });

  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

  const handleMouseEnter = () => {
    setHoverState({
      hovered: true,
      initialX: lastMousePosition.x,
      initialY: lastMousePosition.y,
    });
  };

  const handleMouseLeave = () => {
    setHoverState((prev) => ({ ...prev, hovered: false }));
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Image
        src={`${cdnUrl}${photo.object_key}`}
        alt={photo.caption}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
      />
      {hoverState.hovered && (
        <HoverCaption
          caption={photo.caption}
          initialX={hoverState.initialX}
          initialY={hoverState.initialY}
        />
      )}
    </div>
  );
}
