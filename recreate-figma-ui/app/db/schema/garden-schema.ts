import { integer, pgTable, text, timestamp, uuid, boolean, jsonb } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // In production, this should be hashed
  money: integer("money").default(1250).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

// Garden items table - stores items placed in the garden
export const gardenItems = pgTable("garden_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  icon: text("icon"), // Store the image path/URL
  color: text("color").notNull(),
  x: integer("x").notNull(), // X position in the garden
  y: integer("y").notNull(), // Y position in the garden
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

// Inventory table - stores items the user owns
export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  quantity: integer("quantity").default(0).notNull(),
  emoji: text("emoji"),
  icon: text("icon"), // Store the image path/URL
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

// Tasks table - stores user's tasks and progress
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  progress: integer("progress").default(0).notNull(),
  target: integer("target").notNull(),
  emoji: text("emoji"),
  icon: text("icon"), // Store the image path/URL
  color: text("color").notNull(),
  reward: integer("reward").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

// Friends table - stores user's friends
export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  friendName: text("friend_name").notNull(),
  emoji: text("emoji").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Shop items table - stores available shop items
export const shopItems = pgTable("shop_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  price: integer("price").notNull(),
  emoji: text("emoji"),
  icon: text("icon"), // Store the image path/URL
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Export types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertGardenItem = typeof gardenItems.$inferInsert;
export type SelectGardenItem = typeof gardenItems.$inferSelect;

export type InsertInventory = typeof inventory.$inferInsert;
export type SelectInventory = typeof inventory.$inferSelect;

export type InsertTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;

export type InsertFriend = typeof friends.$inferInsert;
export type SelectFriend = typeof friends.$inferSelect;

export type InsertShopItem = typeof shopItems.$inferInsert;
export type SelectShopItem = typeof shopItems.$inferSelect;
