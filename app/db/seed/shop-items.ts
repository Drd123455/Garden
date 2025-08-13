import { createShopItem } from "../queries/garden-queries";
import { InsertShopItem } from "../schema/garden-schema";

const defaultShopItems: Omit<InsertShopItem, 'id' | 'createdAt'>[] = [
  { name: "ROSES", price: 150, emoji: "🌹", icon: "/images/flowers/FlowerRed.png", color: "text-pink-500" },
  { name: "ORCHIDS", price: 175, emoji: "🌺", icon: "/images/flowers/FlowerBlue.png", color: "text-purple-500" },
  { name: "SUNFLOWERS", price: 125, emoji: "🌻", icon: "/images/flowers/FlowerYellow.png", color: "text-yellow-500" },
  { name: "POPPIES", price: 100, emoji: "🌸", icon: "/images/flowers/FlowerPink.png", color: "text-red-500" },
  { name: "FOUNTAIN", price: 500, emoji: "⛲", color: "text-blue-500" },
  { name: "WATERFALL", price: 750, emoji: "🏔️", color: "text-gray-600" },
  { name: "XMAS TREE", price: 200, emoji: "🎄", icon: "/images/trees/Christmas.png", color: "text-green-600" },
  { name: "PALM TREE", price: 300, emoji: "🌴", icon: "/images/trees/Palm.png", color: "text-green-500" },
  { name: "WELL", price: 400, emoji: "🪣", icon: "/images/OneDrive_3_8-12-2025/Well.png", color: "text-brown-600" },
  { name: "SPRUCE TREE", price: 250, emoji: "🌲", icon: "/images/trees/Spruce.png", color: "text-green-700" },
  { name: "SAKURA TREE", price: 350, emoji: "🌸", icon: "/images/trees/Sakura.png", color: "text-pink-400" },
  { name: "BONSAI TREE", price: 450, emoji: "🌳", icon: "/images/trees/BonsaiPotted.png", color: "text-green-600" },
];

export async function seedShopItems() {
  console.log("🌱 Seeding shop items...");
  
  for (const item of defaultShopItems) {
    try {
      await createShopItem(item);
      console.log(`✅ Added shop item: ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed to add shop item: ${item.name}`, error);
    }
  }
  
  console.log("🎉 Shop items seeding completed!");
}

export { defaultShopItems };
