import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exampleTable } from "./schema";
import { users, gardenItems, inventory, tasks, friends, shopItems } from "./schema";

// Only load .env.local in development
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

const schema = {
  exampleTable,
  users,
  gardenItems,
  inventory,
  tasks,
  friends,
  shopItems
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure postgres client for Vercel serverless environment
const client = postgres(process.env.DATABASE_URL, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20, // Close idle connections quickly
  connect_timeout: 10, // Fast connection timeout
  ssl: 'require' // Enable SSL for Supabase
});

export const db = drizzle(client, { schema });
