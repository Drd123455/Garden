import { seedShopItems } from "./shop-items";
import { createDefaultTasksForUser } from "./default-tasks";
import { createDefaultInventoryForUser } from "./default-inventory";
import { createDefaultFriendsForUser } from "./default-friends";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");
  
  try {
    // Seed shop items (these are global, not user-specific)
    await seedShopItems();
    
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  }
}

export async function seedUserData(userId: string) {
  console.log(`🌱 Starting user data seeding for user: ${userId}`);
  
  try {
    // Create default tasks for the user
    await createDefaultTasksForUser(userId);
    
    // Create default inventory for the user
    await createDefaultInventoryForUser(userId);
    
    // Create default friends for the user
    await createDefaultFriendsForUser(userId);
    
    console.log(`✅ User data seeding completed for user: ${userId}`);
  } catch (error) {
    console.error(`❌ User data seeding failed for user: ${userId}:`, error);
  }
}

export {
  seedShopItems,
  createDefaultTasksForUser,
  createDefaultInventoryForUser,
  createDefaultFriendsForUser
};
