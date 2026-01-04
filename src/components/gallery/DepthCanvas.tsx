"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface DepthCanvasProps {
  children: ReactNode;
  focalDepth: number;
  perspective?: number;
}

export function DepthCanvas({
  children,
  focalDepth,
  perspective = 1000,
}: DepthCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          z: focalDepth,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
