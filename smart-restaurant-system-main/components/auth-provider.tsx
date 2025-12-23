"use client"

import { type ReactNode, useState, useCallback, useEffect } from "react"
import { AuthContext, type User, rolePermissions } from "@/lib/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, action: "login" }),
      })

      const data = await response.json()
      if (data.success) {
        const userData: User = {
          id: Math.random(), // In production, get from API
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        }
        setUser(userData)
        setToken(data.token)

        // Persist to localStorage
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("auth_user", JSON.stringify(userData))
      } else {
        throw new Error(data.error || "Login failed")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }, [])

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user],
  )

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false
      const permissions = rolePermissions[user.role] || []
      return permissions.includes(permission)
    },
    [user],
  )

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
