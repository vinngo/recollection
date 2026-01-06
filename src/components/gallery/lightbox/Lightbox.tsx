"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPhotosByMemory } from "@/app/actions/photos";
import type { Photo } from "@/lib/types/neon";
import { LightboxImage } from "./LightboxImage";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  memoryId: string;
  title: string;
  capturedAt: string;
  location?: string;
}

export function Lightbox({
  isOpen,
  onClose,
  memoryId,
  title,
  capturedAt,
  location,
}: LightboxProps) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Fetch photos when lightbox opens
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    fetchPhotosByMemory(memoryId).then((data) => {
      if (!cancelled) {
        setPhotos(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, memoryId]);

  // Reset photos when closed
  const displayPhotos = isOpen ? photos : null;
  const loading = isOpen && displayPhotos === null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-sm overflow-hidden shadow-2xl p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="font-serif text-3xl md:text-4xl text-card-foreground mb-2">
                  {title}
                </h2>
                <div className="space-y-1 font-mono text-sm text-muted-foreground">
                  <p>{String(capturedAt)}</p>
                  {location && <p>{location}</p>}
                </div>
              </div>

              {/* Photo Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="font-mono text-sm text-muted-foreground">
                    Loading photos...
                  </p>
                </div>
              ) : displayPhotos && displayPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {displayPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-sm overflow-hidden"
                    >
                      <LightboxImage photo={photo} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="font-mono text-sm text-muted-foreground">
                    No photos found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
