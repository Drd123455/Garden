"use server";

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { 
  users, 
  gardenItems, 
  inventory, 
  tasks, 
  friends, 
  shopItems,
  InsertUser,
  InsertGardenItem,
  InsertInventory,
  InsertTask,
  InsertFriend,
  InsertShopItem,
  SelectUser
} from "../schema";

// User operations
export const createUser = async (data: InsertUser) => {
  try {
    console.log('Attempting to create user:', { username: data.username, hasPassword: !!data.password });
    const [newUser] = await db.insert(users).values(data).returning();
    console.log('User created successfully:', newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    console.error("Database connection status:", { hasDb: !!db, errorType: error instanceof Error ? error.constructor.name : 'Unknown' });
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create user: ${errorMessage}`);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    console.log('Attempting to get user by username:', username);
    const user = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    return user;
  } catch (error) {
    console.error("Error getting user by username:", error);
    console.error("Database connection status:", { hasDb: !!db, errorType: error instanceof Error ? error.constructor.name : 'Unknown' });
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get user: ${errorMessage}`);
  }
};

export const updateUserMoney = async (userId: string, amount: number) => {
  try {
    const [updatedUser] = await db.update(users)
      .set({ money: amount })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user money:", error);
    throw new Error("Failed to update user money");
  }
};

// Garden items operations
export const createGardenItem = async (data: InsertGardenItem) => {
  try {
    const [newItem] = await db.insert(gardenItems).values(data).returning();
    return newItem;
  } catch (error) {
    console.error("Error creating garden item:", error);
    throw new Error("Failed to create garden item");
  }
};

export const getGardenItemsByUserId = async (userId: string) => {
  try {
    const items = await db.query.gardenItems.findMany({
      where: eq(gardenItems.userId, userId),
      orderBy: [desc(gardenItems.createdAt)]
    });
    return items;
  } catch (error) {
    console.error("Error getting garden items:", error);
    throw new Error("Failed to get garden items");
  }
};

export const updateGardenItemPosition = async (itemId: string, x: number, y: number) => {
  try {
    const [updatedItem] = await db.update(gardenItems)
      .set({ x, y })
      .where(eq(gardenItems.id, itemId))
      .returning();
    return updatedItem;
  } catch (error) {
    console.error("Error updating garden item position:", error);
    throw new Error("Failed to update garden item position");
  }
};

export const deleteGardenItem = async (itemId: string) => {
  try {
    await db.delete(gardenItems).where(eq(gardenItems.id, itemId));
  } catch (error) {
    console.error("Error deleting garden item:", error);
    throw new Error("Failed to delete garden item");
  }
};

// Inventory operations
export const createInventoryItem = async (data: InsertInventory) => {
  try {
    const [newItem] = await db.insert(inventory).values(data).returning();
    return newItem;
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw new Error("Failed to create inventory item");
  }
};

export const getInventoryByUserId = async (userId: string) => {
  try {
    const items = await db.query.inventory.findMany({
      where: eq(inventory.userId, userId),
      orderBy: [desc(inventory.createdAt)]
    });
    return items;
  } catch (error) {
    console.error("Error getting inventory:", error);
    throw new Error("Failed to get inventory");
  }
};

export const updateInventoryQuantity = async (itemId: string, quantity: number) => {
  try {
    const [updatedItem] = await db.update(inventory)
      .set({ quantity })
      .where(eq(inventory.id, itemId))
      .returning();
    return updatedItem;
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
    throw new Error("Failed to update inventory quantity");
  }
};

export const findInventoryItemByName = async (userId: string, itemName: string) => {
  try {
    const item = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.userId, userId),
        eq(inventory.name, itemName)
      )
    });
    return item;
  } catch (error) {
    console.error("Error finding inventory item:", error);
    throw new Error("Failed to find inventory item");
  }
};

// Task operations
export const createTask = async (data: InsertTask) => {
  try {
    const [newTask] = await db.insert(tasks).values(data).returning();
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const getTasksByUserId = async (userId: string) => {
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: [desc(tasks.createdAt)]
    });
    return userTasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw new Error("Failed to get tasks");
  }
};

export const updateTaskProgress = async (taskId: string, progress: number) => {
  try {
    const [updatedTask] = await db.update(tasks)
      .set({ progress })
      .where(eq(tasks.id, taskId))
      .returning();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task progress:", error);
    throw new Error("Failed to update task progress");
  }
};

