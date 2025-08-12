"use client"

import type React from "react"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import XmasPng from "../Trees/Christmas.png"
import PalmPng from "../Trees/Palm.png"
import SprucePng from "../Trees/Spruce.png"
import SakuraPng from "../Trees/Sakura.png"
import BonsaiPng from "../Trees/BonsaiPotted.png"
import RecyclePng from "../icons/recycle.png"
import CyclePng from "../icons/cycle.png"
import TrainPng from "../icons/train.png"
import SeasonalProdPng from "../icons/seasonal prod.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

const shopItems = [
  { name: "ROSES", price: 150, emoji: "🌹", color: "text-pink-500" },
  { name: "ORCHIDS", price: 175, emoji: "🌺", color: "text-purple-500" },
  { name: "SUNFLOWERS", price: 125, emoji: "🌻", color: "text-yellow-500" },
  { name: "POPPIES", price: 100, emoji: "🌸", color: "text-red-500" },
  { name: "FOUNTAIN", price: 500, emoji: "⛲", color: "text-blue-500" },
  { name: "WATERFALL", price: 750, emoji: "🏔️", color: "text-gray-600" },
  { name: "XMAS TREE", price: 200, emoji: "🎄", icon: XmasPng, color: "text-green-600" },
  { name: "PALM TREE", price: 300, emoji: "🌴", icon: PalmPng, color: "text-green-500" },
  { name: "WELL", price: 400, emoji: "🪣", color: "text-brown-600" },
  { name: "SPRUCE TREE", price: 250, emoji: "🌲", icon: SprucePng, color: "text-green-700" },
  { name: "SAKURA TREE", price: 350, emoji: "🌸", icon: SakuraPng, color: "text-pink-400" },
  { name: "BONSAI TREE", price: 450, emoji: "🌳", icon: BonsaiPng, color: "text-green-600" },
]

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
  error,
}: {
  username: string
  setUsername: (value: string) => void
  password: string
  setPassword: (value: string) => void
  onSignIn: () => void
  error?: string | null
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
          />
        </div>

        <Button
          onClick={onSignIn}
          disabled={!username.trim() || !password.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-sm"
        >
          SIGN IN
        </Button>

        {error ? (
          <div className="text-xs font-bold text-red-600">{error}</div>
        ) : null}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Start your gardening adventure today!</p>
        <div className="text-xs mt-2">
          New here? <a href="/signup" className="text-green-700 underline">Create an account</a>
        </div>
      </div>
    </div>
  </div>
)

export default function GardenApp() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [signInError, setSignInError] = useState<string | null>(null)

  const [currentScreen, setCurrentScreen] = useState<Screen>("shop")
  const [searchQuery, setSearchQuery] = useState("")

  const [money, setMoney] = useState(1250)

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "RECYCLE 10 ITEMS",
      progress: 8,
      target: 10,
      icon: RecyclePng,
      color: "text-green-600",
      reward: 50,
      completed: false,
    },
    {
      id: "2",
      name: "CYCLE/NINJA TO WORK",
      progress: 150,
      target: 150,
      icon: CyclePng,
      color: "text-blue-600",
      reward: 75,
      completed: false,
    },
    {
      id: "3",
      name: "TAKE PUBLIC TRANSPORT",
      progress: 75,
      target: 100,
      icon: TrainPng,
      color: "text-purple-600",
      reward: 40,
      completed: false,
    },
    {
      id: "4",
      name: "EAT SEASONAL PRODUCE",
      progress: 200,
      target: 200,
      icon: SeasonalProdPng,
      color: "text-orange-600",
      reward: 60,
      completed: false,
    },
  ])

  const [inventoryItems, setInventoryItems] = useState([
    { name: "ROSES", quantity: 5, emoji: "🌹", color: "text-pink-500" },
    { name: "ORCHIDS", quantity: 3, emoji: "🌺", color: "text-purple-500" },
    { name: "SUNFLOWERS", quantity: 8, emoji: "🌻", color: "text-yellow-500" },
    { name: "POPPIES", quantity: 12, emoji: "🌸", color: "text-red-500" },
    { name: "FOUNTAIN", quantity: 1, emoji: "⛲", color: "text-blue-500" },
    { name: "WATERFALL", quantity: 0, emoji: "🏔️", color: "text-gray-600" },
    { name: "XMAS TREE", quantity: 2, emoji: "🎄", icon: XmasPng, color: "text-green-600" },
    { name: "PALM TREE", quantity: 1, emoji: "🌴", icon: PalmPng, color: "text-green-500" },
    { name: "WELL", quantity: 1, emoji: "🪣", color: "text-brown-600" },
    { name: "SPRUCE TREE", quantity: 4, emoji: "🌲", icon: SprucePng, color: "text-green-700" },
    { name: "SAKURA TREE", quantity: 2, emoji: "🌸", icon: SakuraPng, color: "text-pink-400" },
    { name: "BONSAI TREE", quantity: 1, emoji: "🌳", icon: BonsaiPng, color: "text-green-600" },
  ])

  const [gardenItems, setGardenItems] = useState<GardenItem[]>([
    { id: "1", name: "XMAS TREE", emoji: "🎄", icon: XmasPng, color: "text-green-600", x: 20, y: 20 },
    { id: "2", name: "SPRUCE TREE", emoji: "🌲", icon: SprucePng, color: "text-green-700", x: 20, y: 200 },
    { id: "3", name: "SAKURA TREE", emoji: "🌸", icon: SakuraPng, color: "text-pink-400", x: 120, y: 180 },
    { id: "4", name: "WATERFALL", emoji: "🏔️", color: "text-gray-600", x: 180, y: 160 },
    { id: "5", name: "BONSAI TREE", emoji: "🌳", icon: BonsaiPng, color: "text-green-600", x: 240, y: 180 },
    { id: "6", name: "XMAS TREE", emoji: "🎄", icon: XmasPng, color: "text-green-600", x: 120, y: 240 },
  ])

  const [touchDrag, setTouchDrag] = useState<{
    isDragging: boolean
    data: DragData | null
    startX: number
    startY: number
    currentX: number
    currentY: number
  }>({
    isDragging: false,
    data: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  })

  const [friends, setFriends] = useState<Friend[]>([
    { name: "DAAKSH", emoji: "🦆", color: "text-yellow-600" },
    { name: "CAN", emoji: "🚢", color: "text-blue-600" },
    { name: "EMMA", emoji: "🍷", color: "text-red-600" },
    { name: "KEYA", emoji: "🍷", color: "text-red-500" },
  ])

  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())
  const [moneyAnimation, setMoneyAnimation] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 })
  const [droppingItems, setDroppingItems] = useState<Set<string>>(new Set())

  const completeTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.progress >= task.target && !task.completed) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)))
      setMoney((prev) => prev + task.reward)
    }
  }

  const updateTaskProgress = (taskId: string, increment: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId && !task.completed
          ? { ...task, progress: Math.min(task.progress + increment, task.target) }
          : task,
      ),
    )
  }

  const purchaseItem = (item: (typeof shopItems)[0]) => {
    if (money >= item.price) {
      // Add purchase animation
      setPurchasedItems(prev => new Set([...prev, item.name]))
      setMoneyAnimation({ show: true, amount: -item.price })
      
      // Update money and inventory
      setMoney((prev) => prev - item.price)
      setInventoryItems((prev) =>
        prev.map((invItem) => (invItem.name === item.name ? { ...invItem, quantity: invItem.quantity + 1 } : invItem)),
      )
      
      // Remove animation after delay
      setTimeout(() => {
        setPurchasedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(item.name)
          return newSet
        })
        setMoneyAnimation({ show: false, amount: 0 })
      }, 1000)
    }
  }

  const handleDragStart = (e: React.DragEvent, data: DragData) => {
    e.dataTransfer.setData("application/json", JSON.stringify(data))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 16 // Offset for emoji size
    const y = e.clientY - rect.top - 16
    const itemSize = 32 // approximate emoji box size
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
          x: Math.max(0, Math.min(x, maxX)), // Keep within bounds dynamically
          y: Math.max(0, Math.min(y, maxY)),
        }

        setGardenItems((prev) => [...prev, newItem])
        // trigger drop animation
        setDroppingItems((prev) => new Set([...prev, newItem.id]))
        setTimeout(() => {
          setDroppingItems((prev) => {
            const next = new Set(prev)
            next.delete(newItem.id)
            return next
          })
        }, 600)

        // Decrease inventory quantity
        setInventoryItems((prev) =>
          prev.map((item) => (item.name === dragData.item.name ? { ...item, quantity: item.quantity - 1 } : item)),
        )
      } else if (dragData.type === "garden" && dragData.sourceId) {
        // Move existing garden item
        setGardenItems((prev) =>
          prev.map((item) =>
            item.id === dragData.sourceId
              ? { ...item, x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) }
              : item,
          ),
        )
      }
    } catch (error) {
      console.error("Error parsing drag data:", error)
    }
  }

  const handleInventoryDrop = (e: React.DragEvent) => {
    e.preventDefault()

    try {
      const dragData: DragData = JSON.parse(e.dataTransfer.getData("application/json"))

      if (dragData.type === "garden" && dragData.sourceId) {
        // Remove item from garden and return to inventory
        const gardenItem = gardenItems.find((item) => item.id === dragData.sourceId)
        if (gardenItem) {
          // Remove from garden
          setGardenItems((prev) => prev.filter((item) => item.id !== dragData.sourceId))

          // Add back to inventory
          setInventoryItems((prev) =>
            prev.map((item) => (item.name === gardenItem.name ? { ...item, quantity: item.quantity + 1 } : item)),
          )
        }
      }
    } catch (error) {
      console.error("Error parsing drag data:", error)
    }
  }

  const handleTouchStart = (e: React.TouchEvent, data: DragData) => {
    const touch = e.touches[0]
    setTouchDrag({
      isDragging: true,
      data,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDrag.isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    setTouchDrag((prev) => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }))
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchDrag.isDragging || !touchDrag.data) {
      setTouchDrag({
        isDragging: false,
        data: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
      })
      return
    }

    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

    // Check if dropped on garden area
    const gardenArea = document.querySelector("[data-garden-area]")
    const inventoryArea = document.querySelector("[data-inventory-area]")

    if (gardenArea && gardenArea.contains(elementBelow)) {
      // Handle garden drop
      const rect = gardenArea.getBoundingClientRect()
      const x = touch.clientX - rect.left - 16
      const y = touch.clientY - rect.top - 16
      const itemSize = 32
      const maxX = Math.max(0, rect.width - itemSize)
      const maxY = Math.max(0, rect.height - itemSize)

      if (touchDrag.data.type === "inventory" && touchDrag.data.item.quantity > 0) {
        const newItem: GardenItem = {
          id: Date.now().toString(),
          name: touchDrag.data.item.name,
          emoji: touchDrag.data.item.emoji,
          icon: touchDrag.data.item.icon,
          color: touchDrag.data.item.color,
          x: Math.max(0, Math.min(x, maxX)),
          y: Math.max(0, Math.min(y, maxY)),
        }

        setGardenItems((prev) => [...prev, newItem])
        // trigger drop animation
        setDroppingItems((prev) => new Set([...prev, newItem.id]))
        setTimeout(() => {
          setDroppingItems((prev) => {
            const next = new Set(prev)
            next.delete(newItem.id)
            return next
          })
        }, 600)
        setInventoryItems((prev) =>
          prev.map((item) =>
            item.name === touchDrag.data!.item.name ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        )
      } else if (touchDrag.data.type === "garden" && touchDrag.data.sourceId) {
        setGardenItems((prev) =>
          prev.map((item) =>
            item.id === touchDrag.data!.sourceId
              ? { ...item, x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) }
              : item,
          ),
        )
      }
    } else if (inventoryArea && inventoryArea.contains(elementBelow)) {
      // Handle inventory return
      if (touchDrag.data.type === "garden" && touchDrag.data.sourceId) {
        const gardenItem = gardenItems.find((item) => item.id === touchDrag.data!.sourceId)
        if (gardenItem) {
          setGardenItems((prev) => prev.filter((item) => item.id !== touchDrag.data!.sourceId))
          setInventoryItems((prev) =>
            prev.map((item) => (item.name === gardenItem.name ? { ...item, quantity: item.quantity + 1 } : item)),
          )
        }
      }
    }

    setTouchDrag({
      isDragging: false,
      data: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    })
  }

  const BottomNav = () => (
    <div className="flex justify-around items-center py-4 border-t-2 border-gray-200">
      <button
        onClick={() => setCurrentScreen("shop")}
        className={`flex flex-col items-center gap-1 ${currentScreen === "shop" ? "text-green-600" : "text-gray-600"}`}
      >
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
        <span className="text-xs font-bold">SHOP</span>
      </button>
      <button
        onClick={() => setCurrentScreen("garden")}
        className={`flex flex-col items-center gap-1 ${currentScreen === "garden" ? "text-green-600" : "text-gray-600"}`}
      >
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
        <span className="text-xs font-bold">GARDEN</span>
      </button>
      <button
        onClick={() => setCurrentScreen("world")}
        className={`flex flex-col items-center gap-1 ${currentScreen === "world" ? "text-green-600" : "text-gray-600"}`}
      >
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
        <span className="text-xs font-bold">WORLD</span>
      </button>
    </div>
  )

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
              key={index}
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

  const WorldScreen = () => (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
        <span className="text-sm font-bold text-green-600">FRIENDS LIST</span>
        <div></div>
      </div>
      <div className="flex gap-2 mb-6">
        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6">FRIENDS</Button>
        <Button
          variant="outline"
          className="border-2 border-gray-300 font-bold bg-transparent"
          onClick={() => setCurrentScreen("add-friends")}
        >
          ADD FRIENDS
        </Button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="space-y-4 mb-6 flex-1 overflow-auto">
          {friends.map((friend, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className={`text-2xl ${friend.color}`}>{friend.emoji}</span>
              <span className="font-bold text-sm">{friend.name}</span>
            </div>
          ))}
        </div>
        <Button className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded-full text-lg">
          VISIT
        </Button>
      </div>
    </div>
  )

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
      <div className="bg-green-100 rounded-lg p-4 mb-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="TYPE A NAME OR USER CODE"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs font-bold"
          />
          <Button size="sm" className="bg-gray-400 hover:bg-gray-500">
            🔍
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4">FRIENDS</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4">ADD FRIENDS</Button>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {nearbyFriends.map((friend, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-2xl ${friend.color}`}>{friend.emoji}</span>
              <span className="font-bold text-sm">{friend.name}</span>
            </div>
            <button
              className={`text-xl transition-colors ${
                friends.some((f) => f.name === friend.name) ? "text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
              onClick={() => addFriend(friend)}
              disabled={friends.some((f) => f.name === friend.name)}
            >
              {friends.some((f) => f.name === friend.name) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
      <div className="text-center text-sm font-bold text-gray-600 mb-4">MORE NEARBY</div>
    </div>
  )

  const addFriend = (friendToAdd: (typeof nearbyFriends)[0]) => {
    if (!friends.some((friend) => friend.name === friendToAdd.name)) {
      setFriends([...friends, friendToAdd])
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
        onSignIn={() => {
          if (username.trim() === "baymax" && password.trim() === "12345") {
            setIsSignedIn(true)
          } else {
            setSignInError("Invalid credentials")
          }
        }}
        error={signInError}
      />
    )
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {renderScreen()}
      {currentScreen !== "tasks" && <BottomNav />}

      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        <Button size="sm" onClick={() => setCurrentScreen("tasks")} className="text-xs">
          TASK
        </Button>
      </div>
    </div>
  )
}
