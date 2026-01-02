"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { calculateDepthEffects } from "@/lib/utils";
import type { Memory } from "./hooks/useMemoryLayout";
import { Emphasis } from "../ui/fabula/emphasis";

interface DepthMemoryCardProps {
  memory: Memory;
  position: { x: number; y: number; z: number };
  focalDepth: number;
  focalRange?: number;
  onClick: () => void;
  index: number;
}

function generateFloatingAnimation(index: number) {
  // Use index as seed for consistent but unique animations
  const seed = index * 137.508;
  const duration = 8 + (seed % 4);
  const xOffset = Math.sin(seed) * 40;
  const yOffset = Math.cos(seed * 1.3) * 30;

  return {
    duration,
    xOffset,
    yOffset,
  };
}

export function DepthMemoryCard({
  memory,
  position,
  focalDepth,
  focalRange = 400,
  onClick,
  index,
}: DepthMemoryCardProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [floatAnimation, setFloatAnimation] = useState({
    duration: 10,
    xOffset: 0,
    yOffset: 0,
  });

  useEffect(() => {
    setFloatAnimation(generateFloatingAnimation(index));
  }, [index]);

  const effects = useMemo(
    () => calculateDepthEffects(position.z, focalDepth, focalRange),
    [position.z, focalDepth, focalRange],
  );

  const isInFocus = effects.blur < 2;

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
      animate={{
        opacity: effects.opacity,
        scale: effects.scale,
        x: [0, floatAnimation.xOffset, 0],
        y: [0, floatAnimation.yOffset, 0],
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        x: {
          duration: floatAnimation.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.05,
        },
        y: {
          duration: floatAnimation.duration * 1.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.05,
        },
      }}
      onClick={onClick}
      className="absolute cursor-pointer group"
      style={{
        left: position.x,
        top: position.y,
        transformStyle: "preserve-3d",
        filter: `blur(${effects.blur}px)`,
        willChange: "transform, filter, opacity",
      }}
    >
      <motion.div
        whileHover={isInFocus ? { scale: 1.05 } : undefined}
        transition={{ duration: 0.2 }}
        className="relative w-64 h-64 md:w-72 md:h-72 bg-card border border-border rounded-sm overflow-hidden shadow-lg"
        style={{
          boxShadow: `0 ${10 * effects.shadowOpacity}px ${30 * effects.shadowOpacity}px rgba(0,0,0,${0.15 * effects.shadowOpacity})`,
        }}
      >
        <Image
          src={memory.imageUrl}
          alt={memory.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="300px"
          priority={index < 3}
        />

        {/* Metadata overlay - only visible when in focus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInFocus ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="relative inline-block mb-1">
              <h3 className="font-serif text-lg text-white">{memory.title}</h3>
              {hover && <Emphasis className="bg-white" />}
            </div>
            <p className="font-mono text-xs text-white/80">
              {memory.capturedAt}
            </p>
            {memory.location && (
              <p className="font-mono text-xs text-white/60">
                {memory.location}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
