"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useSettings } from "../contexts/SettingsContext"
import { 
  Settings, 
  User, 
  Gamepad2, 
  Palette, 
  Volume2, 
  VolumeX,
  Download,
  Upload,
  Trash2,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Sun,
  Moon,
  Monitor
} from "lucide-react"

type SettingsSection = "profile" | "game" | "appearance" | "notifications" | "data" | "account"

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

export default function SettingsPage() {
  const { settings, updateSettings, saveSettings } = useSettings()
  const [currentSection, setCurrentSection] = useState<SettingsSection>("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [localUsername, setLocalUsername] = useState(settings.username)
  const [localEmail, setLocalEmail] = useState(settings.email || "")

  useEffect(() => {
    // Load current user data only once on mount
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        setLocalUsername(user.username || "")
        if (user.username && user.username !== settings.username) {
          updateSettings({ username: user.username })
        }
      } catch (error) {
        console.error("Failed to parse current user:", error)
      }
    }
  }, []) // Remove updateSettings from dependencies

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Update settings with local values before saving
      updateSettings({ 
        username: localUsername,
        email: localEmail
      })
      saveSettings()
      setMessage({ type: "success", text: "Settings saved successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    try {
      const data = {
        settings,
        user: localStorage.getItem("currentUser"),
        garden: localStorage.getItem("gardenItems"),
        inventory: localStorage.getItem("inventory"),
        tasks: localStorage.getItem("tasks")
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `garden-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" })
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.settings) {
          updateSettings(data.settings)
          localStorage.setItem("gardenSettings", JSON.stringify(data.settings))
        }
        
        if (data.user) localStorage.setItem("currentUser", data.user)
        if (data.garden) localStorage.setItem("gardenItems", data.garden)
        if (data.inventory) localStorage.setItem("inventory", data.inventory)
        if (data.tasks) localStorage.setItem("tasks", data.tasks)
        
        setMessage({ type: "success", text: "Data imported successfully!" })
      } catch (error) {
        setMessage({ type: "error", text: "Invalid data file" })
      }
    }
    reader.readAsText(file)
  }

  const clearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear()
      setMessage({ type: "success", text: "All data cleared" })
    }
  }

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" })
      return
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }
    
    setIsLoading(true)
    try {
      // Here you would typically call an API to change the password
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage({ type: "success", text: "Password changed successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password" })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("currentUser")
      window.location.href = "/"
    }
  }

  const SettingsSection = ({ section, icon: Icon, title, children }: {
    section: SettingsSection
    icon: any
    title: string
    children: React.ReactNode
  }) => (
    <div className={`rounded-lg border-2 transition-all card hover-lift ${
      currentSection === section 
        ? "border-green-500 bg-green-50" 
        : "border-border hover:border-green-300"
    }`}>
      <button
        onClick={() => setCurrentSection(section)}
        className={`flex items-center gap-3 w-full p-4 text-left cursor-pointer hover-scale ${
          currentSection === section ? "bg-green-50" : "bg-background hover:bg-muted/50"
        }`}
      >
        <Icon className={`h-5 w-5 ${
          currentSection === section ? "text-green-600" : "text-muted-foreground"
        }`} />
        <span className={`font-bold text-sm ${
          currentSection === section ? "text-green-700" : "text-foreground"
        }`}>
          {title}
        </span>
      </button>
      {currentSection === section && (
        <div className="p-4 pt-0 space-y-4 slide-in">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full h-[800px] max-w-sm mx-auto bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 flex-shrink-0">
        <div className="flex items-center gap-3 text-white">
          <button 
            onClick={() => window.history.back()}
            className="text-2xl hover:text-green-100 hover-scale ripple bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
          >
            ←
          </button>
          <Settings className="h-6 w-6" />
          <h1 className="text-xl font-black">SETTINGS</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-bold fade-in ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-3">
          <SettingsSection section="profile" icon={User} title="PROFILE">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">USERNAME</label>
                <Input
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  className="text-sm input-field"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">EMAIL (OPTIONAL)</label>
                <Input
                  type="email"
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  className="text-sm input-field"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection section="game" icon={Gamepad2} title="GAME SETTINGS">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">GARDEN GRID SIZE</label>
                <select
                  value={settings.gardenGridSize}
                  onChange={(e) => updateSettings({ 
                    gardenGridSize: e.target.value as "small" | "medium" | "large" 
                  })}
                  className="w-full p-2 border-2 border-border rounded-md text-sm font-bold focus:outline-none focus:border-green-500 input-field"
                >
                  <option value="small">Small (Compact)</option>
                  <option value="medium">Medium (Default)</option>
                  <option value="large">Large (Spacious)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">ANIMATION SPEED</label>
                <select
                  value={settings.animationSpeed}
                  onChange={(e) => updateSettings({ 
                    animationSpeed: e.target.value as "slow" | "normal" | "fast" 
                  })}
                  className="w-full p-2 border-2 border-border rounded-md text-sm font-bold focus:outline-none focus:border-green-500 input-field"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">AUTO SAVE</span>
                <button
                  onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer hover-scale ${
                    settings.autoSave ? "bg-green-500" : "bg-muted"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoSave ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection section="appearance" icon={Palette} title="APPEARANCE">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">THEME</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSettings({ theme: "light" })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 cursor-pointer hover-scale ${
                      settings.theme === "light" 
                        ? "border-green-500 bg-green-50" 
                        : "border-border hover:border-green-300"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs font-bold">Light</span>
                  </button>
                  <button
                    onClick={() => updateSettings({ theme: "dark" })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 cursor-pointer hover-scale ${
                      settings.theme === "dark" 
                        ? "border-green-500 bg-green-50" 
                        : "border-border hover:border-green-300"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs font-bold">Dark</span>
                  </button>
                  <button
                    onClick={() => updateSettings({ theme: "system" })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 cursor-pointer hover-scale ${
                      settings.theme === "system" 
                        ? "border-green-500 bg-green-50" 
                        : "border-border hover:border-green-300"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs font-bold">System</span>
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection section="notifications" icon={Bell} title="NOTIFICATIONS">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="text-sm font-bold text-foreground">SOUND EFFECTS</span>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer hover-scale ${
                    settings.soundEnabled ? "bg-green-500" : "bg-muted"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  <span className="text-sm font-bold text-foreground">PUSH NOTIFICATIONS</span>
                </div>
                <button
                  onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer hover-scale ${
                    settings.notificationsEnabled ? "bg-green-500" : "bg-muted"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection section="data" icon={Download} title="DATA MANAGEMENT">
            <div className="space-y-4">
              <Button
                onClick={exportData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm hover-lift ripple"
              >
                <Download className="h-4 w-4 mr-2" />
                EXPORT DATA
              </Button>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">IMPORT DATA</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="w-full p-2 border-2 border-border rounded-md text-sm font-bold focus:outline-none focus:border-green-500 input-field"
                />
              </div>
              <Button
                onClick={clearData}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 font-bold text-sm hover-lift ripple"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                CLEAR ALL DATA
              </Button>
            </div>
          </SettingsSection>

          <SettingsSection section="account" icon={User} title="ACCOUNT">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">CURRENT PASSWORD</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="text-sm pr-10 input-field"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover-scale"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">NEW PASSWORD</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-sm input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">CONFIRM NEW PASSWORD</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-sm input-field"
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={changePassword}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm hover-lift ripple"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "CHANGING..." : "CHANGE PASSWORD"}
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted font-bold text-sm hover-lift ripple"
              >
                <LogOut className="h-4 w-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </SettingsSection>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 hover-lift ripple flex-shrink-0"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "SAVING..." : "SAVE SETTINGS"}
        </Button>
      </div>
    </div>
  )
}