export const completeTask = async (taskId: string) => {
  try {
    const [completedTask] = await db.update(tasks)
      .set({ completed: true })
      .where(eq(tasks.id, taskId))
      .returning();
    return completedTask;
  } catch (error) {
    console.error("Error completing task:", error);
    throw new Error("Failed to complete task");
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};

export const getTaskCountByUserId = async (userId: string) => {
  try {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(eq(tasks.userId, userId));
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting task count:", error);
    throw new Error("Failed to get task count");
  }
};

export const getCompletedTaskCountByUserId = async (userId: string) => {
  try {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(and(
        eq(tasks.userId, userId),
        eq(tasks.completed, true)
      ));
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting completed task count:", error);
    throw new Error("Failed to get completed task count");
  }
};

// Friend operations
export const createFriend = async (data: InsertFriend) => {
  try {
    const [newFriend] = await db.insert(friends).values(data).returning();
    return newFriend;
  } catch (error) {
    console.error("Error creating friend:", error);
    throw new Error("Failed to create friend");
  }
};

export const getFriendsByUserId = async (userId: string) => {
  try {
    const userFriends = await db.query.friends.findMany({
      where: eq(friends.userId, userId),
      orderBy: [desc(friends.createdAt)]
    });
    return userFriends;
  } catch (error) {
    console.error("Error getting friends:", error);
    throw new Error("Failed to get friends");
  }
};

export const deleteFriend = async (friendId: string) => {
  try {
    await db.delete(friends).where(eq(friends.id, friendId));
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw new Error("Failed to delete friend");
  }
};

// Shop items operations
export const getAllShopItems = async () => {
  try {
    const items = await db.query.shopItems.findMany({
      orderBy: [desc(shopItems.createdAt)]
    });
    return items;
  } catch (error) {
    console.error("Error getting shop items:", error);
    throw new Error("Failed to get shop items");
  }
};

export const createShopItem = async (data: InsertShopItem) => {
  try {
    const [newItem] = await db.insert(shopItems).values(data).returning();
    return newItem;
  } catch (error) {
    console.error("Error creating shop item:", error);
    throw new Error("Failed to create shop item");
  }
};

// World page operations - get all users for visiting gardens
export const getAllUsers = async () => {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)]
    });
    return allUsers;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to get all users");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error("Failed to get user");
  }
};

export const getUsersWithGardenItems = async () => {
  try {
    // First get all users
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)]
    });
    
    // Then get garden items for each user
    const usersWithGardens = await Promise.all(
      allUsers.map(async (user: SelectUser) => {
        const userGardenItems = await db.query.gardenItems.findMany({
          where: eq(gardenItems.userId, user.id)
        });
        return {
          ...user,
          gardenItems: userGardenItems
        };
      })
    );
    
    return usersWithGardens;
  } catch (error) {
    console.error("Error getting users with garden items:", error);
    throw new Error("Failed to get users with garden items");
  }
};

export const searchUsersByUsername = async (searchTerm: string, excludeUserId?: string) => {
  try {
    const searchQuery = searchTerm.toLowerCase();
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)]
    });
    
    // Filter users by search term and exclude current user
    const filteredUsers = allUsers.filter((user: SelectUser) => 
      user.username.toLowerCase().includes(searchQuery) && 
      (!excludeUserId || user.id !== excludeUserId)
    );
    
    return filteredUsers;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
};

// Leaderboard operations
export const getLeaderboardData = async () => {
  try {
    const leaderboardData = await db
      .select({
        userId: users.id,
        username: users.username,
        completedTasks: sql<number>`COALESCE(COUNT(CASE WHEN ${tasks.completed} = true THEN 1 END), 0)`.as('completedTasks'),
        totalTasks: sql<number>`COALESCE(COUNT(${tasks.id}), 0)`.as('totalTasks'),
        completionRate: sql<number>`COALESCE(ROUND((COUNT(CASE WHEN ${tasks.completed} = true THEN 1 END)::decimal / NULLIF(COUNT(${tasks.id}), 0) * 100), 1), 0)`.as('completionRate')
      })
      .from(users)
      .leftJoin(tasks, eq(users.id, tasks.userId))
      .groupBy(users.id, users.username)
      .orderBy(sql`completedTasks DESC, completionRate DESC`)
      .limit(50);

    return leaderboardData;
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    throw new Error("Failed to get leaderboard data");
  }
};

export const getFriendsLeaderboard = async (userId: string, friendUsernames: string[]) => {
  try {
    // Get leaderboard data for current user and their friends
    const allUsernames = [userId, ...friendUsernames];

    if (allUsernames.length === 0) {
      return [];
    }

    const friendsLeaderboard = await db
      .select({
        userId: users.id,
        username: users.username,
        completedTasks: sql<number>`COALESCE(COUNT(CASE WHEN ${tasks.completed} = true THEN 1 END), 0)`.as('completedTasks'),
        totalTasks: sql<number>`COALESCE(COUNT(${tasks.id}), 0)`.as('totalTasks'),
        completionRate: sql<number>`COALESCE(ROUND((COUNT(CASE WHEN ${tasks.completed} = true THEN 1 END)::decimal / NULLIF(COUNT(${tasks.id}), 0) * 100), 1), 0)`.as('completionRate'),
        isCurrentUser: sql<boolean>`${users.id} = ${userId}`.as('isCurrentUser')
      })
      .from(users)
      .leftJoin(tasks, eq(users.id, tasks.userId))
      .where(sql`${users.username} = ANY(${friendUsernames}) OR ${users.id} = ${userId}`)
      .groupBy(users.id, users.username)
      .orderBy(sql`completedTasks DESC, completionRate DESC`);

    return friendsLeaderboard;
  } catch (error) {
    console.error("Error getting friends leaderboard:", error);
    throw new Error("Failed to get friends leaderboard");
  }
};
