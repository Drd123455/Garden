"use server";

import { 
  createUser,
  getUserByUsername,
  updateUserMoney,
  createGardenItem,
  getGardenItemsByUserId,
  updateGardenItemPosition,
  deleteGardenItem,
  createInventoryItem,
  getInventoryByUserId,
  updateInventoryQuantity,
  findInventoryItemByName,
  createTask,
  getTasksByUserId,
  updateTaskProgress,
  completeTask,
  createFriend,
  getFriendsByUserId,
  deleteFriend,
  getAllShopItems,
  createShopItem
} from "./db/queries/garden-queries";
import { 
  InsertUser,
  InsertGardenItem,
  InsertInventory,
  InsertTask,
  InsertFriend,
  InsertShopItem
} from "./db/schema/garden-schema";
import { ActionState } from "./types";
import { revalidatePath } from "next/cache";

// User actions
export async function createUserAction(data: InsertUser): Promise<ActionState> {
  try {
    const newUser = await createUser(data);
    revalidatePath("/");
    return { status: "success", message: "User created successfully", data: newUser };
  } catch (error) {
    return { status: "error", message: "Failed to create user" };
  }
}

export async function getUserByUsernameAction(username: string): Promise<ActionState> {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return { status: "error", message: "User not found" };
    }
    return { status: "success", message: "User retrieved successfully", data: user };
  } catch (error) {
    return { status: "error", message: "Failed to get user" };
  }
}

export async function updateUserMoneyAction(userId: string, amount: number): Promise<ActionState> {
  try {
    const updatedUser = await updateUserMoney(userId, amount);
    revalidatePath("/");
    return { status: "success", message: "Money updated successfully", data: updatedUser };
  } catch (error) {
    return { status: "error", message: "Failed to update money" };
  }
}

// Garden items actions
export async function createGardenItemAction(data: InsertGardenItem): Promise<ActionState> {
  try {
    const newItem = await createGardenItem(data);
    revalidatePath("/garden");
    return { status: "success", message: "Garden item created successfully", data: newItem };
  } catch (error) {
    return { status: "error", message: "Failed to create garden item" };
  }
}

export async function getGardenItemsByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const items = await getGardenItemsByUserId(userId);
    return { status: "success", message: "Garden items retrieved successfully", data: items };
  } catch (error) {
    return { status: "error", message: "Failed to get garden items" };
  }
}

export async function updateGardenItemPositionAction(itemId: string, x: number, y: number): Promise<ActionState> {
  try {
    const updatedItem = await updateGardenItemPosition(itemId, x, y);
    revalidatePath("/garden");
    return { status: "success", message: "Garden item position updated successfully", data: updatedItem };
  } catch (error) {
    return { status: "error", message: "Failed to update garden item position" };
  }
}

export async function deleteGardenItemAction(itemId: string): Promise<ActionState> {
  try {
    await deleteGardenItem(itemId);
    revalidatePath("/garden");
    return { status: "success", message: "Garden item deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete garden item" };
  }
}

// Inventory actions
export async function createInventoryItemAction(data: InsertInventory): Promise<ActionState> {
  try {
    const newItem = await createInventoryItem(data);
    revalidatePath("/inventory");
    return { status: "success", message: "Inventory item created successfully", data: newItem };
  } catch (error) {
    return { status: "error", message: "Failed to create inventory item" };
  }
}

export async function getInventoryByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const items = await getInventoryByUserId(userId);
    return { status: "success", message: "Inventory retrieved successfully", data: items };
  } catch (error) {
    return { status: "error", message: "Failed to get inventory" };
  }
}

export async function updateInventoryQuantityAction(itemId: string, quantity: number): Promise<ActionState> {
  try {
    const updatedItem = await updateInventoryQuantity(itemId, quantity);
    revalidatePath("/inventory");
    return { status: "success", message: "Inventory quantity updated successfully", data: updatedItem };
  } catch (error) {
    return { status: "error", message: "Failed to update inventory quantity" };
  }
}

export async function findInventoryItemByNameAction(userId: string, itemName: string): Promise<ActionState> {
  try {
    const item = await findInventoryItemByName(userId, itemName);
    if (!item) {
      return { status: "error", message: "Inventory item not found" };
    }
    return { status: "success", message: "Inventory item found successfully", data: item };
  } catch (error) {
    return { status: "error", message: "Failed to find inventory item" };
  }
}

// Task actions
export async function createTaskAction(data: InsertTask): Promise<ActionState> {
  try {
    const newTask = await createTask(data);
    revalidatePath("/tasks");
    return { status: "success", message: "Task created successfully", data: newTask };
  } catch (error) {
    return { status: "error", message: "Failed to create task" };
  }
}

export async function getTasksByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const tasks = await getTasksByUserId(userId);
    return { status: "success", message: "Tasks retrieved successfully", data: tasks };
  } catch (error) {
    return { status: "error", message: "Failed to get tasks" };
  }
}

export async function updateTaskProgressAction(taskId: string, progress: number): Promise<ActionState> {
  try {
    const updatedTask = await updateTaskProgress(taskId, progress);
    revalidatePath("/tasks");
    return { status: "success", message: "Task progress updated successfully", data: updatedTask };
  } catch (error) {
    return { status: "error", message: "Failed to update task progress" };
  }
}

export async function completeTaskAction(taskId: string): Promise<ActionState> {
  try {
    const completedTask = await completeTask(taskId);
    revalidatePath("/tasks");
    return { status: "success", message: "Task completed successfully", data: completedTask };
  } catch (error) {
    return { status: "error", message: "Failed to complete task" };
  }
}

// Friend actions
export async function createFriendAction(data: InsertFriend): Promise<ActionState> {
  try {
    const newFriend = await createFriend(data);
    revalidatePath("/friends");
    return { status: "success", message: "Friend added successfully", data: newFriend };
  } catch (error) {
    return { status: "error", message: "Failed to add friend" };
  }
}

export async function getFriendsByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const friends = await getFriendsByUserId(userId);
    return { status: "success", message: "Friends retrieved successfully", data: friends };
  } catch (error) {
    return { status: "error", message: "Failed to get friends" };
  }
}

export async function deleteFriendAction(friendId: string): Promise<ActionState> {
  try {
    await deleteFriend(friendId);
    revalidatePath("/friends");
    return { status: "success", message: "Friend removed successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to remove friend" };
  }
}

// Shop actions
export async function getAllShopItemsAction(): Promise<ActionState> {
  try {
    const items = await getAllShopItems();
    return { status: "success", message: "Shop items retrieved successfully", data: items };
  } catch (error) {
    return { status: "error", message: "Failed to get shop items" };
  }
}

export async function createShopItemAction(data: InsertShopItem): Promise<ActionState> {
  try {
    const newItem = await createShopItem(data);
    revalidatePath("/shop");
    return { status: "success", message: "Shop item created successfully", data: newItem };
  } catch (error) {
    return { status: "error", message: "Failed to create shop item" };
  }
}
