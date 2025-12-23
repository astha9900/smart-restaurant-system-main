/**
 * Authentication utility functions
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export const hashPassword = async (password: string): Promise<string> => {
  // In production, use bcrypt or similar library
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export const generateToken = (userId: number, email: string): string => {
  // In production, use JWT
  return `token_${userId}_${email}_${Date.now()}`
}

export const parseToken = (token: string): { userId?: number; email?: string } => {
  try {
    const parts = token.split("_")
    if (parts.length >= 3 && parts[0] === "token") {
      return {
        userId: Number.parseInt(parts[1]),
        email: parts[2],
      }
    }
  } catch (error) {
    // Invalid token format
  }
  return {}
}
