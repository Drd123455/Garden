import { createTask } from "../queries/garden-queries";
import { InsertTask } from "../schema/garden-schema";

const defaultTasks: Omit<InsertTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "RECYCLE 10 ITEMS",
    progress: 8,
    target: 10,
    icon: "/images/icons/recycle.png",
    color: "text-green-600",
    reward: 50,
    completed: false,
  },
  {
    name: "CYCLE/NINJA TO WORK",
    progress: 150,
    target: 150,
    icon: "/images/icons/cycle.png",
    color: "text-blue-600",
    reward: 75,
    completed: false,
  },
  {
    name: "TAKE PUBLIC TRANSPORT",
    progress: 75,
    target: 100,
    icon: "/images/icons/train.png",
    color: "text-purple-600",
    reward: 40,
    completed: false,
  },
  {
    name: "EAT SEASONAL PRODUCE",
    progress: 200,
    target: 200,
    icon: "/images/icons/seasonal prod.png",
    color: "text-orange-600",
    reward: 60,
    completed: false,
  },
];

export async function createDefaultTasksForUser(userId: string) {
  console.log(`🌱 Creating default tasks for user: ${userId}`);
  
  for (const task of defaultTasks) {
    try {
      await createTask({
        ...task,
        userId,
      });
      console.log(`✅ Added task: ${task.name}`);
    } catch (error) {
      console.error(`❌ Failed to add task: ${task.name}`, error);
    }
  }
  
  console.log("🎉 Default tasks creation completed!");
}

export { defaultTasks };
