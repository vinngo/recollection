export type Memory = {
  id: string;
  name: string;
};

export type Photo = {
  id: string;
  memory_id: string;
  object_key: string;
  caption: string;
};
