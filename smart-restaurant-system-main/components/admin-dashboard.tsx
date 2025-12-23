"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AdminAnalytics } from "./admin-analytics"
import { OrderManagement } from "./order-management"
import { InventoryManagement } from "./inventory-management"
import { MenuManagement } from "./menu-management"

interface AdminDashboardProps {
  user: { email: string; role: string; name: string }
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "inventory" | "menu">("analytics")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-surface-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">RestroBuddy</h1>
            <p className="text-sm text-foreground/60">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-foreground/60">{user.email}</p>
            </div>
            <Button onClick={onLogout} className="bg-error hover:bg-error/80 text-white px-4 py-2 rounded-lg">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex gap-2">
          {(["analytics", "orders", "inventory", "menu"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab === "analytics" && "📊 Analytics"}
              {tab === "orders" && "📋 Orders"}
              {tab === "inventory" && "📦 Inventory"}
              {tab === "menu" && "🍽️ Menu"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "orders" && <OrderManagement />}
        {activeTab === "inventory" && <InventoryManagement />}
        {activeTab === "menu" && <MenuManagement />}
      </div>
    </div>
  )
}
