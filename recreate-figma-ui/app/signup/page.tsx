"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const canSubmit = username.trim() && email.trim() && password && confirmPassword

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "Failed to create account")
        return
      }
      setSuccess("Account created. You can now sign in.")
      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-green-50 to-green-100">
      <div className="w-full max-w-xs bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌱</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">CREATE ACCOUNT</h1>
          <p className="text-sm text-gray-600">Join the garden community</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">USERNAME</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full font-bold text-sm"
              placeholder="Enter a username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">EMAIL</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-bold text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">PASSWORD</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-bold text-sm"
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">CONFIRM PASSWORD</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full font-bold text-sm"
              placeholder="Re-enter password"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-sm"
          >
            {isSubmitting ? "CREATING..." : "SIGN UP"}
          </Button>

          {error ? <div className="text-xs font-bold text-red-600">{error}</div> : null}
          {success ? (
            <div className="text-xs font-bold text-green-600">
              {success} <Link className="underline" href="/">Go to sign in</Link>
            </div>
          ) : null}
        </form>

        <div className="mt-6 text-center text-xs">
          Already have an account? <Link className="text-green-700 underline" href="/">Sign in</Link>
        </div>
      </div>
    </div>
  )
}


