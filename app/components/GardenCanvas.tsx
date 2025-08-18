"use client"

import React, { useRef, useEffect, useCallback, useState } from 'react'
import type { GardenItem, Particle } from '../types'
import { loadImageForCanvas, drawImageOnCanvas } from '../utils/imageUtils'

interface GardenCanvasProps {
  gardenItems: GardenItem[]
  onItemClick: (item: GardenItem) => void
  onItemDrag: (item: GardenItem, x: number, y: number) => void
  onDrop: (x: number, y: number) => void
  particles: Particle[]
  width: number
  height: number
  dragPreview: {
    show: boolean
    x: number
    y: number
    item: GardenItem
  } | null
}

const GardenCanvas: React.FC<GardenCanvasProps> = ({
  gardenItems,
  onItemClick,
  onItemDrag,
  onDrop,
  particles,
  width,
  height,
  dragPreview
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDraggingItem, setIsDraggingItem] = useState(false)
  const [draggedItem, setDraggedItem] = useState<GardenItem | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map())

  // Load images into cache
  useEffect(() => {
    const loadImages = async () => {
      const newCache = new Map<string, HTMLImageElement>()
      
      for (const item of gardenItems) {
        if (item.icon && !imageCache.has(item.icon.toString())) {
          const image = await loadImageForCanvas(item.icon)
          if (image) {
            newCache.set(item.icon.toString(), image)
          }
        }
      }
      
      if (newCache.size > 0) {
        setImageCache(prev => new Map([...prev, ...newCache]))
      }
    }
    
    loadImages()
  }, [gardenItems, imageCache])

  // Canvas setup and rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
  }, [width, height])

  // Render individual garden item
  const renderGardenItem = useCallback((ctx: CanvasRenderingContext2D, item: GardenItem, isDragging: boolean) => {
    const x = item.x
    const y = item.y
    const size = 40

    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = isDragging ? 8 : 4
    ctx.shadowOffsetX = isDragging ? 4 : 2
    ctx.shadowOffsetY = isDragging ? 4 : 2

    // Draw item background circle
    ctx.fillStyle = isDragging ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(x + size/2, y + size/2, size/2 + 2, 0, Math.PI * 2)
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw item icon/emoji
    if (item.icon) {
      const cachedImage = imageCache.get(item.icon.toString())
      if (cachedImage) {
        // Draw the actual image
        drawImageOnCanvas(ctx, cachedImage, x + 2, y + 2, size - 4, size - 4)
      } else {
        // Fallback to colored circle
        const color = item.color.replace('text-', '#').replace('-', '')
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x + size/2, y + size/2, size/2 - 4, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      // Draw emoji as text
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(item.emoji || '🌱', x + size/2, y + size/2)
    }

    // Draw selection border if item is selected
    if (isDragging) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(x - 2, y - 2, size + 4, size + 4)
    }
  }, [imageCache])

  // Main rendering function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render background with grass pattern
    renderBackground(ctx, width, height)

    // Render river
    renderRiver(ctx, width, height)

    // Render garden items
    gardenItems.forEach(item => {
      if (item.id !== draggedItem?.id) {
        renderGardenItem(ctx, item, false)
      }
    })

    // Render dragged item on top
    if (draggedItem && isDraggingItem) {
      renderGardenItem(ctx, draggedItem, true)
    }

    // Render particles
    particles.forEach(particle => {
      renderParticle(ctx, particle)
    })

    // Render drag preview
    if (dragPreview?.show) {
      renderDragPreview(ctx, dragPreview)
    }
  }, [gardenItems, particles, draggedItem, isDraggingItem, dragPreview, width, height, renderGardenItem])

  // Render background with grass pattern
  const renderBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Base grass color
    ctx.fillStyle = '#3cb066'
    ctx.fillRect(0, 0, width, height)

    // Grass pattern overlay
    ctx.fillStyle = '#22c55e'
    for (let x = 0; x < width; x += 16) {
      for (let y = 0; y < height; y += 16) {
        if (Math.random() > 0.7) {
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    // Additional grass details
    ctx.fillStyle = '#16a34a'
    for (let x = 8; x < width; x += 16) {
      for (let y = 8; y < height; y += 16) {
        if (Math.random() > 0.8) {
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }

  // Render river with flowing effect
  const renderRiver = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = Date.now() * 0.001
    
    // River gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
    gradient.addColorStop(0.33, 'rgba(29, 78, 216, 0.6)')
    gradient.addColorStop(0.66, 'rgba(96, 165, 250, 0.7)')
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)')
    
    ctx.fillStyle = gradient
    
    // Animated river path
    const riverY = height * 0.4 + Math.sin(time * 0.5) * 2
    const riverHeight = height * 0.15
    
    ctx.beginPath()
    ctx.moveTo(0, riverY)
    ctx.quadraticCurveTo(width * 0.25, riverY - 10, width * 0.5, riverY)
    ctx.quadraticCurveTo(width * 0.75, riverY + 10, width, riverY - 5)
    ctx.lineTo(width, riverY + riverHeight)
    ctx.quadraticCurveTo(width * 0.75, riverY + riverHeight + 10, width * 0.5, riverY + riverHeight)
    ctx.quadraticCurveTo(width * 0.25, riverY + riverHeight - 10, 0, riverY + riverHeight)
    ctx.closePath()
    ctx.fill()

    // River sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    for (let i = 0; i < 5; i++) {
      const x = (time * 50 + i * 100) % width
      const y = riverY + riverHeight * 0.5 + Math.sin(time * 2 + i) * 5
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }



  // Render particle effects
  const renderParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.globalAlpha = particle.opacity
    
    switch (particle.type) {
      case 'sparkle':
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 2
        ctx.fill()
        ctx.shadowBlur = 0
        break
        
      case 'dust':
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        break
        
      case 'leaf':
        ctx.fillStyle = particle.color
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.life * 0.1)
        ctx.beginPath()
        ctx.ellipse(0, 0, particle.size, particle.size * 1.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        break
        
      case 'firefly':
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 3
        ctx.fill()
        ctx.shadowBlur = 0
        break
    }
    
    ctx.globalAlpha = 1
  }

  // Render drag preview
  const renderDragPreview = (ctx: CanvasRenderingContext2D, preview: {
    show: boolean
    x: number
    y: number
    item: GardenItem
  } | null) => {
    if (!preview) return
    
    const x = preview.x
    const y = preview.y
    const size = 40

    ctx.globalAlpha = 0.7
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x, y, size, size)
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on a garden item
    const clickedItem = gardenItems.find(item => {
      return x >= item.x && x <= item.x + 40 && y >= item.y && y <= item.y + 40
    })

    if (clickedItem) {
      setIsDraggingItem(true)
      setDraggedItem(clickedItem)
      setDragOffset({
        x: x - clickedItem.x,
        y: y - clickedItem.y
      })
      onItemClick(clickedItem)
    }
  }, [gardenItems, onItemClick])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingItem || !draggedItem) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(x, width - 40))
    const constrainedY = Math.max(0, Math.min(y, height - 40))

    onItemDrag(draggedItem, constrainedX, constrainedY)
  }, [isDraggingItem, draggedItem, dragOffset, onItemDrag, width, height])

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingItem || !draggedItem) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(x, width - 40))
    const constrainedY = Math.max(0, Math.min(y, height - 40))

    onDrop(constrainedX, constrainedY)
    
    setIsDraggingItem(false)
    setDraggedItem(null)
    setDragOffset({ x: 0, y: 0 })
  }, [isDraggingItem, draggedItem, dragOffset, onDrop, width, height])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const clickedItem = gardenItems.find(item => {
      return x >= item.x && x <= item.x + 40 && y >= item.y && y <= item.y + 40
    })

    if (clickedItem) {
      setIsDraggingItem(true)
      setDraggedItem(clickedItem)
      setDragOffset({
        x: x - clickedItem.x,
        y: y - clickedItem.y
      })
      onItemClick(clickedItem)
    }
  }, [gardenItems, onItemClick])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDraggingItem || !draggedItem) return

    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left - dragOffset.x
    const y = touch.clientY - rect.top - dragOffset.y

    const constrainedX = Math.max(0, Math.min(x, width - 40))
    const constrainedY = Math.max(0, Math.min(y, height - 40))

    onItemDrag(draggedItem, constrainedX, constrainedY)
  }, [isDraggingItem, draggedItem, dragOffset, onItemDrag, width, height])

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDraggingItem || !draggedItem) return

    const touch = e.changedTouches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left - dragOffset.x
    const y = touch.clientY - rect.top - dragOffset.y

    const constrainedX = Math.max(0, Math.min(x, width - 40))
    const constrainedY = Math.max(0, Math.min(y, height - 40))

    onDrop(constrainedX, constrainedY)
    
    setIsDraggingItem(false)
    setDraggedItem(null)
    setDragOffset({ x: 0, y: 0 })
  }, [isDraggingItem, draggedItem, dragOffset, onDrop, width, height])

  // Render loop
  useEffect(() => {
    const renderLoop = () => {
      renderCanvas()
      requestAnimationFrame(renderLoop)
    }
    
    renderLoop()
  }, [renderCanvas])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    />
  )
}

export default GardenCanvas
