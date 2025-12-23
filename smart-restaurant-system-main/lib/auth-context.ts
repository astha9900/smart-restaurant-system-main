"use client"

import { createContext, useContext } from "react"

export interface User {
  id: number
  email: string
  name: string
  role: "customer" | "admin" | "staff"
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (role: string | string[]) => boolean
  hasPermission: (permission: string) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const rolePermissions: Record<string, string[]> = {
  customer: ["view_menu", "place_order", "view_own_orders", "make_reservation", "view_profile"],
  admin: [
    "view_menu",
    "manage_menu",
    "view_orders",
    "manage_orders",
    "view_inventory",
    "manage_inventory",
    "view_analytics",
    "manage_staff",
    "manage_tables",
    "view_all_orders",
  ],
  staff: ["view_queue", "update_order_status", "view_inventory_alerts", "view_kitchen_stats", "manage_prep"],
}
