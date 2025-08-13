import { createFriend } from "../queries/garden-queries";
import { InsertFriend } from "../schema/garden-schema";

const defaultFriends: Omit<InsertFriend, 'id' | 'userId' | 'createdAt'>[] = [
  { friendName: "DAAKSH", emoji: "🦆", color: "text-yellow-600" },
  { friendName: "CAN", emoji: "🚢", color: "text-blue-600" },
  { friendName: "EMMA", emoji: "🍷", color: "text-red-600" },
  { friendName: "KEYA", emoji: "🍷", color: "text-red-500" },
];

export async function createDefaultFriendsForUser(userId: string) {
  console.log(`🌱 Creating default friends for user: ${userId}`);
  
  for (const friend of defaultFriends) {
    try {
      await createFriend({
        ...friend,
        userId,
      });
      console.log(`✅ Added friend: ${friend.friendName}`);
    } catch (error) {
      console.error(`❌ Failed to add friend: ${friend.friendName}`, error);
    }
  }
  
  console.log("🎉 Default friends creation completed!");
}

export { defaultFriends };
