"use server";

import { getPhotosByMemory } from "@/lib/neon/memoryService";

export async function fetchPhotosByMemory(memoryId: string) {
  return getPhotosByMemory(memoryId);
}
