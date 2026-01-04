import { neon } from "@neondatabase/serverless";

export const client = neon(process.env.DATABASE_URL!);
