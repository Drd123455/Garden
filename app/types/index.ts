export * from "./actions/action-types";

import type { StaticImageData } from "next/image"

export type GardenItem = {
  id: string
  name: string
  emoji?: string
  icon?: StaticImageData | string
  color: string
  x: number
  y: number
}

export type Particle = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: 'sparkle' | 'dust' | 'leaf' | 'firefly'
  color: string
  life: number
  maxLife: number
}
