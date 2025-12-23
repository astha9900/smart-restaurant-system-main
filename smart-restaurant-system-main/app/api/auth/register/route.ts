import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, name } = body

  // Basic validation
  if (!email || !password || !name) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
  }

  // Mock registration - in production, save to database with hashed password
  const newUser = {
    email,
    name,
    role: "customer", // Default role for new registrations
  }

  return NextResponse.json({
    success: true,
    user: newUser,
    token: `token_${email}_${Date.now()}`,
    message: "Registration successful",
  })
}
