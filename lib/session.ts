/**
 * Session management utilities
 */

export interface Session {
  userId: number
  email: string
  name: string
  role: "customer" | "admin" | "staff"
  token: string
  expiresAt: number
}

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const createSession = (userId: number, email: string, name: string, role: string, token: string): Session => {
  return {
    userId,
    email,
    name,
    role: role as "customer" | "admin" | "staff",
    token,
    expiresAt: Date.now() + SESSION_DURATION,
  }
}

export const isSessionValid = (session: Session): boolean => {
  return Date.now() < session.expiresAt
}

export const saveSession = (session: Session): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("session", JSON.stringify(session))
  }
}

export const getSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null
  }

  const sessionStr = sessionStorage.getItem("session")
  if (!sessionStr) {
    return null
  }

  try {
    const session = JSON.parse(sessionStr) as Session
    if (isSessionValid(session)) {
      return session
    } else {
      sessionStorage.removeItem("session")
      return null
    }
  } catch (error) {
    sessionStorage.removeItem("session")
    return null
  }
}

export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("session")
  }
}
