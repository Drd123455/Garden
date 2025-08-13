"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface UserSettings {
  username: string
  email?: string
  theme: "light" | "dark" | "system"
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoSave: boolean
  gardenGridSize: "small" | "medium" | "large"
  animationSpeed: "slow" | "normal" | "fast"
  language: string
  currency: string
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
  saveSettings: () => void
  resetSettings: () => void
}

const defaultSettings: UserSettings = {
  username: "",
  email: "",
  theme: "system",
  soundEnabled: true,
  notificationsEnabled: true,
  autoSave: true,
  gardenGridSize: "medium",
  animationSpeed: "normal",
  language: "en",
  currency: "USD"
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("gardenSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }

    // Load current user data
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        setSettings(prev => ({
          ...prev,
          username: user.username || ""
        }))
      } catch (error) {
        console.error("Failed to parse current user:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme changes
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // System theme - check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      if (systemTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [settings.theme])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const saveSettings = () => {
    try {
      localStorage.setItem("gardenSettings", JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem("gardenSettings")
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      saveSettings,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
