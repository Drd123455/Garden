"use client"

import type React from "react"
import firebaseApp from "../firebase"

import { useState, useEffect } from "react"
import Image, { StaticImageData }  from "next/image"
import { ShoppingBag, Sprout, Globe2, Settings } from "lucide-react"
import XmasPng from "../Trees/Christmas.png"
import PalmPng from "../Trees/Palm.png"
import SprucePng from "../Trees/Spruce.png"
import SakuraPng from "../Trees/Sakura.png"
import BonsaiPng from "../Trees/BonsaiPotted.png"
import RecyclePng from "../icons/recycle.png"
import CyclePng from "../icons/cycle.png"
import TrainPng from "../icons/train.png"
import SeasonalProdPng from "../icons/seasonal prod.png"
import FlowerBluePng from "../OneDrive_3_8-12-2025/FlowerBlue.png"
import FlowerPinkPng from "../OneDrive_3_8-12-2025/FlowerPink.png"
import FlowerRedPng from "../OneDrive_3_8-12-2025/FlowerRed.png"
import FlowerYellowPng from "../OneDrive_3_8-12-2025/FlowerYellow.png"
import WellPng from "../OneDrive_3_8-12-2025/Well.png"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

// Import database actions
import { 
  createUserAction,
  getUserByUsernameAction,
  updateUserMoneyAction,
  createGardenItemAction,
  getGardenItemsByUserIdAction,
  updateGardenItemPositionAction,
  deleteGardenItemAction,
  createInventoryItemAction,
  getInventoryByUserIdAction,
  updateInventoryQuantityAction,
  createTaskAction,
  getTasksByUserIdAction,
  updateTaskProgressAction,
  completeTaskAction,
  deleteTaskAction,
  getTaskCountByUserIdAction,
  getCompletedTaskCountByUserIdAction,
  createFriendAction,
  getFriendsByUserIdAction,
  getAllShopItemsAction,
  getAllUsersAction,
  getUserByIdAction,
  getUsersWithGardenItemsAction,
  searchUsersByUsernameAction
} from "./actions/garden-actions"

// Import task pool utilities
import { getRandomTasks, getRandomTask, TaskTemplate } from "./utils/taskPool"

type Screen = "shop" | "garden" | "world" | "tasks" | "add-friends"

type GardenItem = {
  id: string
  name: string
  emoji?: string
  icon?: StaticImageData
  color: string
  x: number
  y: number
}

type DragData = {
  type: "inventory" | "garden"
  item: any
  sourceId?: string
}

type Task = {
  id: string
  name: string
  progress: number
  target: number
  emoji?: string
  icon?: StaticImageData
  color: string
  reward: number
  completed: boolean
}

type Friend = {
  name: string
  emoji: string
  color: string
}

type WorldUser = {
  id: string
  username: string
  money: number
  createdAt: string
  gardenItems?: GardenItem[]
}

type VisitedGarden = {
  userId: string
  username: string
  gardenItems: GardenItem[]
}

// Image mapping for shop items
const imageMap: { [key: string]: StaticImageData } = {
  "ROSES": FlowerRedPng,
  "ORCHIDS": FlowerBluePng,
  "SUNFLOWERS": FlowerYellowPng,
  "POPPIES": FlowerPinkPng,
  "XMAS TREE": XmasPng,
  "PALM TREE": PalmPng,
  "WELL": WellPng,
  "SPRUCE TREE": SprucePng,
  "SAKURA TREE": SakuraPng,
  "BONSAI TREE": BonsaiPng,
}

const nearbyFriends = [
  { name: "ANGELINA", emoji: "📦", color: "text-brown-600" },
  { name: "MAYA", emoji: "🍷", color: "text-red-600" },
  { name: "RAHUL", emoji: "🔧", color: "text-gray-600" },
  { name: "JIGYA", emoji: "⚔️", color: "text-gray-700" },
]

