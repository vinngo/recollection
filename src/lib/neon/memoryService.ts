import { client } from "./client";

export async function getMemories() {
  const memories = await client.query("SELECT * FROM memories");
  return memories;
}
