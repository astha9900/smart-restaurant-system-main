"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OrderQueue } from "./order-queue"
import { StaffInventoryAlerts } from "./staff-inventory-alerts"
import { KitchenStats } from "./kitchen-stats"

interface KitchenDashboardProps {
  user: { email: string; role: string; name: string }
  onLogout: () => void
}

export function KitchenDashboard({ user, onLogout }: KitchenDashboardProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "alerts" | "stats">("queue")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-surface-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">RestroBuddy</h1>
            <p className="text-sm text-foreground/60">Kitchen Dashboard</p>
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
          {(["queue", "alerts", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab === "queue" && "🍳 Order Queue"}
              {tab === "alerts" && "⚠️ Low Stock"}
              {tab === "stats" && "📊 Kitchen Stats"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "queue" && <OrderQueue />}
        {activeTab === "alerts" && <StaffInventoryAlerts />}
        {activeTab === "stats" && <KitchenStats />}
      </div>
    </div>
  )
}
