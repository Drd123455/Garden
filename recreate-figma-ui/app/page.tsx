"use client"

import type React from "react"
import firebaseApp from "../firebase"

import { useState, useEffect } from "react"
import Image, { StaticImageData }  from "next/image"
import { ShoppingBag, Sprout, Globe2, Settings, User } from "lucide-react"
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
import FountainGif from "../icons/Fountain.gif"
import WaterfallGif from "../icons/Waterfall.gif"
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
  resetCompletedTaskAction,
  deleteTaskAction,
  getTaskCountByUserIdAction,
  getCompletedTaskCountByUserIdAction,
  createFriendAction,
  getFriendsByUserIdAction,
  getAllShopItemsAction,
  getAllUsersAction,
  getUserByIdAction,
  getUsersWithGardenItemsAction,
  searchUsersByUsernameAction,
  getLeaderboardDataAction,
  getFriendsLeaderboardAction
} from "./actions/garden-actions"

// Import task pool utilities
import { getRandomTasks, getRandomTask, TaskTemplate } from "./utils/taskPool"

type Screen = "shop" | "garden" | "world" | "tasks" | "add-friends" | "profile" | "leaderboard"

type GardenItem = {
  id: string
  name: string
  emoji?: string
  icon?: StaticImageData | string
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
  icon?: StaticImageData | string
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
const imageMap: { [key: string]: StaticImageData | string } = {
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
  "FOUNTAIN": FountainGif,
  "WATERFALL": WaterfallGif,
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

    // Load profile picture from localStorage
    const savedProfilePicture = localStorage.getItem("profilePicture")
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture)
    }
  }, [])

  const [currentScreen, setCurrentScreen] = useState<Screen>("garden")
  const [searchQuery, setSearchQuery] = useState("")

  // Database-loaded state (temporarily using hardcoded data)
  const [shopItems, setShopItems] = useState([
    { id: "1", name: "ROSES", price: 150, emoji: "🌹", icon: FlowerRedPng, color: "text-pink-500" },
    { id: "2", name: "ORCHIDS", price: 175, emoji: "🌺", icon: FlowerBluePng, color: "text-purple-500" },
    { id: "3", name: "SUNFLOWERS", price: 125, emoji: "🌻", icon: FlowerYellowPng, color: "text-yellow-500" },
    { id: "4", name: "POPPIES", price: 100, emoji: "🌸", icon: FlowerPinkPng, color: "text-red-500" },
    { id: "5", name: "FOUNTAIN", price: 500, emoji: "⛲", icon: FountainGif, color: "text-blue-500" },
    { id: "6", name: "WATERFALL", price: 750, emoji: "🌊", icon: WaterfallGif, color: "text-blue-600" },
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
    { id: "5", name: "FOUNTAIN", quantity: 1, emoji: "⛲", icon: FountainGif, color: "text-blue-500" },
    { id: "6", name: "WATERFALL", quantity: 0, emoji: "🌊", icon: WaterfallGif, color: "text-blue-600" },
    { id: "7", name: "XMAS TREE", quantity: 2, emoji: "🎄", icon: XmasPng, color: "text-green-600" },
    { id: "8", name: "PALM TREE", quantity: 1, emoji: "🌴", icon: PalmPng, color: "text-green-500" },
    { id: "9", name: "WELL", quantity: 1, emoji: "🪣", icon: WellPng, color: "text-brown-600" },
    { id: "10", name: "SPRUCE TREE", quantity: 4, emoji: "🌲", icon: SprucePng, color: "text-green-700" },
    { id: "11", name: "SAKURA TREE", quantity: 2, emoji: "🌸", icon: SakuraPng, color: "text-pink-400" },
    { id: "12", name: "BONSAI TREE", quantity: 1, emoji: "🌳", icon: BonsaiPng, color: "text-green-600" },
  ] as Array<{ id: string; name: string; quantity: number; emoji: string; icon: StaticImageData | string | undefined; color: string }>)
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([
    { id: "1", name: "XMAS TREE", emoji: "🎄", icon: XmasPng, color: "text-green-600", x: 20, y: 20 },
    { id: "2", name: "SPRUCE TREE", emoji: "🌲", icon: SprucePng, color: "text-green-700", x: 20, y: 200 },
    { id: "3", name: "SAKURA TREE", emoji: "🌸", icon: SakuraPng, color: "text-pink-400", x: 120, y: 180 },
    { id: "4", name: "WATERFALL", emoji: "🌊", icon: WaterfallGif, color: "text-blue-600", x: 180, y: 160 },
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

  // Leaderboard states
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [friendsLeaderboardData, setFriendsLeaderboardData] = useState<any[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [currentLeaderboardView, setCurrentLeaderboardView] = useState<"global" | "friends">("friends")
  const [lastLeaderboardRefresh, setLastLeaderboardRefresh] = useState<Date | null>(null)

  // UI state
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())
  const [moneyAnimation, setMoneyAnimation] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 })
  const [droppingItems, setDroppingItems] = useState<Set<string>>(new Set())

  // Touch drag and drop state for mobile
  const [touchDragData, setTouchDragData] = useState<{
    data: DragData
    startX: number
    startY: number
    currentX?: number
    currentY?: number
    element: HTMLElement
  } | null>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [dragPreview, setDragPreview] = useState<{
    show: boolean
    x: number
    y: number
    item: any
  } | null>(null)

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string>("😊")
  const [isProfileEditing, setIsProfileEditing] = useState(false)

  // Particle system state for garden liveliness
  const [particles, setParticles] = useState<Array<{
    id: string
    x: number
    y: number
    vx: number
    vy: number
    type: 'leaf' | 'petal' | 'sparkle' | 'snowflake' | 'firefly'
    rotation: number
    size: number
    opacity: number
    color: string
  }>>([])
  const [windStrength, setWindStrength] = useState(0.5)
  const [windDirection, setWindDirection] = useState(1) // 1 for right, -1 for left
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')

  // Function to update profile picture
  const updateProfilePicture = async (emoji: string) => {
    setProfilePicture(emoji)
    // Save to localStorage for persistence
    localStorage.setItem("profilePicture", emoji)
    
    // Exit edit mode after selecting a new picture
    setIsProfileEditing(false)
    
    // TODO: Save to database when user profile update action is implemented
    // await updateUserProfilePictureAction(currentUser.id, emoji)
  }

  // Helper function to render images (handles both StaticImageData and string paths)
  const renderImage = (icon: StaticImageData | string | undefined, alt: string, width: number, height: number, className?: string) => {
    if (!icon) return null
    
    if (typeof icon === 'string') {
      // Handle GIF files and other string paths
      return (
        <img 
          src={icon} 
          alt={alt} 
          width={width} 
          height={height} 
          className={className}
        />
      )
    } else {
      // Handle StaticImageData (PNG files)
      return (
        <Image 
          src={icon} 
          alt={alt} 
          width={width} 
          height={height} 
          className={className}
        />
      )
    }
  }

  // Function to handle saving profile changes
  const handleSaveProfile = () => {
    // TODO: Save profile changes to database when implemented
    // For now, just exit edit mode
    setIsProfileEditing(false)
  }

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

  // Load leaderboard data when navigating to leaderboard
  useEffect(() => {
    if (currentScreen === "leaderboard" && currentUser) {
      loadLeaderboardData()
    }
  }, [currentScreen, currentUser])

  // Refresh leaderboard when navigating to leaderboard screen
  useEffect(() => {
    if (currentScreen === "leaderboard" && currentUser) {
      // Immediate refresh when navigating to leaderboard
      loadLeaderboardData()
      
      // Also refresh in background to ensure data is current
      refreshLeaderboardInBackground()
    }
  }, [currentScreen, currentUser])

  // Auto-refresh leaderboard every 30 seconds when on leaderboard screen
  useEffect(() => {
    if (currentScreen === "leaderboard" && currentUser) {
      const interval = setInterval(() => {
        loadLeaderboardData()
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [currentScreen, currentUser])

  // Initialize particle system
  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 10 }, () => createParticle())
    setParticles(initialParticles)
  }, [])

  // Particle animation loop
  useEffect(() => {
    const particleInterval = setInterval(() => {
      updateParticles()
    }, 50) // 20 FPS for smooth animation

    return () => clearInterval(particleInterval)
  }, [windStrength, windDirection])

  // Wind animation loop
  useEffect(() => {
    const windInterval = setInterval(() => {
      updateWind()
    }, 200) // Update wind every 200ms

    return () => clearInterval(windInterval)
  }, [])

  // Seasonal change loop
  useEffect(() => {
    const seasonInterval = setInterval(() => {
      setSeason(prev => {
        const seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'> = ['spring', 'summer', 'autumn', 'winter']
        const currentIndex = seasons.indexOf(prev)
        const nextIndex = (currentIndex + 1) % seasons.length
        return seasons[nextIndex]
      })
    }, 30000) // Change season every 30 seconds for demo purposes

    return () => clearInterval(seasonInterval)
  }, [])

  // Helper function to refresh leaderboard if on leaderboard screen
  const refreshLeaderboardIfNeeded = () => {
    if (currentScreen === "leaderboard" && currentUser) {
      loadLeaderboardData()
    }
  }

  // Function to refresh leaderboard data in background
  const refreshLeaderboardInBackground = async () => {
    if (currentUser) {
      try {
        console.log('Starting background leaderboard refresh for user:', currentUser.username)
        
        // Load global leaderboard
        const globalResult = await getLeaderboardDataAction()
        if (globalResult.status === "success" && globalResult.data) {
          console.log('Global leaderboard updated:', globalResult.data.length, 'users')
          setLeaderboardData(globalResult.data)
        } else {
          console.error('Failed to get global leaderboard:', globalResult)
        }
        
        // Load friends leaderboard
        const friendUsernames = friends.map(f => f.name)
        const friendsResult = await getFriendsLeaderboardAction(currentUser.id, friendUsernames)
        if (friendsResult.status === "success" && friendsResult.data) {
          console.log('Friends leaderboard updated:', friendsResult.data.length, 'users')
          setFriendsLeaderboardData(friendsResult.data)
        } else {
          console.error('Failed to get friends leaderboard:', friendsResult)
        }
        
        // Set refresh timestamp
        setLastLeaderboardRefresh(new Date())
        console.log('Background leaderboard refresh completed successfully')
      } catch (error) {
        console.error("Background leaderboard refresh failed:", error)
      }
    } else {
      console.log('No current user, skipping background leaderboard refresh')
    }
  }

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
        
        // Refresh leaderboard if on leaderboard screen
        refreshLeaderboardIfNeeded()
        
        // Also refresh leaderboard data in background to keep it current
        refreshLeaderboardInBackground()
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
      
      // Refresh leaderboard data to ensure it's current
      refreshLeaderboardInBackground()
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
        { name: "BONSAI TREE", quantity: 1, emoji: "🌳", color: "text-green-600" },
        { name: "FOUNTAIN", quantity: 1, emoji: "⛲", color: "text-blue-500" },
        { name: "WATERFALL", quantity: 1, emoji: "🌊", color: "text-blue-600" }
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
      })) as Array<{ id: string; name: string; quantity: number; emoji: string; icon: StaticImageData | string | undefined; color: string }>
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
      
      // Refresh leaderboard if on leaderboard screen
      refreshLeaderboardIfNeeded()
      
      // Also refresh leaderboard data in background to keep it current
      refreshLeaderboardInBackground()
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
        
        // Refresh leaderboard if on leaderboard screen
        refreshLeaderboardIfNeeded()
        
        // Also refresh leaderboard data in background to keep it current
        refreshLeaderboardInBackground()
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
        console.log('Completing task:', task.name, 'for user:', currentUser.username)
        
        // Update task in database
        await completeTaskAction(taskId)
        console.log('Task marked as completed in database')
        
        // Update local state - mark as completed
        setTasks((prev: any) => prev.map((t: any) => (t.id === taskId ? { ...t, completed: true } : t)))
        
        // Update money in database and local state
        const newMoney = money + task.reward
        await updateUserMoneyAction(currentUser.id, newMoney)
        setMoney(newMoney)
        
        // Update current user
        setCurrentUser((prev: any) => prev ? { ...prev, money: newMoney } : null)
        console.log('Money updated:', newMoney)
        
        // Wait a moment for database to sync, then refresh leaderboard
        setTimeout(async () => {
          try {
            console.log('Refreshing leaderboard after task completion...')
            // Refresh leaderboard data if on leaderboard screen
            refreshLeaderboardIfNeeded()
            
            // Also refresh leaderboard data in background to keep it current
            await refreshLeaderboardInBackground()
            console.log('Leaderboard refreshed successfully')
            
            // Force immediate leaderboard refresh to ensure data is current
            if (currentScreen === "leaderboard") {
              console.log('Force refreshing leaderboard data...')
              await loadLeaderboardData()
            }
            
            // Debug the leaderboard data to see what's happening
            setTimeout(() => {
              testLeaderboardData()
            }, 1000)
          } catch (error) {
            console.error('Failed to refresh leaderboard:', error)
          }
        }, 500) // Wait 500ms for database to sync
        
        // Reset completed task after a longer delay to show completion animation
        setTimeout(async () => {
          try {
            console.log('Resetting completed task...')
            // Reset the completed task to start over
            await resetCompletedTaskAction(taskId)
            
            // Update local state - reset progress and mark as not completed
            setTasks((prev: any) => prev.map((t: any) => 
              t.id === taskId ? { ...t, progress: 0, completed: false } : t
            ))
            
            // Wait a moment for database to sync, then refresh leaderboard again
            setTimeout(async () => {
              try {
                console.log('Refreshing leaderboard after task reset...')
                // Refresh leaderboard after task reset
                refreshLeaderboardIfNeeded()
                
                // Also refresh leaderboard data in background to keep it current
                await refreshLeaderboardInBackground()
                console.log('Leaderboard refreshed after task reset')
                
                // Force immediate leaderboard refresh to ensure data is current
                if (currentScreen === "leaderboard") {
                  console.log('Force refreshing leaderboard data after reset...')
                  await loadLeaderboardData()
                }
                
                // Debug the leaderboard data to see what's happening
                setTimeout(() => {
                  testLeaderboardData()
                }, 1000)
              } catch (error) {
                console.error('Failed to refresh leaderboard after task reset:', error)
              }
            }, 500)
          } catch (error) {
            console.error("Failed to reset completed task:", error)
          }
        }, 2000) // 2 second delay to show completion animation
        
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
        
        // Refresh leaderboard data if on leaderboard screen
        refreshLeaderboardIfNeeded()
        
        // Also refresh leaderboard data in background to keep it current
        refreshLeaderboardInBackground()
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
    e.preventDefault()
    const touch = e.touches[0]
    
    // Store touch data for mobile drag and drop
    setTouchDragData({
      data,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      element: e.currentTarget as HTMLElement
    })
    
    // Add visual feedback
    setIsTouching(true)
    const element = e.currentTarget as HTMLElement
    element.style.transform = 'scale(1.1)'
    element.style.zIndex = '50'
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragData) return
    
    e.preventDefault()
    const touch = e.touches[0]
    
    // Update touch position
    setTouchDragData(prev => prev ? {
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY
    } : null)
    
    // Show drag preview
    if (touchDragData.data.type === "inventory") {
      const gardenArea = document.querySelector('[data-garden-area]')
      if (gardenArea) {
        const rect = gardenArea.getBoundingClientRect()
        const x = touch.clientX - rect.left - 16
        const y = touch.clientY - rect.top - 16
        
        setDragPreview({
          show: true,
          x: Math.max(0, Math.min(x, rect.width - 32)),
          y: Math.max(0, Math.min(y, rect.height - 32)),
          item: touchDragData.data.item
        })
      }
    } else if (touchDragData.data.type === "garden") {
      const gardenArea = document.querySelector('[data-garden-area]')
      if (gardenArea) {
        const rect = gardenArea.getBoundingClientRect()
        const x = touch.clientX - rect.left - 16
        const y = touch.clientY - rect.top - 16
        
        setDragPreview({
          show: true,
          x: Math.max(0, Math.min(x, rect.width - 32)),
          y: Math.max(0, Math.min(y, rect.height - 32)),
          item: touchDragData.data.item
        })
      }
    }
  }

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!touchDragData) return
    
    e.preventDefault()
    const touch = e.changedTouches[0]
    
    // Find the drop target
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (dropTarget) {
      // Check if dropping on garden area
      const gardenArea = dropTarget.closest('[data-garden-area]')
      if (gardenArea) {
        const rect = gardenArea.getBoundingClientRect()
        const x = touch.clientX - rect.left - 16
        const y = touch.clientY - rect.top - 16
        const itemSize = 32
        const maxX = Math.max(0, rect.width - itemSize)
        const maxY = Math.max(0, rect.height - itemSize)
        
        await handleTouchDrop(touchDragData.data, x, y, maxX, maxY)
      }
      
      // Check if dropping on inventory area
      const inventoryArea = dropTarget.closest('[data-inventory-area]')
      if (inventoryArea && touchDragData.data.type === "garden") {
        await handleInventoryTouchDrop(touchDragData.data)
      }
    }
    
    // Clear touch data and reset visual feedback
    setTouchDragData(null)
    setIsTouching(false)
    setDragPreview(null)
    
    // Reset element styling
    if (touchDragData?.element) {
      touchDragData.element.style.transform = ''
      touchDragData.element.style.zIndex = ''
    }
  }

  // Helper function for touch drop on garden
  const handleTouchDrop = async (data: DragData, x: number, y: number, maxX: number, maxY: number) => {
    try {
      if (data.type === "inventory" && data.item.quantity > 0) {
        // Add item from inventory to garden
        const newItem: GardenItem = {
          id: Date.now().toString(),
          name: data.item.name,
          emoji: data.item.emoji,
          icon: data.item.icon,
          color: data.item.color,
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
          await updateInventoryQuantityAction(data.item.id, data.item.quantity - 1)
          setInventoryItems((prev: any) =>
            prev.map((item: any) => (item.id === data.item.id ? { ...item, quantity: item.quantity - 1 } : item))
          )
        } catch (error) {
          console.error("Failed to place garden item:", error)
        }
      } else if (data.type === "garden" && data.sourceId) {
        // Move existing garden item
        const newX = Math.max(0, Math.min(x, maxX))
        const newY = Math.max(0, Math.min(y, maxY))
        
        try {
          // Update position in database
          await updateGardenItemPositionAction(data.sourceId, newX, newY)
          
          // Update local state
          setGardenItems((prev: any) =>
            prev.map((item: any) =>
              item.id === data.sourceId
                ? { ...item, x: newX, y: newY }
                : item
            )
          )
        } catch (error) {
          console.error("Failed to update garden item position:", error)
        }
      }
    } catch (error) {
      console.error("Error handling touch drop:", error)
    }
  }

  // Helper function for touch drop on inventory
  const handleInventoryTouchDrop = async (data: DragData) => {
    try {
      if (data.type === "garden" && data.sourceId) {
        // Remove item from garden and return to inventory
        const gardenItem = gardenItems.find((item) => item.id === data.sourceId)
        
        if (gardenItem) {
          // Delete from garden
          await deleteGardenItemAction(data.sourceId)
          setGardenItems((prev) => prev.filter((item) => item.id !== data.sourceId))
          
          // Add to inventory
          const existingInventoryItem = inventoryItems.find((item) => item.name === gardenItem.name)
          if (existingInventoryItem) {
            await updateInventoryQuantityAction(existingInventoryItem.id, existingInventoryItem.quantity + 1)
            setInventoryItems((prev) =>
              prev.map((item) =>
                item.id === existingInventoryItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            )
          }
        }
      }
    } catch (error) {
      console.error("Error handling inventory touch drop:", error)
    }
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

  // Leaderboard functions
  const loadLeaderboardData = async () => {
    if (!currentUser) return

    try {
      setIsLoadingLeaderboard(true)
      setLeaderboardError(null)
      
      // Load global leaderboard
      const globalResult = await getLeaderboardDataAction()
      if (globalResult.status === "success" && globalResult.data) {
        console.log("Global leaderboard data:", globalResult.data)
        setLeaderboardData(globalResult.data)
      } else {
        console.log("Global leaderboard result:", globalResult)
      }
      
      // Load friends leaderboard
      const friendUsernames = friends.map(f => f.name)
      const friendsResult = await getFriendsLeaderboardAction(currentUser.id, friendUsernames)
      if (friendsResult.status === "success" && friendsResult.data) {
        console.log("Friends leaderboard data:", friendsResult.data)
        setFriendsLeaderboardData(friendsResult.data)
      } else {
        console.log("Friends leaderboard result:", friendsResult)
      }
      
      // Set refresh timestamp
      setLastLeaderboardRefresh(new Date())
      console.log("Leaderboard data loaded successfully")
    } catch (error) {
      console.error("Failed to load leaderboard data:", error)
      setLeaderboardError("Failed to load leaderboard data")
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  const getCurrentUserRank = () => {
    if (currentLeaderboardView === "friends") {
      const userRank = friendsLeaderboardData.findIndex(user => user.userId === currentUser?.id) + 1
      return userRank > 0 ? userRank : "N/A"
    } else {
      const userRank = leaderboardData.findIndex(user => user.userId === currentUser?.id) + 1
      return userRank > 0 ? userRank : "N/A"
    }
  }

  const getCurrentUserStats = () => {
    if (currentLeaderboardView === "friends") {
      const userData = friendsLeaderboardData.find(user => user.userId === currentUser?.id)
      return userData ? { completedTasks: userData.completedTasks, completionRate: userData.completionRate } : { completedTasks: 0, completionRate: 0 }
    } else {
      const userData = leaderboardData.find(user => user.userId === currentUser?.id)
      return userData ? { completedTasks: userData.completedTasks, completionRate: userData.completionRate } : { completedTasks: 0, completionRate: 0 }
    }
  }

  const BottomNav = () => {
    const isWorldActive = currentScreen === "world" || currentScreen === "add-friends"
    return (
      <div className="px-4 pb-4 pt-2">
        <div className="relative rounded-2xl border border-border bg-background/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="flex">
            <button
              onClick={() => setCurrentScreen("shop")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1 hover-scale"
            >
              <ShoppingBag className={`h-5 w-5 transition-all ${currentScreen === "shop" ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${currentScreen === "shop" ? "text-green-700" : "text-gray-600"}`}>SHOP</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${currentScreen === "shop" ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => setCurrentScreen("garden")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1 hover-scale"
            >
              <Sprout className={`h-5 w-5 transition-all ${currentScreen === "garden" ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${currentScreen === "garden" ? "text-green-700" : "text-gray-600"}`}>GARDEN</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${currentScreen === "garden" ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => setCurrentScreen("world")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1 hover-scale"
            >
              <Globe2 className={`h-5 w-5 transition-all ${isWorldActive ? "text-green-600 scale-110" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${isWorldActive ? "text-green-700" : "text-gray-600"}`}>WORLD</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-colors ${isWorldActive ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
            <button
              onClick={() => setCurrentScreen("profile")}
              className="group relative flex-1 items-center justify-center py-3 flex flex-col gap-1 hover-scale"
            >
              <User className="h-5 w-5 transition-all text-gray-500 group-hover:text-gray-700" />
              <span className={`text-[11px] font-extrabold tracking-wide transition-colors ${currentScreen === "profile" ? "text-green-700" : "text-gray-600"}`}>PROFILE</span>
              <div className={`pointer-events-none absolute -top-0.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-opacity ${currentScreen === "profile" ? "bg-green-500/90 opacity-100" : "opacity-0"}`} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ShopScreen = () => (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <button 
          onClick={() => setCurrentScreen("garden")}
          className="text-2xl hover:text-green-600 bg-muted hover:bg-muted/80 rounded-full p-2 hover-lift ripple"
        >
          ←
        </button>
        <span className="text-sm font-bold text-foreground">SHOP</span>
        <div className="relative">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <span className="text-sm font-bold text-green-600">${money}</span>
          {moneyAnimation.show && (
            <div className="absolute -top-6 left-0 text-sm font-bold text-red-500 money-change">
              {moneyAnimation.amount > 0 ? '+' : ''}{moneyAnimation.amount}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start overflow-y-auto p-2 min-h-0 max-h-150">
        {shopItems.map((item, index) => (
          <div key={index} className="text-center">
                    <div className={`bg-muted rounded-lg p-3 mb-2 h-16 flex items-center justify-center hover-lift ${
          purchasedItems.has(item.name) 
            ? 'bg-green-200 scale-110 shadow-lg purchase-success celebration' 
            : 'hover:bg-muted/80'
        }`}>
              {item.icon ? (
                renderImage(
                  item.icon,
                  item.name,
                  40,
                  40,
                  `h-10 w-10 object-contain transition-all duration-300 ${
                    purchasedItems.has(item.name) ? 'scale-125' : ''
                  }`
                )
              ) : (
                <span className={`text-2xl ${item.color} transition-all duration-300 ${
                  purchasedItems.has(item.name) ? 'scale-125' : ''
                }`}>{item.emoji}</span>
              )}
            </div>
            <div className="text-xs font-bold mb-1 text-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground mb-2">${item.price}</div>
            <Button
              size="sm"
              className={`text-xs px-2 py-1 w-full ripple hover-scale ${
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
      <div className="p-4 pb-2 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <span className="text-sm font-bold text-foreground">GARDEN</span>
          <div></div>
        </div>
        <div
          className="relative bg-green-400 border-2 border-green-600 rounded-lg overflow-hidden flex-shrink-0"
          style={{
            height: "280px",
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


          {gardenItems.map((item) => (
            <div
              key={item.id}
              className={`absolute cursor-move hover:scale-110 transition-transform touch-draggable hover-lift ${
                droppingItems.has(item.id) ? 'garden-drop' : ''
              } ${
                touchDragData?.data.type === "garden" && touchDragData.data.sourceId === item.id ? "ring-2 ring-blue-500 ring-opacity-75" : ""
              }`}
              style={{ 
                left: item.x, 
                top: item.y,
                transform: `rotate(${windStrength * windDirection * 2}deg)`,
                transition: 'transform 0.5s ease-out'
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, { type: "garden", item, sourceId: item.id })}
              onTouchStart={(e) => handleTouchStart(e, { type: "garden", item, sourceId: item.id })}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {item.icon ? (
                renderImage(item.icon, item.name, 40, 40, "h-10 w-10 object-contain drop-shadow-sm")
              ) : (
                <span className={`text-2xl ${item.color} drop-shadow-sm`}>{item.emoji}</span>
              )}
            </div>
          ))}
          
          {/* Drag Preview for Mobile */}
          {dragPreview && dragPreview.show && (
            <div
              className="absolute pointer-events-none z-50 drag-preview"
              style={{ left: dragPreview.x, top: dragPreview.y }}
            >
              {dragPreview.item.icon ? (
                renderImage(
                  dragPreview.item.icon, 
                  dragPreview.item.name, 
                  40, 
                  40, 
                  "h-10 w-10 object-contain drop-shadow-lg"
                )
              ) : (
                <span className={`text-2xl ${dragPreview.item.color} drop-shadow-lg`}>
                  {dragPreview.item.emoji}
                </span>
              )}
            </div>
          )}

          {/* Floating Particles System */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute pointer-events-none z-20 ${
                particle.type === 'leaf' ? 'particle-leaf' :
                particle.type === 'petal' ? 'particle-petal' :
                particle.type === 'sparkle' ? 'particle-sparkle' :
                particle.type === 'snowflake' ? 'particle-snowflake' :
                'particle-firefly'
              }`}
              style={{
                left: particle.x,
                top: particle.y,
                transform: `rotate(${particle.rotation}deg) scale(${particle.size})`,
                opacity: particle.opacity,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {particle.type === 'leaf' && (
                <span className="text-lg text-green-600 drop-shadow-sm">🍃</span>
              )}
              {particle.type === 'petal' && (
                <span className="text-lg text-pink-400 drop-shadow-sm">🌸</span>
              )}
              {particle.type === 'sparkle' && (
                <span className="text-lg text-yellow-400 drop-shadow-sm">✨</span>
              )}
              {particle.type === 'snowflake' && (
                <span className="text-lg text-blue-400 drop-shadow-sm">❄️</span>
              )}
              {particle.type === 'firefly' && (
                <span className="text-lg text-purple-400 drop-shadow-sm">🔥</span>
              )}
            </div>
          ))}

          {/* Wind Indicator */}
          <div 
            className="absolute top-2 right-2 text-xs text-white bg-black/20 px-2 py-1 rounded-full pointer-events-none wind-indicator"
            style={{
              transform: `translateX(${windDirection * windStrength * 10}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            💨 {windStrength > 0.8 ? 'Strong' : windStrength > 0.5 ? 'Moderate' : 'Light'} Wind
          </div>

          {/* Season Indicator */}
          <div className="absolute top-2 left-2 text-xs text-white bg-black/20 px-2 py-1 rounded-full pointer-events-none">
            {season === 'spring' && '🌸 Spring'}
            {season === 'summer' && '☀️ Summer'}
            {season === 'autumn' && '🍂 Autumn'}
            {season === 'winter' && '❄️ Winter'}
          </div>
        </div>
      </div>
      <div
        className="bg-muted/30 border-t-2 border-border p-4 flex-1 border-2 border-dashed border-transparent hover:border-green-300 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleInventoryDrop}
        data-inventory-area
      >
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h2 className="text-lg font-black text-foreground">INVENTORY</h2>
          <span className="text-xs text-muted-foreground">Drag to place • Drop here to return</span>
        </div>
        <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto p-2">
          {inventoryItems.map((item, index) => (
            <div
              key={item.id}
              className={`text-center transition-all duration-300 touch-draggable ${
                item.quantity > 0 ? "cursor-grab active:cursor-grabbing" : "opacity-50"
              } ${
                purchasedItems.has(item.name) ? "animate-pulse scale-105" : ""
              } ${
                touchDragData?.data.type === "inventory" && touchDragData.data.item.id === item.id ? "ring-2 ring-green-500 ring-opacity-75" : ""
              }`}
              draggable={item.quantity > 0}
              onDragStart={(e) => item.quantity > 0 && handleDragStart(e, { type: "inventory", item })}
              onTouchStart={(e) => item.quantity > 0 && handleTouchStart(e, { type: "inventory", item })}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`bg-background rounded-lg p-2 mb-1 h-10 flex items-center justify-center hover:bg-muted hover-scale border border-border ${
                purchasedItems.has(item.name) ? "bg-green-100 shadow-lg item-highlight pulse-glow" : ""
              }`}>
                {item.icon ? (
                  renderImage(
                    item.icon,
                    item.name,
                    32,
                    32,
                    `h-8 w-8 object-contain transition-all duration-300 ${
                      purchasedItems.has(item.name) ? "scale-110" : ""
                    }`
                  )
                ) : (
                  <span className={`text-lg ${item.color} transition-all duration-300 ${
                    purchasedItems.has(item.name) ? "scale-110" : ""
                  }`}>{item.emoji}</span>
                )}
              </div>
              <div className="text-[10px] font-bold mb-1 leading-tight text-foreground">{item.name}</div>
              <div className={`text-[10px] ${item.quantity > 0 ? "text-muted-foreground" : "text-red-500"}`}>
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
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <button 
              onClick={closeVisitedGarden}
              className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
            >
              ←
            </button>
            <div className="ml-auto flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <div className="text-lg font-bold">${money}</div>
        </div>
          </div>
          <div className="text-center mb-4 flex-shrink-0">
            <div className="w-20 h-20 bg-green-500 mx-auto mb-2 relative rounded-full flex items-center justify-center">
              <span className="text-4xl">😊</span>
            </div>
            <h2 className="text-lg font-black text-foreground">{visitedGarden.username.toUpperCase()}</h2>
            <p className="text-xs text-muted-foreground">GARDEN</p>
          </div>
          
          {/* Garden Grid */}
          <div 
            className="relative w-full border-2 border-green-600 rounded-lg overflow-hidden flex-1"
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
                  renderImage(
                    item.icon,
                    item.name,
                    40,
                    40,
                    "h-10 w-10 object-contain drop-shadow-sm"
                  )
                ) : (
                  <span className={`text-3xl ${item.color} drop-shadow-sm`}>{item.emoji}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center flex-shrink-0">
            <p className="text-sm text-muted-foreground">
              {visitedGarden.gardenItems.length} items in this garden
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <button 
            onClick={() => setCurrentScreen("garden")}
            className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
          >
            ←
          </button>
          <span className="text-sm font-bold text-foreground">WORLD</span>
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 text-xs">GARDENS</Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 font-bold bg-transparent text-xs px-3"
            onClick={() => setCurrentScreen("add-friends")}
          >
            ADD FRIENDS
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 font-bold bg-transparent text-xs px-3"
            onClick={() => {
              setHasLoadedWorld(false)
              loadWorldUsers()
            }}
            disabled={isLoadingWorld}
          >
            {isLoadingWorld ? "..." : "🔄"}
          </Button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="space-y-4 mb-6 overflow-y-auto max-h-80">
            {isLoadingWorld ? (
                          <div className="text-center py-8">
              <div className="text-lg font-bold text-foreground">Loading gardens...</div>
              <div className="text-sm text-muted-foreground mt-2">This may take a moment</div>
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
              <div className="text-sm text-muted-foreground mt-2">{worldError}</div>
                <Button 
                  onClick={handleRetry}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Retry
                </Button>
              </div>
            ) : worldUsers.length === 0 ? (
                          <div className="text-center py-8">
              <div className="text-lg font-bold text-foreground">No gardens to visit yet</div>
              <div className="text-sm text-muted-foreground mt-2">Other users need to create accounts and add items to their gardens</div>
              </div>
            ) : (
              worldUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 bg-background rounded-lg border-2 border-border hover:border-green-300 transition-colors cursor-pointer card hover-lift"
                  onClick={() => visitGarden(user.id, user.username)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        😊
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{user.username.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.gardenItems?.length || 0} items in garden
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-600 font-bold">${user.money}</div>
                    <div className="text-xs text-muted-foreground">VISIT →</div>
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
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button 
          onClick={() => setCurrentScreen("garden")} 
          className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
        >
          ←
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <div className="text-lg font-bold">${money}</div>
        </div>
      </div>
      <div className="text-center mb-4 flex-shrink-0">
        <div className="w-20 h-20 bg-green-500 mx-auto mb-2 relative rounded-full flex items-center justify-center">
          <span className="text-4xl">{profilePicture}</span>
        </div>
        <h2 className="text-lg font-black text-foreground">{username.toUpperCase()}</h2>
        <p className="text-xs text-muted-foreground">LONDON—BASILDON</p>
      </div>
      <h3 className="text-base font-black mb-3 flex-shrink-0 text-foreground">TASK LIST</h3>
      <div className="space-y-3 overflow-y-auto max-h-64">
        {tasks.map((task) => (
                      <div
              key={task.id}
              className={`flex items-center gap-4 p-3 rounded-lg card ${task.completed ? "bg-green-100" : "bg-muted"}`}
            >
            {task.icon ? (
              renderImage(
                task.icon,
                task.name,
                32,
                32,
                `h-8 w-8 object-contain ${task.completed ? "opacity-50" : ""}`
              )
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
                    className="text-xs px-2 py-1 h-6 bg-transparent hover-scale ripple"
                    onClick={() => updateTaskProgress(task.id, 1)}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-6 bg-transparent hover-scale ripple"
                    onClick={() => updateTaskProgress(task.id, 5)}
                  >
                    +5
                  </Button>
              </div>
            )}
            {!task.completed && task.progress >= task.target && (
                              <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 hover-scale ripple"
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
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button 
          onClick={() => setCurrentScreen("world")}
          className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
        >
          ←
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <div className="text-lg font-bold">${money}</div>
        </div>
      </div>
      
      <div className="bg-green-100 rounded-lg p-3 mb-4 flex-shrink-0">
        <div className="flex flex-col gap-2 mb-3">
          <Input
            placeholder="Search for users by username..."
            value={friendSearchQuery}
            onChange={(e) => setFriendSearchQuery(e.target.value)}
            className="flex-1 text-xs font-bold"
          />
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white text-xs"
            onClick={() => searchForUsers(friendSearchQuery)}
            disabled={!friendSearchQuery.trim() || isSearching}
          >
            {isSearching ? "..." : "🔍"}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Type a username and click search to find users to add as friends
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3 mb-4 flex-shrink-0 max-h-40 overflow-y-auto">
          <div className="text-sm font-bold text-foreground sticky top-0 bg-background py-2">SEARCH RESULTS</div>
          {searchResults.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-background rounded-lg border-2 border-border card hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    😊
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground">{user.username.toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.gardenItems?.length || 0} garden items
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2"
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
      <div className="space-y-3 overflow-y-auto max-h-48">
        <div className="text-sm font-bold text-foreground sticky top-0 bg-background py-2">CURRENT FRIENDS</div>
        {friends.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-xs">
            No friends yet. Search for users above to add friends!
          </div>
        ) : (
          friends.map((friend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border-2 border-border card hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">😊</span>
                </div>
                <span className="font-bold text-xs text-foreground">{friend.name}</span>
              </div>
              <span className="text-xs text-green-600 font-bold">♥ FRIEND</span>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const LeaderboardScreen = () => (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button 
          onClick={() => setCurrentScreen("garden")}
          className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
        >
          ←
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
          <div className="text-lg font-bold">${money}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {/* View Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setCurrentLeaderboardView("friends")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all hover-scale ${
              currentLeaderboardView === "friends" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            FRIENDS
          </button>
          <button
            onClick={() => setCurrentLeaderboardView("global")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all hover-scale ${
              currentLeaderboardView === "global" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            GLOBAL
          </button>
        </div>

        {/* Current User Stats */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-center">
            <div className="text-sm font-bold mb-1">YOUR STATS</div>
            <div className="text-2xl font-black">{getCurrentUserStats().completedTasks}</div>
            <div className="text-xs opacity-90 mb-2">tasks completed</div>
            <div className="text-sm font-bold">{getCurrentUserStats().completionRate}%</div>
            <div className="text-xs opacity-90">completion rate</div>
          </div>
        </div>

        {/* Current User Rank */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-center">
            <div className="text-sm font-bold mb-1">YOUR RANK</div>
            <div className="text-2xl font-black">{getCurrentUserRank()}</div>
            <div className="text-xs opacity-90">
              {currentLeaderboardView === "friends" ? "Among your friends" : "Global ranking"}
            </div>
          </div>
        </div>

        {/* Leaderboard Status */}
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">
            {isLoadingLeaderboard ? (
              "🔄 Refreshing leaderboard..."
            ) : lastLeaderboardRefresh ? (
              `📊 Last updated: ${lastLeaderboardRefresh.toLocaleTimeString()}`
            ) : (
              "📊 Leaderboard ready"
            )}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoadingLeaderboard ? (
            <div className="text-center text-muted-foreground py-8">
              Loading leaderboard...
            </div>
          ) : leaderboardError ? (
            <div className="text-center text-red-500 py-8">
              {leaderboardError}
            </div>
          ) : (currentLeaderboardView === "friends" ? friendsLeaderboardData : leaderboardData).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {currentLeaderboardView === "friends" 
                ? "No friends data available yet. Complete some tasks to see your ranking!" 
                : "No leaderboard data available yet. Complete some tasks to see your ranking!"
              }
            </div>
          ) : (
            (currentLeaderboardView === "friends" ? friendsLeaderboardData : leaderboardData).map((user, index) => (
              <div key={user.userId} className={`flex items-center justify-between p-3 rounded-lg border-2 card hover-lift ${
                user.userId === currentUser?.id 
                  ? "border-green-500 bg-green-50" 
                  : "border-border"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? "bg-yellow-500" : 
                    index === 1 ? "bg-gray-400" : 
                    index === 2 ? "bg-amber-600" : "bg-green-500"
                  }`}>
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">
                      {user.username}
                      {user.userId === currentUser?.id && " (YOU)"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.completedTasks} tasks completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{user.completedTasks}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.completionRate}% rate
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Debug Info (remove in production) */}
        <div className="bg-gray-100 rounded-lg p-3 text-xs">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Current User ID: {currentUser?.id}</div>
          <div>Friends Count: {friends.length}</div>
          <div>Friends Names: {friends.map(f => f.name).join(", ") || "None"}</div>
          <div>Global Data Count: {leaderboardData.length}</div>
          <div>Friends Data Count: {friendsLeaderboardData.length}</div>
          <div>Current View: {currentLeaderboardView}</div>
          <div>Last Refresh: {lastLeaderboardRefresh ? lastLeaderboardRefresh.toLocaleTimeString() : "Never"}</div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={loadLeaderboardData}
          disabled={isLoadingLeaderboard}
          className="w-full hover-lift ripple"
        >
          {isLoadingLeaderboard ? "REFRESHING..." : "REFRESH LEADERBOARD"}
        </Button>
        
        {/* Debug Button */}
        <Button
          onClick={testLeaderboardData}
          variant="outline"
          className="w-full mt-2 hover-lift ripple"
        >
          🐛 DEBUG LEADERBOARD
        </Button>
      </div>
    </div>
  )

  const ProfileScreen = () => (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <button 
          onClick={() => setCurrentScreen("garden")}
          className="text-2xl hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 hover-lift ripple"
        >
          ←
        </button>
        <div className="ml-auto">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {profilePicture}
          </div>
        </div>
      </div>
      <div className="text-center mb-6 flex-shrink-0">
        <div className="w-24 h-24 bg-green-500 mx-auto mb-4 relative rounded-full flex items-center justify-center">
          <span className="text-6xl">{profilePicture}</span>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-black text-foreground mb-2">{username.toUpperCase()}</h2>
          <p className="text-sm text-muted-foreground mb-3">GARDEN MASTER</p>
          
          {/* Edit Mode Indicator */}
          {isProfileEditing && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 mb-3">
              <p className="text-xs text-blue-700 font-medium text-center">
                ✏️ EDITING PROFILE - Click SAVE when done or CANCEL to discard changes
              </p>
            </div>
          )}
          
          {/* Edit Button */}
          <div className="mb-3">
            <Button
              onClick={() => {
                if (isProfileEditing) {
                  // Save profile changes
                  handleSaveProfile()
                } else {
                  // Enter edit mode
                  setIsProfileEditing(true)
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2 hover-lift ripple"
            >
              {isProfileEditing ? "SAVE" : "EDIT PROFILE"}
            </Button>
            
            {/* Cancel Button - Only show when editing */}
            {isProfileEditing && (
              <Button
                onClick={() => setIsProfileEditing(false)}
                variant="outline"
                className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm px-4 py-2 hover-lift ripple"
              >
                CANCEL
              </Button>
            )}
          </div>
          
          {/* Profile Picture Picker - Only show when editing */}
          {isProfileEditing && (
            <div className="bg-muted rounded-lg p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-2">Change Profile Picture</p>
              <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                {["😊", "😎", "🤠", "👻", "🐱", "🐶", "🦊", "🐸", "🐼", "🐨", "🦁", "🐯", "🐮", "🐷", "🐸", "🐙", "🦄", "🌈", "⭐", "🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎹", "🎺", "🎻", "🎼", "🎵", "🎶", "🎤", "🎧", "🎬", "🎭", "🎨", "🎪", "🎯", "🎲", "🎸", "🎹", "🎺", "🎻", "🎼", "🎵", "🎶", "🎤", "🎧", "🎬"].slice(0, 32).map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => updateProfilePicture(emoji)}
                    className={`text-2xl p-1 rounded hover:bg-muted/80 hover-scale ${
                      profilePicture === emoji ? "bg-green-200 ring-2 ring-green-500 celebration" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex-shrink-0">
        <h3 className="text-lg font-black mb-3 text-center text-foreground">CURRENT TASKS</h3>
        <div className="space-y-3 overflow-y-auto max-h-48">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg card ${task.completed ? "bg-green-100" : "bg-muted"}`}
            >
                          {task.icon ? (
              renderImage(
                task.icon,
                task.name,
                24,
                24,
                `h-6 w-6 object-contain ${task.completed ? "opacity-50" : ""}`
              )
            ) : (
                <span className={`text-lg ${task.color} ${task.completed ? "opacity-50" : ""}`}>{task.emoji}</span>
              )}
              <div className="flex-1">
                <div className={`text-xs font-bold mb-1 ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {task.progress}/{task.target}
                </div>
                <div className="text-xs text-green-600 font-bold">${task.reward} reward</div>
              </div>
              {!task.completed && task.progress < task.target && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-6 bg-transparent hover-scale ripple"
                    onClick={() => updateTaskProgress(task.id, 1)}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-6 bg-transparent hover-scale ripple"
                    onClick={() => updateTaskProgress(task.id, 5)}
                  >
                    +5
                  </Button>
                </div>
              )}
              {!task.completed && task.progress >= task.target && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 hover-scale ripple"
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

      {/* Leaderboard Button */}
      <div className="flex-shrink-0 mt-4">
        <Button 
          onClick={() => setCurrentScreen("leaderboard")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 hover-lift ripple"
        >
          🏆 LEADERBOARD
        </Button>
      </div>

      {/* Settings Button */}
      <div className="flex-shrink-0 mt-4">
        <Button 
          onClick={() => window.location.href = "/settings"}
          className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 hover-lift ripple"
        >
          ⚙️ SETTINGS
        </Button>
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
      case "profile":
        return <ProfileScreen />
      case "leaderboard":
        return <LeaderboardScreen />
      default:
        return <GardenScreen />
    }
  }

  // Function to test leaderboard data
  const testLeaderboardData = async () => {
    if (!currentUser) return
    
    try {
      console.log('=== LEADERBOARD DEBUG INFO ===')
      console.log('Current user:', currentUser.username, currentUser.id)
      console.log('Current tasks:', tasks)
      console.log('Completed tasks:', tasks.filter(t => t.completed))
      console.log('Total tasks:', tasks.length)
      console.log('Completed count:', tasks.filter(t => t.completed).length)
      
      // Test the leaderboard query directly
      const globalResult = await getLeaderboardDataAction()
      console.log('Global leaderboard result:', globalResult)
      
      if (globalResult.status === "success" && globalResult.data) {
        const currentUserData = globalResult.data.find((u: any) => u.userId === currentUser.id)
        console.log('Current user in leaderboard:', currentUserData)
      }
      
      console.log('=== END DEBUG INFO ===')
    } catch (error) {
      console.error('Debug failed:', error)
    }
  }

  // Particle system functions for garden liveliness
  const createParticle = () => {
    // Seasonal particle types
    const seasonalTypes = {
      spring: ['petal', 'sparkle', 'leaf'],
      summer: ['sparkle', 'firefly', 'leaf'],
      autumn: ['leaf', 'petal', 'sparkle'],
      winter: ['snowflake', 'sparkle', 'leaf']
    }
    
    const availableTypes = seasonalTypes[season]
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)] as 'leaf' | 'petal' | 'sparkle' | 'snowflake' | 'firefly'
    
    const particle = {
      id: Math.random().toString(),
      x: Math.random() * 400, // Garden width
      y: Math.random() * 300, // Garden height
      vx: (Math.random() - 0.5) * 0.5 + windStrength * windDirection * 0.3,
      vy: Math.random() * 0.3 + 0.1,
      type,
      rotation: Math.random() * 360,
      size: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      color: `hsl(${Math.random() * 360}deg, 50%, 50%)`
    }
    
    return particle
  }

  const updateParticles = () => {
    setParticles(prev => {
      const updated = prev.map(particle => {
        // Update position
        let newX = particle.x + particle.vx
        let newY = particle.y + particle.vy
        
        // Add wind effect
        newX += windStrength * windDirection * 0.1
        
        // Update rotation
        const newRotation = particle.rotation + 1
        
        // Wrap around edges
        if (newX < -20) newX = 420
        if (newX > 420) newX = -20
        if (newY < -20) newY = 320
        if (newY > 320) newY = -20
        
        return {
          ...particle,
          x: newX,
          y: newY,
          rotation: newRotation
        }
      })
      
      // Remove old particles and add new ones
      if (updated.length < 15) {
        updated.push(createParticle())
      }
      
      // Remove particles that are too old (randomly)
      if (Math.random() < 0.02) {
        return updated.slice(1)
      }
      
      return updated
    })
  }

  const updateWind = () => {
    // Gradually change wind
    setWindStrength(prev => {
      const change = (Math.random() - 0.5) * 0.1
      return Math.max(0.1, Math.min(1.5, prev + change))
    })
    
    // Occasionally change wind direction
    if (Math.random() < 0.01) {
      setWindDirection(prev => prev * -1)
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
    <div className="w-full h-[800px] max-w-sm mx-auto bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); }
          100% { transform: translateY(300px) rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.5); }
        }
        
        .particle-leaf {
          animation: float 3s ease-in-out infinite;
        }
        
        .particle-petal {
          animation: sway 4s ease-in-out infinite;
        }
        
        .particle-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .particle-snowflake {
          animation: fall 6s linear infinite;
        }
        
        .particle-firefly {
          animation: glow 3s ease-in-out infinite;
        }
        
        .wind-indicator {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
      <div key={currentScreen} className="screen-enter slide-in flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderScreen()}
      </div>
      {currentScreen !== "tasks" && currentScreen !== "profile" && currentScreen !== "leaderboard" && <BottomNav />}
    </div>
  )
}