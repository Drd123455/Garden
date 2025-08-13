import { createInventoryItem } from "../queries/garden-queries";
import { InsertInventory } from "../schema/garden-schema";

const defaultInventoryItems: Omit<InsertInventory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  { name: "ROSES", quantity: 5, emoji: "🌹", icon: "/images/flowers/FlowerRed.png", color: "text-pink-500" },
  { name: "ORCHIDS", quantity: 3, emoji: "🌺", icon: "/images/flowers/FlowerBlue.png", color: "text-purple-500" },
  { name: "SUNFLOWERS", quantity: 8, emoji: "🌻", icon: "/images/flowers/FlowerYellow.png", color: "text-yellow-500" },
  { name: "POPPIES", quantity: 12, emoji: "🌸", icon: "/images/flowers/FlowerPink.png", color: "text-red-500" },
  { name: "FOUNTAIN", quantity: 1, emoji: "⛲", color: "text-blue-500" },
  { name: "WATERFALL", quantity: 0, emoji: "🏔️", color: "text-gray-600" },
  { name: "XMAS TREE", quantity: 2, emoji: "🎄", icon: "/images/trees/Christmas.png", color: "text-green-600" },
  { name: "PALM TREE", quantity: 1, emoji: "🌴", icon: "/images/trees/Palm.png", color: "text-green-500" },
  { name: "WELL", quantity: 1, emoji: "🪣", icon: "/images/OneDrive_3_8-12-2025/Well.png", color: "text-brown-600" },
  { name: "SPRUCE TREE", quantity: 4, emoji: "🌲", icon: "/images/trees/Spruce.png", color: "text-green-700" },
  { name: "SAKURA TREE", quantity: 2, emoji: "🌸", icon: "/images/trees/Sakura.png", color: "text-pink-400" },
  { name: "BONSAI TREE", quantity: 1, emoji: "🌳", icon: "/images/trees/BonsaiPotted.png", color: "text-green-600" },
];

export async function createDefaultInventoryForUser(userId: string) {
  console.log(`🌱 Creating default inventory for user: ${userId}`);
  
  for (const item of defaultInventoryItems) {
    try {
      await createInventoryItem({
        ...item,
        userId,
      });
      console.log(`✅ Added inventory item: ${item.name} (${item.quantity})`);
    } catch (error) {
      console.error(`❌ Failed to add inventory item: ${item.name}`, error);
    }
  }
  
  console.log("🎉 Default inventory creation completed!");
}

export { defaultInventoryItems };
