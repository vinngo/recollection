export type Memory = {
  id: string;
  name: string;
  date: string;
  location: string;
  cover_image?: {
    id: string;
    object_key: string;
    caption: string;
  };
};

export type Photo = {
  id: string;
  memory_id: string;
  object_key: string;
  caption: string;
};

// Gallery display type (used by frontend components)
export type GalleryMemory = {
  id: string;
  imageUrl: string;
  title: string;
  capturedAt: string;
  location?: string;
};
