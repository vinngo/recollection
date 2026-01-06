import sql from "./client";
import { Memory, Photo } from "../types/neon";

export async function getMemories(): Promise<Memory[]> {
  const memories = await sql`
    SELECT
      m.id,
      m.name,
      m.date,
      m.location,
      (
        SELECT json_build_object(
          'id', i.id,
          'object_key', i.object_key,
          'caption', i.caption
        )
        FROM images i
        WHERE i.memory_id = m.id
        ORDER BY i.order_index ASC
        LIMIT 1
      ) AS cover_image
    FROM memories m
    ORDER BY m.date DESC
  `;
  return memories.length > 0 ? (memories as Memory[]) : [];
}

export async function getPhotosByMemory(memoryId: string): Promise<Photo[]> {
  const photos = await sql`
    SELECT
      id,
      object_key,
      caption
    FROM images
    WHERE memory_id = ${memoryId}
    ORDER BY order_index ASC
  `;
  return photos.length > 0 ? (photos as Photo[]) : [];
}
