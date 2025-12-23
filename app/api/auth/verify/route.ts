import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  const token = authHeader.substring(7)

  // Mock token verification - in production, verify against your auth system
  if (token.startsWith("token_") && token.includes("@")) {
    return NextResponse.json({ valid: true })
  }

  return NextResponse.json({ valid: false }, { status: 401 })
}