const SignInScreen = ({
  username,
  setUsername,
  password,
  setPassword,
  onSignIn,
  onCreateAccount,
  error,
  isLoading,
}: {
  username: string
  setUsername: (value: string) => void
  password: string
  setPassword: (value: string) => void
  onSignIn: () => void
  onCreateAccount: () => void
  error?: string | null
  isLoading: boolean
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-green-50 to-green-100">
    <div className="w-full max-w-xs bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🌱</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">GARDEN GAME</h1>
        <p className="text-sm text-gray-600">Welcome to your virtual garden!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md font-bold text-sm focus:outline-none focus:border-green-500"
            placeholder="Enter your username"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md font-bold text-sm focus:outline-none focus:border-green-500"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={onSignIn}
          disabled={!username.trim() || !password.trim() || isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-sm"
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </Button>

        <Button
          onClick={onCreateAccount}
          disabled={!username.trim() || !password.trim() || isLoading}
          variant="outline"
          className="w-full border-2 border-gray-300 font-bold py-3 text-sm"
        >
          {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
        </Button>

        {error ? (
          <div className="text-xs font-bold text-red-600">{error}</div>
        ) : null}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Start your gardening adventure today!</p>
        <div className="text-xs mt-2">
          <p>Demo account: <span className="font-mono">baymax</span> / <span className="font-mono">12345</span></p>
        </div>
      </div>
    </div>
  </div>
)

export default function GardenApp() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [signInError, setSignInError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize authentication state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsSignedIn(true)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const [currentScreen, setCurrentScreen] = useState<Screen>("shop")
  const [searchQuery, setSearchQuery] = useState("")

  // Database-loaded state (temporarily using hardcoded data)
  const [shopItems, setShopItems] = useState([
    { id: "1", name: "ROSES", price: 150, emoji: "🌹", icon: FlowerRedPng, color: "text-pink-500" },
    { id: "2", name: "ORCHIDS", price: 175, emoji: "🌺", icon: FlowerBluePng, color: "text-purple-500" },
    { id: "3", name: "SUNFLOWERS", price: 125, emoji: "🌻", icon: FlowerYellowPng, color: "text-yellow-500" },
    { id: "4", name: "POPPIES", price: 100, emoji: "🌸", icon: FlowerPinkPng, color: "text-red-500" },
    { id: "5", name: "FOUNTAIN", price: 500, emoji: "⛲", color: "text-blue-500" },
    { id: "6", name: "WATERFALL", price: 750, emoji: "🏔️", color: "text-gray-600" },
    { id: "7", name: "XMAS TREE", price: 200, emoji: "🎄", icon: XmasPng, color: "text-green-600" },
    { id: "8", name: "PALM TREE", price: 300, emoji: "🌴", icon: PalmPng, color: "text-green-500" },
    { id: "9", name: "WELL", price: 400, emoji: "🪣", icon: WellPng, color: "text-brown-600" },
    { id: "10", name: "SPRUCE TREE", price: 250, emoji: "🌲", icon: SprucePng, color: "text-green-700" },
    { id: "11", name: "SAKURA TREE", price: 350, emoji: "🌸", icon: SakuraPng, color: "text-pink-400" },
    { id: "12", name: "BONSAI TREE", price: 450, emoji: "🌳", icon: BonsaiPng, color: "text-green-600" },
  ])
  const [money, setMoney] = useState(1250)
  const [tasks, setTasks] = useState<Task[]>([])
  const [inventoryItems, setInventoryItems] = useState([
    { id: "1", name: "ROSES", quantity: 5, emoji: "🌹", icon: FlowerRedPng, color: "text-pink-500" },
    { id: "2", name: "ORCHIDS", quantity: 3, emoji: "🌺", icon: FlowerBluePng, color: "text-purple-500" },
    { id: "3", name: "SUNFLOWERS", quantity: 8, emoji: "🌻", icon: FlowerYellowPng, color: "text-yellow-500" },
    { id: "4", name: "POPPIES", quantity: 12, emoji: "🌸", icon: FlowerPinkPng, color: "text-red-500" },
    { id: "5", name: "FOUNTAIN", quantity: 1, emoji: "⛲", color: "text-blue-500" },
    { id: "6", name: "WATERFALL", quantity: 0, emoji: "🏔️", color: "text-gray-600" },
    { id: "7", name: "XMAS TREE", quantity: 2, emoji: "🎄", icon: XmasPng, color: "text-green-600" },
    { id: "8", name: "PALM TREE", quantity: 1, emoji: "🌴", icon: PalmPng, color: "text-green-500" },
    { id: "9", name: "WELL", quantity: 1, emoji: "🪣", icon: WellPng, color: "text-brown-600" },
    { id: "10", name: "SPRUCE TREE", quantity: 4, emoji: "🌲", icon: SprucePng, color: "text-green-700" },
    { id: "11", name: "SAKURA TREE", quantity: 2, emoji: "🌸", icon: SakuraPng, color: "text-pink-400" },
    { id: "12", name: "BONSAI TREE", quantity: 1, emoji: "🌳", icon: BonsaiPng, color: "text-green-600" },
  ])
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([
    { id: "1", name: "XMAS TREE", emoji: "🎄", icon: XmasPng, color: "text-green-600", x: 20, y: 20 },
    { id: "2", name: "SPRUCE TREE", emoji: "🌲", icon: SprucePng, color: "text-green-700", x: 20, y: 200 },
    { id: "3", name: "SAKURA TREE", emoji: "🌸", icon: SakuraPng, color: "text-pink-400", x: 120, y: 180 },
    { id: "4", name: "WATERFALL", emoji: "🏔️", color: "text-gray-600", x: 180, y: 160 },
    { id: "5", name: "BONSAI TREE", emoji: "🌳", icon: BonsaiPng, color: "text-green-600", x: 240, y: 180 },
    { id: "6", name: "XMAS TREE", emoji: "🎄", icon: XmasPng, color: "text-green-600", x: 120, y: 240 },
  ])
  const [friends, setFriends] = useState<Friend[]>([
    { name: "DAAKSH", emoji: "🦆", color: "text-yellow-600" },
    { name: "CAN", emoji: "🚢", color: "text-blue-600" },
    { name: "EMMA", emoji: "🍷", color: "text-red-600" },
    { name: "KEYA", emoji: "🍷", color: "text-red-500" },
  ])

  // World page state
  const [worldUsers, setWorldUsers] = useState<WorldUser[]>([])
  const [visitedGarden, setVisitedGarden] = useState<VisitedGarden | null>(null)
  const [isLoadingWorld, setIsLoadingWorld] = useState(false)
  const [worldError, setWorldError] = useState<string | null>(null)
  const [hasLoadedWorld, setHasLoadedWorld] = useState(false)

  // Add friends state
  const [searchResults, setSearchResults] = useState<WorldUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [friendSearchQuery, setFriendSearchQuery] = useState("")

  // UI state
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())
  const [moneyAnimation, setMoneyAnimation] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 })
  const [droppingItems, setDroppingItems] = useState<Set<string>>(new Set())

  // Load shop items on component mount
  useEffect(() => {
    loadShopItems()
  }, [])

  // Load user data when signed in
  useEffect(() => {
    if (currentUser) {
      loadUserData()
    }
  }, [currentUser])

  const loadShopItems = async () => {
    try {
      const result = await getAllShopItemsAction()
      if (result.status === "success" && result.data) {
        // Map database items to include icons
        const itemsWithIcons = result.data.map((item: any) => ({
          ...item,
          icon: imageMap[item.name] || undefined
        }))
        setShopItems(itemsWithIcons)
      }
    } catch (error) {
      console.error("Failed to load shop items:", error)
    }
  }

  const loadUserData = async () => {
    if (!currentUser) return

    try {
      // Load garden items
      const gardenResult = await getGardenItemsByUserIdAction(currentUser.id)
      if (gardenResult.status === "success" && gardenResult.data) {
        const itemsWithIcons = gardenResult.data.map((item: any) => ({
          ...item,
          icon: imageMap[item.name] || undefined
        }))
        setGardenItems(itemsWithIcons)
      }
      
      // Load inventory
      const inventoryResult = await getInventoryByUserIdAction(currentUser.id)
      if (inventoryResult.status === "success" && inventoryResult.data) {
        const itemsWithIcons = inventoryResult.data.map((item: any) => ({
          ...item,
          icon: imageMap[item.name] || undefined
        }))
        setInventoryItems(itemsWithIcons)
      } else {
        // If no inventory exists, create default inventory
        await createDefaultInventory()
      }
      
      // Load tasks
      const tasksResult = await getTasksByUserIdAction(currentUser.id)
      if (tasksResult.status === "success" && tasksResult.data) {
        const tasksWithIcons = tasksResult.data.map((task: any) => ({
          ...task,
          icon: getTaskIcon(task.name)
        }))
        setTasks(tasksWithIcons)
        
        // Ensure user has exactly 4 tasks
        await ensureUserHasFourTasks(tasksResult.data)
      } else {
        // If no tasks exist, create default tasks
        await createDefaultTasks()
      }
      
      // Load friends
      const friendsResult = await getFriendsByUserIdAction(currentUser.id)
      if (friendsResult.status === "success" && friendsResult.data) {
        setFriends(friendsResult.data)
      } else {
        // If no friends exist, create default friends
        await createDefaultFriends()
      }

      // Set money from user data
      setMoney(currentUser.money)
    } catch (error) {
      console.error("Failed to load user data:", error)
    }
  }

  const createDefaultInventory = async () => {
    try {
      const defaultItems = [
        { name: "ROSES", quantity: 5, emoji: "🌹", color: "text-pink-500" },
        { name: "ORCHIDS", quantity: 3, emoji: "🌺", color: "text-purple-500" },
        { name: "SUNFLOWERS", quantity: 8, emoji: "🌻", color: "text-yellow-500" },
        { name: "POPPIES", quantity: 12, emoji: "🌸", color: "text-red-500" },
        { name: "XMAS TREE", quantity: 2, emoji: "🎄", color: "text-green-600" },
        { name: "PALM TREE", quantity: 1, emoji: "🌴", color: "text-green-500" },
        { name: "WELL", quantity: 1, emoji: "🪣", color: "text-brown-600" },
        { name: "SPRUCE TREE", quantity: 4, emoji: "🌲", color: "text-green-700" },
        { name: "SAKURA TREE", quantity: 2, emoji: "🌸", color: "text-pink-400" },
        { name: "BONSAI TREE", quantity: 1, emoji: "🌳", color: "text-green-600" }
      ]

      for (const item of defaultItems) {
        await createInventoryItemAction({
          userId: currentUser.id,
          name: item.name,
          quantity: item.quantity,
          emoji: item.emoji,
          icon: imageMap[item.name] ? item.name : undefined,
          color: item.color
        })
      }

      // Update local state
      const itemsWithIcons = defaultItems.map(item => ({
        id: Date.now().toString() + Math.random(),
        ...item,
        icon: imageMap[item.name] || undefined
      }))
      setInventoryItems(itemsWithIcons)
    } catch (error) {
      console.error("Failed to create default inventory:", error)
    }
  }

  const createDefaultTasks = async () => {
    try {
      // Get 4 random tasks from the task pool
      const randomTasks = getRandomTasks(4)
      
      for (const task of randomTasks) {
        await createTaskAction({
          userId: currentUser.id,
          name: task.name,
          progress: 0,
          target: task.target,
          emoji: task.emoji,
          color: task.color,
          reward: task.reward,
          completed: false
        })
      }

      // Update local state
      const tasksWithIcons = randomTasks.map(task => ({
        id: Date.now().toString() + Math.random(),
        ...task,
        progress: 0,
        completed: false,
        icon: getTaskIcon(task.name)
      }))
      setTasks(tasksWithIcons)
    } catch (error) {
      console.error("Failed to create default tasks:", error)
    }
  }

  const ensureUserHasFourTasks = async (existingTasks: any[]) => {
    try {
      const currentTaskCount = existingTasks.length
      
      if (currentTaskCount < 4) {
        // Need to add more tasks
        const tasksToAdd = 4 - currentTaskCount
        const currentTaskNames = existingTasks.map((task: any) => task.name)
        
        // Get random tasks excluding current ones
        const newTasks = getRandomTasks(tasksToAdd, currentTaskNames)
        
        for (const task of newTasks) {
          const newTaskResult = await createTaskAction({
            userId: currentUser.id,
            name: task.name,
            progress: 0,
            target: task.target,
            emoji: task.emoji,
            color: task.color,
            reward: task.reward,
            completed: false
          })
          
          if (newTaskResult.status === "success" && newTaskResult.data) {
            // Add new task to local state
            const newTask = {
              id: newTaskResult.data.id,
              name: task.name,
              progress: 0,
              target: task.target,
              emoji: task.emoji,
              color: task.color,
              reward: task.reward,
              completed: false,
              icon: getTaskIcon(task.name)
            }
            setTasks((prev: any) => [...prev, newTask])
          }
        }
      }
    } catch (error) {
      console.error("Failed to ensure user has four tasks:", error)
    }
  }

  const createDefaultFriends = async () => {
    try {
      const defaultFriends = [
        { name: "DAAKSH", emoji: "🦆", color: "text-yellow-600" },
        { name: "CAN", emoji: "🚢", color: "text-blue-600" },
        { name: "EMMA", emoji: "🍷", color: "text-red-600" },
        { name: "KEYA", emoji: "🍷", color: "text-red-500" }
      ]

      for (const friend of defaultFriends) {
        await createFriendAction({
          userId: currentUser.id,
          friendName: friend.name,
          emoji: friend.emoji,
          color: friend.color
        })
      }

      // Update local state
      setFriends(defaultFriends)
    } catch (error) {
      console.error("Failed to create default friends:", error)
    }
  }

  const getTaskIcon = (taskName: string): StaticImageData | undefined => {
    switch (taskName) {
      case "RECYCLE ITEMS": return RecyclePng
      case "BIKE TO WORK/SCHOOL": return CyclePng
      case "TAKE PUBLIC TRANSPORT": return TrainPng
      case "EAT SEASONAL PRODUCE": return SeasonalProdPng
      default: return undefined
    }
  }

  // World page functions
  const loadWorldUsers = async () => {
    if (isLoadingWorld || hasLoadedWorld) return // Prevent multiple simultaneous loads
    
    setIsLoadingWorld(true)
    setWorldError(null)
    try {
      const result = await getUsersWithGardenItemsAction()
      if (result.status === "success" && result.data) {
        // Filter out current user and map to include icons
        const filteredUsers = result.data
          .filter((user: any) => user.id !== currentUser?.id)
          .map((user: any) => ({
            ...user,
            gardenItems: user.gardenItems?.map((item: any) => ({
              ...item,
              icon: imageMap[item.name] || undefined
            })) || []
          }))
        setWorldUsers(filteredUsers)
        setHasLoadedWorld(true)
      } else {
        setWorldError(result.message || "Failed to load users")
      }
    } catch (error) {
      console.error("Failed to load world users:", error)
      setWorldError("Failed to load users. Please try again.")
    } finally {
      setIsLoadingWorld(false)
    }
  }

  const visitGarden = async (userId: string, username: string) => {
    try {
      const gardenResult = await getGardenItemsByUserIdAction(userId)
      if (gardenResult.status === "success" && gardenResult.data) {
        const gardenItemsWithIcons = gardenResult.data.map((item: any) => ({
          ...item,
          icon: imageMap[item.name] || undefined
        }))
        setVisitedGarden({
          userId,
          username,
          gardenItems: gardenItemsWithIcons
        })
      }
    } catch (error) {
      console.error("Failed to visit garden:", error)
    }
  }

  const closeVisitedGarden = () => {
    setVisitedGarden(null)
  }

  const resetWorldState = () => {
    setWorldUsers([])
    setVisitedGarden(null)
    setHasLoadedWorld(false)
    setWorldError(null)
  }

  // Add friends functions
  const searchForUsers = async (query: string) => {
    if (!query.trim() || !currentUser) return
    
    setIsSearching(true)
    try {
      const result = await searchUsersByUsernameAction(query, currentUser.id)
      if (result.status === "success" && result.data) {
        setSearchResults(result.data)
      }
    } catch (error) {
      console.error("Failed to search users:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const addUserAsFriend = async (userId: string, username: string) => {
    if (!currentUser) return
    
    try {
      // Check if already friends
      const existingFriend = friends.find(f => f.name === username)
      if (existingFriend) {
        alert("Already friends with this user!")
        return
      }

      // Create friend with random emoji and color
      const emojis = ["🌟", "🎉", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎹", "🎺"]
      const colors = ["text-blue-600", "text-green-600", "text-purple-600", "text-pink-600", "text-yellow-600", "text-red-600"]
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const result = await createFriendAction({
        userId: currentUser.id,
        friendName: username,
        emoji: randomEmoji,
        color: randomColor
      })

      if (result.status === "success") {
        // Add to local friends list
        const newFriend = {
          name: username,
          emoji: randomEmoji,
          color: randomColor
        }
        setFriends(prev => [...prev, newFriend])
        alert(`Added ${username} as a friend!`)
        
        // Clear search
        setSearchResults([])
        setFriendSearchQuery("")
      }
    } catch (error) {
      console.error("Failed to add friend:", error)
      alert("Failed to add friend. Please try again.")
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    setSignInError(null)

    try {
      // Check for demo account first
      if (username.trim() === "baymax" && password.trim() === "12345") {
        // Create demo user if doesn't exist
        const demoUser = await createUserAction({
          username: "baymax",
          password: "12345",
          money: 1250
        })
        
        if (demoUser.status === "success" && demoUser.data) {
          setCurrentUser(demoUser.data)
          setIsSignedIn(true)
          localStorage.setItem("currentUser", JSON.stringify(demoUser.data))
          return
        }
      }

      // Try to sign in with existing user
      const result = await getUserByUsernameAction(username.trim())
      if (result.status === "success" && result.data) {
        // In a real app, you'd verify the password hash here
        setCurrentUser(result.data)
        setIsSignedIn(true)
        localStorage.setItem("currentUser", JSON.stringify(result.data))
      } else {
        setSignInError("User not found. Create an account first.")
      }
    } catch (error) {
      setSignInError("Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setIsLoading(true)
    setSignInError(null)

    try {
      const result = await createUserAction({
        username: username.trim(),
        password: password.trim(),
        money: 1250
      })

      if (result.status === "success" && result.data) {
        setCurrentUser(result.data)
        setIsSignedIn(true)
        localStorage.setItem("currentUser", JSON.stringify(result.data))
      } else {
        setSignInError(result.message || "Failed to create account")
      }
    } catch (error) {
      setSignInError("Account creation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const completeTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.progress >= task.target && !task.completed) {
      try {
        // Update task in database
        await completeTaskAction(taskId)
        
        // Update local state - mark as completed
        setTasks((prev: any) => prev.map((t: any) => (t.id === taskId ? { ...t, completed: true } : t)))
        
        // Update money in database and local state
        const newMoney = money + task.reward
        await updateUserMoneyAction(currentUser.id, newMoney)
        setMoney(newMoney)
        
        // Update current user
        setCurrentUser((prev: any) => prev ? { ...prev, money: newMoney } : null)
        
        // Replace completed task with a new random task after a short delay
        setTimeout(async () => {
          try {
            // Get current task names to exclude from new task
            const currentTaskNames = tasks.map(t => t.name)
            
            // Get a new random task
            const newTaskTemplate = getRandomTask(currentTaskNames)
            
            // Create new task in database
            const newTaskResult = await createTaskAction({
              userId: currentUser.id,
              name: newTaskTemplate.name,
              progress: 0,
              target: newTaskTemplate.target,
              emoji: newTaskTemplate.emoji,
              color: newTaskTemplate.color,
              reward: newTaskTemplate.reward,
              completed: false
            })
            
            if (newTaskResult.status === "success" && newTaskResult.data) {
              // Remove completed task from local state
              setTasks((prev: any) => prev.filter((t: any) => t.id !== taskId))
              
              // Add new task to local state
              const newTask = {
                id: newTaskResult.data.id,
                name: newTaskTemplate.name,
                progress: 0,
                target: newTaskTemplate.target,
                emoji: newTaskTemplate.emoji,
                color: newTaskTemplate.color,
                reward: newTaskTemplate.reward,
                completed: false,
                icon: getTaskIcon(newTaskTemplate.name)
              }
              setTasks((prev: any) => [...prev, newTask])
            }
          } catch (error) {
            console.error("Failed to replace completed task:", error)
          }
        }, 1000) // 1 second delay to show completion animation
        
      } catch (error) {
        console.error("Failed to complete task:", error)
      }
    }
  }

  const updateTaskProgress = async (taskId: string, increment: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      const newProgress = Math.min(task.progress + increment, task.target)
      
      try {
        // Update task progress in database
        await updateTaskProgressAction(taskId, newProgress)
        
        // Update local state
        setTasks((prev: any) =>
          prev.map((t: any) =>
            t.id === taskId ? { ...t, progress: newProgress } : t
          )
        )
      } catch (error) {
        console.error("Failed to update task progress:", error)
      }
    }
  }

  const purchaseItem = async (item: any) => {
    if (money >= item.price) {
      try {
        // Add purchase animation
        setPurchasedItems(prev => new Set([...prev, item.name]))
        setMoneyAnimation({ show: true, amount: -item.price })
        
        // Update money in database and local state
        const newMoney = money - item.price
        await updateUserMoneyAction(currentUser.id, newMoney)
        setMoney(newMoney)
        setCurrentUser((prev: any) => prev ? { ...prev, money: newMoney } : null)
        
        // Update inventory in database
        const existingInventoryItem = inventoryItems.find(inv => inv.name === item.name)
        if (existingInventoryItem) {
          await updateInventoryQuantityAction(existingInventoryItem.id, existingInventoryItem.quantity + 1)
        } else {
          // Create new inventory item
          await createInventoryItemAction({
            userId: currentUser.id,
            name: item.name,
            quantity: 1,
            emoji: item.emoji,
            icon: item.icon ? item.name : undefined,
            color: item.color
          })
        }
        
        // Update local inventory state
        setInventoryItems((prev) => {
          const existing = prev.find((invItem) => invItem.name === item.name)
          if (existing) {
            return prev.map((invItem) => 
              invItem.name === item.name 
                ? { ...invItem, quantity: invItem.quantity + 1 } 
                : invItem
            )
          } else {
            return [...prev, {
              id: Date.now().toString(),
              name: item.name,
              quantity: 1,
              emoji: item.emoji,
              icon: item.icon,
              color: item.color
            }]
          }
        })
        
        // Remove animation after delay
        setTimeout(() => {
          setPurchasedItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(item.name)
            return newSet
          })
          setMoneyAnimation({ show: false, amount: 0 })
        }, 1000)
      } catch (error) {
        console.error("Failed to purchase item:", error)
        // Revert money change on error
        setMoney(money)
        setCurrentUser((prev: any) => prev ? { ...prev, money } : null)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, data: DragData) => {
    e.dataTransfer.setData("application/json", JSON.stringify(data))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 16
    const y = e.clientY - rect.top - 16
    const itemSize = 32
    const maxX = Math.max(0, rect.width - itemSize)
    const maxY = Math.max(0, rect.height - itemSize)

    try {
      const dragData: DragData = JSON.parse(e.dataTransfer.getData("application/json"))

      if (dragData.type === "inventory" && dragData.item.quantity > 0) {
        // Add item from inventory to garden
        const newItem: GardenItem = {
          id: Date.now().toString(),
          name: dragData.item.name,
          emoji: dragData.item.emoji,
          icon: dragData.item.icon,
          color: dragData.item.color,
          x: Math.max(0, Math.min(x, maxX)),
          y: Math.max(0, Math.min(y, maxY)),
        }

        try {
          // Save to database
          await createGardenItemAction({
            userId: currentUser.id,
            name: newItem.name,
            emoji: newItem.emoji,
            icon: newItem.icon ? newItem.name : undefined,
            color: newItem.color,
            x: newItem.x,
            y: newItem.y
          })

          // Update local state
          setGardenItems((prev: any) => [...prev, newItem])
          setDroppingItems((prev: any) => new Set([...prev, newItem.id]))
          setTimeout(() => {
            setDroppingItems((prev: any) => {
              const next = new Set<string>(prev)
              next.delete(newItem.id)
              return next
            })
          }, 600)

          // Decrease inventory quantity in database and local state
          await updateInventoryQuantityAction(dragData.item.id, dragData.item.quantity - 1)
          setInventoryItems((prev: any) =>
            prev.map((item: any) => (item.id === dragData.item.id ? { ...item, quantity: item.quantity - 1 } : item))
          )
        } catch (error) {
          console.error("Failed to place garden item:", error)
        }
             } else if (dragData.type === "garden" && dragData.sourceId) {
         // Move existing garden item
         const newX = Math.max(0, Math.min(x, maxX))
         const newY = Math.max(0, Math.min(y, maxY))
         
         try {
           // Update position in database
           await updateGardenItemPositionAction(dragData.sourceId, newX, newY)
           
                     // Update local state
          setGardenItems((prev: any) =>
            prev.map((item: any) =>
              item.id === dragData.sourceId
                ? { ...item, x: newX, y: newY }
                : item
            )
          )
         } catch (error) {
           console.error("Failed to update garden item position:", error)
         }
       }
    } catch (error) {
      console.error("Error parsing drag data:", error)
    }
  }

     const handleInventoryDrop = async (e: React.DragEvent) => {
     e.preventDefault()

     try {
       const dragData: DragData = JSON.parse(e.dataTransfer.getData("application/json"))

       if (dragData.type === "garden" && dragData.sourceId) {
         // Remove item from garden and return to inventory
         const gardenItem = gardenItems.find((item) => item.id === dragData.sourceId)
         if (gardenItem) {
           try {
             // Remove from garden in database
             await deleteGardenItemAction(dragData.sourceId)
             
             // Remove from local state
             setGardenItems((prev) => prev.filter((item) => item.id !== dragData.sourceId))

             // Update inventory quantity in database
             const existingInventoryItem = inventoryItems.find(inv => inv.name === gardenItem.name)
             if (existingInventoryItem) {
               await updateInventoryQuantityAction(existingInventoryItem.id, existingInventoryItem.quantity + 1)
             } else {
               // Create new inventory item if it doesn't exist
               await createInventoryItemAction({
                 userId: currentUser.id,
                 name: gardenItem.name,
                 quantity: 1,
                 emoji: gardenItem.emoji,
                 icon: gardenItem.icon ? gardenItem.name : undefined,
                 color: gardenItem.color
               })
             }

             // Update local inventory state
             setInventoryItems((prev: any) => {
               const existing = prev.find((invItem: any) => invItem.name === gardenItem.name)
               if (existing) {
                 return prev.map((invItem: any) => 
                   invItem.name === gardenItem.name 
                     ? { ...invItem, quantity: invItem.quantity + 1 } 
                     : invItem
                 )
               } else {
                 return [...prev, {
                   id: Date.now().toString(),
                   name: gardenItem.name,
                   quantity: 1,
                   emoji: gardenItem.emoji,
                   icon: gardenItem.icon,
                   color: gardenItem.color
                 }]
               }
             })
           } catch (error) {
             console.error("Failed to return item to inventory:", error)
           }
         }
       }
     } catch (error) {
       console.error("Error parsing drag data:", error)
     }
   }

  const handleTouchStart = (e: React.TouchEvent, data: DragData) => {
    const touch = e.touches[0]
    // Touch handling logic remains the same
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Touch handling logic remains the same
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Touch handling logic remains the same
  }

  // Function to handle garden item deletion
  const deleteGardenItem = async (itemId: string) => {
    try {
      await deleteGardenItemAction(itemId)
      setGardenItems((prev: any) => prev.filter((item: any) => item.id !== itemId))
    } catch (error) {
      console.error("Failed to delete garden item:", error)
    }
  }

  const BottomNav = () => {
    const isWorldActive = currentScreen === "world" || currentScreen === "add-friends"
    return (
      <div className="px-4 pb-4 pt-2">
        <div className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="flex">
            <button
              onClick={() => setCurrentScreen("shop")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1"
            >
              <ShoppingBag className={`h-5 w-5 transition-all ${currentScreen === "shop" ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${currentScreen === "shop" ? "text-green-700" : "text-gray-600"}`}>SHOP</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${currentScreen === "shop" ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => setCurrentScreen("garden")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1"
            >
              <Sprout className={`h-5 w-5 transition-all ${currentScreen === "garden" ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${currentScreen === "garden" ? "text-green-700" : "text-gray-600"}`}>GARDEN</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${currentScreen === "garden" ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => setCurrentScreen("world")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1"
            >
              <Globe2 className={`h-5 w-5 transition-all ${isWorldActive ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${isWorldActive ? "text-green-700" : "text-gray-600"}`}>WORLD</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${isWorldActive ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => window.location.href = "/settings"}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1"
            >
              <Settings className="h-5 w-5 transition-all text-gray-500 group-hover:text-gray-700" />
              <span className="text-[11px] font-extrabold tracking-wide transition-colors text-gray-600">SETTINGS</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ShopScreen = () => (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
        <span className="text-sm font-bold">SHOP</span>
        <div className="relative">
          <span className="text-sm font-bold text-green-600">${money}</span>
          {moneyAnimation.show && (
            <div className="absolute -top-6 left-0 text-sm font-bold text-red-500 money-change">
              {moneyAnimation.amount > 0 ? '+' : ''}{moneyAnimation.amount}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shopItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`bg-gray-100 rounded-lg p-4 mb-2 h-20 flex items-center justify-center transition-all duration-300 ${
              purchasedItems.has(item.name) 
                ? 'bg-green-200 scale-110 shadow-lg purchase-success' 
                : 'hover:bg-gray-200'
            }`}>
              {item.icon ? (
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={40}
                  height={40}
                  className={`h-10 w-10 object-contain transition-all duration-300 ${
                    purchasedItems.has(item.name) ? 'scale-125' : ''
                  }`}
                />
              ) : (
                <span className={`text-2xl ${item.color} transition-all duration-300 ${
                  purchasedItems.has(item.name) ? 'scale-125' : ''
                }`}>{item.emoji}</span>
              )}
            </div>
            <div className="text-xs font-bold mb-1">{item.name}</div>
            <div className="text-xs text-gray-600 mb-2">${item.price}</div>
            <Button
              size="sm"
              className={`text-xs px-2 py-1 w-full transition-all duration-200 ${
                money >= item.price
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => purchaseItem(item)}
              disabled={money < item.price}
            >
              {money >= item.price ? "BUY" : "NO $"}
            </Button>
            {purchasedItems.has(item.name) && (
              <div className="mt-2 text-xs text-green-600 font-bold animate-pulse">
                ✓ PURCHASED!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const GardenScreen = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="w-6 h-6 bg-green-600 rounded-full"></div>
          <span className="text-sm font-bold text-green-600">Garden</span>
          <div></div>
        </div>
        <div
          className="relative bg-green-400 border-2 border-green-600 rounded-lg overflow-hidden"
          style={{
            height: "300px",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #22c55e 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #16a34a 2px, transparent 2px),
              radial-gradient(circle at 25% 75%, #15803d 1px, transparent 1px),
              radial-gradient(circle at 75% 25%, #22c55e 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 0, 8px 8px, 8px 8px",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-garden-area
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,45 Q25,35 50,45 T100,40 L100,55 Q75,65 50,55 T0,60 Z" fill="#3b82f6" opacity="0.8" />
            <path d="M0,45 Q25,35 50,45 T100,40 L100,50 Q75,60 50,50 T0,55 Z" fill="#1d4ed8" opacity="0.6" />
          </svg>

          <div className="absolute inset-2 text-xs text-green-800 font-bold pointer-events-none z-10">
            Drag items from inventory below
          </div>
          {gardenItems.map((item) => (
            <div
              key={item.id}
              className={`absolute cursor-move hover:scale-110 transition-transform ${
                droppingItems.has(item.id) ? 'garden-drop' : ''
              }`}
              style={{ left: item.x, top: item.y }}
              draggable
              onDragStart={(e) => handleDragStart(e, { type: "garden", item, sourceId: item.id })}
              onTouchStart={(e) => handleTouchStart(e, { type: "garden", item, sourceId: item.id })}
            >
              {item.icon ? (
                <Image src={item.icon} alt={item.name} width={40} height={40} className="h-10 w-10 object-contain drop-shadow-sm" />
              ) : (
                <span className={`text-2xl ${item.color} drop-shadow-sm`}>{item.emoji}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className="bg-gray-50 border-t-2 border-gray-200 p-4 flex-1 border-2 border-dashed border-transparent hover:border-green-300 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleInventoryDrop}
        data-inventory-area
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-black">INVENTORY</h2>
          <span className="text-xs text-gray-600">Drag to place • Drop here to return</span>
        </div>
        <div className="grid grid-cols-4 gap-3 max-h-[180px] overflow-y-auto">
          {inventoryItems.map((item, index) => (
            <div
              key={item.id}
              className={`text-center transition-all duration-300 ${
                item.quantity > 0 ? "cursor-grab active:cursor-grabbing" : "opacity-50"
              } ${
                purchasedItems.has(item.name) ? "animate-pulse scale-105" : ""
              }`}
              draggable={item.quantity > 0}
              onDragStart={(e) => item.quantity > 0 && handleDragStart(e, { type: "inventory", item })}
              onTouchStart={(e) => item.quantity > 0 && handleTouchStart(e, { type: "inventory", item })}
            >
              <div className={`bg-white rounded-lg p-2 mb-1 h-12 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 border ${
                purchasedItems.has(item.name) ? "bg-green-100 shadow-lg item-highlight" : ""
              }`}>
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={32}
                    height={32}
                    className={`h-8 w-8 object-contain transition-all duration-300 ${
                      purchasedItems.has(item.name) ? "scale-110" : ""
                    }`}
                  />
                ) : (
                  <span className={`text-lg ${item.color} transition-all duration-300 ${
                    purchasedItems.has(item.name) ? "scale-110" : ""
                  }`}>{item.emoji}</span>
                )}
              </div>
              <div className="text-[10px] font-bold mb-1 leading-tight">{item.name}</div>
              <div className={`text-[10px] ${item.quantity > 0 ? "text-gray-600" : "text-red-500"}`}>
                {item.quantity}
              </div>
              {purchasedItems.has(item.name) && (
                <div className="text-[8px] text-green-600 font-bold animate-bounce">
                  NEW!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const WorldScreen = () => {
    // Load world users when screen is opened, but only once
    useEffect(() => {
      if (currentScreen === "world" && !hasLoadedWorld && !isLoadingWorld) {
        loadWorldUsers()
      }
    }, [currentScreen, hasLoadedWorld, isLoadingWorld])

    // Reset world state when leaving the world screen
    useEffect(() => {
      if (currentScreen !== "world") {
        resetWorldState()
      }
    }, [currentScreen])

    // Add error handling for loading
    const handleRetry = () => {
      loadWorldUsers()
    }

    // If viewing a specific garden, show the garden view
    if (visitedGarden) {
      return (
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={closeVisitedGarden}
              className="text-xl hover:text-green-600 transition-colors"
            >
              ←
            </button>
            <div className="ml-auto text-lg font-bold">${money}</div>
          </div>
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-green-500 mx-auto mb-2 relative rounded-full">
              <div className="absolute inset-2 bg-white rounded-full"></div>
              <div className="absolute top-4 left-4 w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h2 className="text-xl font-black">{visitedGarden.username.toUpperCase()}</h2>
            <p className="text-sm text-gray-600">GARDEN</p>
          </div>
          
          {/* Garden Grid */}
          <div 
            className="relative w-full h-96 border-2 border-green-600 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #22c55e 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #16a34a 2px, transparent 2px),
                radial-gradient(circle at 25% 75%, #15803d 1px, transparent 1px),
                radial-gradient(circle at 75% 25%, #22c55e 1px, transparent 1px)
              `,
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 0, 8px 8px, 8px 8px",
            }}
          >
            {/* River overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,45 Q25,35 50,45 T100,40 L100,55 Q75,65 50,55 T0,60 Z" fill="#3b82f6" opacity="0.8" />
              <path d="M0,45 Q25,35 50,45 T100,40 L100,50 Q75,60 50,50 T0,55 Z" fill="#1d4ed8" opacity="0.6" />
            </svg>

            {/* Garden items */}
            {visitedGarden.gardenItems.map((item) => (
              <div
                key={item.id}
                className="absolute cursor-pointer transition-transform hover:scale-110 z-20"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`
                }}
              >
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain drop-shadow-sm"
                  />
                ) : (
                  <span className={`text-3xl ${item.color} drop-shadow-sm`}>{item.emoji}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {visitedGarden.gardenItems.length} items in this garden
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-6 h-6 bg-green-600 rounded-full"></div>
          <span className="text-sm font-bold text-green-600">WORLD</span>
          <div></div>
        </div>
        <div className="flex gap-2 mb-6">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6">GARDENS</Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 font-bold bg-transparent"
            onClick={() => setCurrentScreen("add-friends")}
          >
            ADD FRIENDS
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 font-bold bg-transparent"
            onClick={() => {
              setHasLoadedWorld(false)
              loadWorldUsers()
            }}
            disabled={isLoadingWorld}
          >
            {isLoadingWorld ? "..." : "🔄"}
          </Button>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="space-y-4 mb-6 flex-1 overflow-auto">
            {isLoadingWorld ? (
              <div className="text-center py-8">
                <div className="text-lg font-bold text-gray-600">Loading gardens...</div>
                <div className="text-sm text-gray-500 mt-2">This may take a moment</div>
                <Button 
                  onClick={handleRetry}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Retry
                </Button>
              </div>
            ) : worldError ? (
              <div className="text-center py-8">
                <div className="text-lg font-bold text-red-600">Error loading gardens</div>
                <div className="text-sm text-gray-500 mt-2">{worldError}</div>
                <Button 
                  onClick={handleRetry}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Retry
                </Button>
              </div>
            ) : worldUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg font-bold text-gray-600">No gardens to visit yet</div>
                <div className="text-sm text-gray-500 mt-2">Other users need to create accounts and add items to their gardens</div>
              </div>
            ) : (
              worldUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors cursor-pointer"
                  onClick={() => visitGarden(user.id, user.username)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.username.toUpperCase()}</div>
                      <div className="text-xs text-gray-600">
                        {user.gardenItems?.length || 0} items in garden
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-600 font-bold">${user.money}</div>
                    <div className="text-xs text-gray-500">VISIT →</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  const TasksScreen = () => (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentScreen("garden")} className="text-xl">
          ←
        </button>
        <div className="ml-auto text-lg font-bold">${money}</div>
      </div>
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-red-500 mx-auto mb-2 relative">
          <div className="absolute inset-2 bg-black"></div>
          <div className="absolute top-4 left-4 w-4 h-4 bg-red-500"></div>
        </div>
        <h2 className="text-xl font-black">{username.toUpperCase()}</h2>
        <p className="text-sm text-gray-600">LONDON—BASILDON</p>
      </div>
      <h3 className="text-lg font-black mb-4">TASK LIST</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 p-3 rounded-lg ${task.completed ? "bg-green-100" : "bg-gray-50"}`}
          >
            {task.icon ? (
              <Image
                src={task.icon}
                alt={task.name}
                width={32}
                height={32}
                className={`h-8 w-8 object-contain ${task.completed ? "opacity-50" : ""}`}
              />
            ) : (
              <span className={`text-2xl ${task.color} ${task.completed ? "opacity-50" : ""}`}>{task.emoji}</span>
            )}
            <div className="flex-1">
              <div className={`text-xs font-bold mb-1 ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.name}
              </div>
              <div className="text-xs text-gray-600">
                {task.progress}/{task.target}
              </div>
              <div className="text-xs text-green-600 font-bold">${task.reward} reward</div>
            </div>
            {!task.completed && task.progress < task.target && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-2 py-1 h-6 bg-transparent"
                  onClick={() => updateTaskProgress(task.id, 1)}
                >
                  +1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-2 py-1 h-6 bg-transparent"
                  onClick={() => updateTaskProgress(task.id, 5)}
                >
                  +5
                </Button>
              </div>
            )}
            {!task.completed && task.progress >= task.target && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3"
                onClick={() => completeTask(task.id)}
              >
                COMPLETE
              </Button>
            )}
            {task.completed && <div className="text-green-600 font-bold text-xs">✓ DONE</div>}
          </div>
        ))}
      </div>
    </div>
  )

  const AddFriendsScreen = () => (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => setCurrentScreen("world")}
          className="text-xl hover:text-green-600 transition-colors"
        >
          ←
        </button>
        <div className="ml-auto text-lg font-bold">${money}</div>
      </div>
      
      <div className="bg-green-100 rounded-lg p-4 mb-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for users by username..."
            value={friendSearchQuery}
            onChange={(e) => setFriendSearchQuery(e.target.value)}
            className="flex-1 text-xs font-bold"
          />
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => searchForUsers(friendSearchQuery)}
            disabled={!friendSearchQuery.trim() || isSearching}
          >
            {isSearching ? "..." : "🔍"}
          </Button>
        </div>
        <div className="text-xs text-gray-600">
          Type a username and click search to find users to add as friends
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="text-sm font-bold text-gray-700">SEARCH RESULTS</div>
          {searchResults.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm">{user.username.toUpperCase()}</div>
                  <div className="text-xs text-gray-600">
                    {user.gardenItems?.length || 0} garden items
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                onClick={() => addUserAsFriend(user.id, user.username)}
                disabled={friends.some(f => f.name === user.username)}
              >
                {friends.some(f => f.name === user.username) ? "FRIENDS" : "ADD"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Current Friends */}
      <div className="space-y-4 mb-6">
        <div className="text-sm font-bold text-gray-700">CURRENT FRIENDS</div>
        {friends.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No friends yet. Search for users above to add friends!
          </div>
        ) : (
          friends.map((friend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <span className={`text-2xl ${friend.color}`}>{friend.emoji}</span>
                <span className="font-bold text-sm">{friend.name}</span>
              </div>
              <span className="text-xs text-green-600 font-bold">♥ FRIEND</span>
            </div>
          ))
        )}
      </div>
    </div>
  )

     const addFriend = async (friendToAdd: (typeof nearbyFriends)[0]) => {
     if (!friends.some((friend) => friend.name === friendToAdd.name)) {
       try {
         // Add friend to database
         await createFriendAction({
           userId: currentUser.id,
           friendName: friendToAdd.name,
           emoji: friendToAdd.emoji,
           color: friendToAdd.color
         })
         
         // Update local state
         setFriends([...friends, friendToAdd])
       } catch (error) {
         console.error("Failed to add friend:", error)
       }
     }
   }

  const renderScreen = () => {
    switch (currentScreen) {
      case "shop":
        return <ShopScreen />
      case "garden":
        return <GardenScreen />
      case "world":
        return <WorldScreen />
      case "tasks":
        return <TasksScreen />
      case "add-friends":
        return <AddFriendsScreen />
      default:
        return <ShopScreen />
    }
  }

  if (!isSignedIn) {
    return (
      <SignInScreen
        username={username}
        setUsername={(value: string) => {
          setUsername(value)
          if (signInError) setSignInError(null)
        }}
        password={password}
        setPassword={(value: string) => {
          setPassword(value)
          if (signInError) setSignInError(null)
        }}
        onSignIn={handleSignIn}
        onCreateAccount={handleCreateAccount}
        error={signInError}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div key={currentScreen} className="screen-enter">
        {renderScreen()}
      </div>
      {currentScreen !== "tasks" && <BottomNav />}

      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        <Button size="sm" onClick={() => setCurrentScreen("tasks")} className="text-xs">
          TASK
        </Button>
        <Button 
          size="sm" 
          onClick={() => window.location.href = "/settings"} 
          className="text-xs bg-gray-600 hover:bg-gray-700"
        >
          ⚙️
        </Button>
      </div>
    </div>
  )
}
