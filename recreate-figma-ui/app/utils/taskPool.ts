// Task pool utility for random task generation
export interface TaskTemplate {
  name: string;
  reward: number;
  target: number;
  emoji?: string;
  color: string;
}

// Task pool based on tasks.txt
export const TASK_POOL: TaskTemplate[] = [
  { name: "USE REUSABLE CUP", reward: 50, target: 1, emoji: "☕", color: "text-blue-600" },
  { name: "USE TOTE/REUSABLE BAG", reward: 50, target: 1, emoji: "🛍️", color: "text-green-600" },
  { name: "RECYCLE ITEMS", reward: 100, target: 5, emoji: "♻️", color: "text-green-600" },
  { name: "COMPOST FOOD WASTE", reward: 100, target: 3, emoji: "🍃", color: "text-brown-600" },
  { name: "WALK OVER 2KM", reward: 150, target: 1, emoji: "🚶", color: "text-blue-600" },
  { name: "BIKE TO WORK/SCHOOL", reward: 150, target: 1, emoji: "🚲", color: "text-green-600" },
  { name: "TAKE PUBLIC TRANSPORT", reward: 120, target: 2, emoji: "🚌", color: "text-purple-600" },
  { name: "TURN OFF UNUSED LIGHTS", reward: 50, target: 5, emoji: "💡", color: "text-yellow-600" },
  { name: "PLANT A TREE/PLANT", reward: 250, target: 1, emoji: "🌱", color: "text-green-600" },
  { name: "REUSE PACKAGING", reward: 100, target: 3, emoji: "📦", color: "text-brown-600" },
  { name: "SHARE ECO KNOWLEDGE", reward: 100, target: 2, emoji: "📚", color: "text-blue-600" },
  { name: "LITTER CLEAN UP", reward: 200, target: 1, emoji: "🧹", color: "text-green-600" },
  { name: "HOST/ATTEND CLIMATE EVENT", reward: 300, target: 1, emoji: "🌍", color: "text-blue-600" },
  { name: "CO-OP CHALLENGE WITH FRIENDS", reward: 250, target: 1, emoji: "🤝", color: "text-purple-600" },
];

// Function to get random tasks
export function getRandomTasks(count: number, excludeNames: string[] = []): TaskTemplate[] {
  const availableTasks = TASK_POOL.filter(task => !excludeNames.includes(task.name));
  
  if (availableTasks.length < count) {
    // If not enough unique tasks, allow duplicates
    const selectedTasks: TaskTemplate[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * TASK_POOL.length);
      selectedTasks.push(TASK_POOL[randomIndex]);
    }
    return selectedTasks;
  }
  
  // Shuffle and select unique tasks
  const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get a single random task
export function getRandomTask(excludeNames: string[] = []): TaskTemplate {
  const availableTasks = TASK_POOL.filter(task => !excludeNames.includes(task.name));
  
  if (availableTasks.length === 0) {
    // If no unique tasks available, return a random one from the pool
    const randomIndex = Math.floor(Math.random() * TASK_POOL.length);
    return TASK_POOL[randomIndex];
  }
  
  const randomIndex = Math.floor(Math.random() * availableTasks.length);
  return availableTasks[randomIndex];
}
