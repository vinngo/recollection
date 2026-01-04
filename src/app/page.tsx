import { GalleryView } from "@/components/gallery/GalleryView";
import { getMemories } from "@/lib/neon/memoryService";

export default async function Home() {
  const memories = await getMemories();

  return (
    <div className="min-h-screen bg-background">
      <GalleryView memories={memories} />
    </div>
  );
}
