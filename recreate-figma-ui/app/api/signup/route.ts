import { NextResponse } from "next/server"

// Simple in-memory mock. Replace with real DB in production.
const users = new Map<string, { email: string; passwordHash: string }>()

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 })
    }
    if (users.has(username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Very naive hash placeholder. Don't use in production.
    const passwordHash = Buffer.from(password).toString("base64")
    users.set(username, { email, passwordHash })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}


