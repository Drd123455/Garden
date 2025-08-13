import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exampleTable } from "./schema";
import { users, gardenItems, inventory, tasks, friends, shopItems } from "./schema";

config({ path: ".env.local" });

const schema = {
  exampleTable,
  users,
  gardenItems,
  inventory,
  tasks,
  friends,
  shopItems
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
