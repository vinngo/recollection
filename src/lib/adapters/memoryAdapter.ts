import type { Memory, GalleryMemory } from "@/lib/types/neon";

export function toGalleryMemory(dbMemory: Memory): GalleryMemory {
  return {
    id: dbMemory.id,
    imageUrl: dbMemory.cover_image?.object_key || "",
    title: dbMemory.name,
    capturedAt: dbMemory.date,
    location: dbMemory.location,
  };
}

export function toGalleryMemories(dbMemories: Memory[]): GalleryMemory[] {
  return dbMemories.map(toGalleryMemory);
}
