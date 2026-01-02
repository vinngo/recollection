"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  id: string;
  imageUrl: string;
  title: string;
  capturedAt: string;
  onClick: () => void;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHoverChange: (isHovered: boolean) => void;
}

export function MemoryCard({
  imageUrl,
  title,
  capturedAt,
  onClick,
  isHovered,
  isAnyHovered,
  onHoverChange,
}: MemoryCardProps) {
  return (
    <motion.div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative bg-card border border-border rounded-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300",
        isAnyHovered && !isHovered && "blur-sm opacity-60",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-serif text-lg text-white">{title}</h3>
            <p className="font-mono text-xs text-white/80">{capturedAt}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
