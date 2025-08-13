import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exampleTable } from "./schema";
import { users, gardenItems, inventory, tasks, friends, shopItems } from "./schema";

// Only load .env.local in development
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

// Debug logging
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);

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

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });
