import { type NextRequest, NextResponse } from "next/server"

// Mock user database - replace with real DB calls
const users: Record<string, { password: string; role: string; name: string }> = {
  "customer@test.com": { password: "password123", role: "customer", name: "John Customer" },
  "admin@test.com": { password: "password123", role: "admin", name: "Admin User" },
  "staff@test.com": { password: "password123", role: "staff", name: "Kitchen Staff" },
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, action } = body

  if (action === "login") {
    const user = users[email]
    if (user && user.password === password) {
      return NextResponse.json({
        success: true,
        user: { email, role: user.role, name: user.name },
        token: `token_${email}_${Date.now()}`,
      })
    }
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
}
