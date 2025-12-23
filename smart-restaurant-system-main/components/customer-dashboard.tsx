"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuBrowser } from "./menu-browser"
import { ShoppingCart } from "./shopping-cart"
import { OrderHistory } from "./order-history"

interface CustomerDashboardProps {
  user: { email: string; role: string; name: string }
  onLogout: () => void
}

export function CustomerDashboard({ user, onLogout }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "cart" | "orders">("menu")
  const [cart, setCart] = useState<any[]>([])

  const addToCart = (item: any) => {
    const existing = cart.find((c) => c.id === item.id)
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((c) => c.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map((c) => (c.id === itemId ? { ...c, quantity } : c)))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">RestroBuddy</h1>
            <p className="text-sm text-foreground/60">Customer Portal</p>
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

      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex gap-2">
          {(["menu", "cart", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab === "menu" && "🍽️ Menu"}
              {tab === "cart" && `🛒 Cart (${cart.length})`}
              {tab === "orders" && "📋 My Orders"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "menu" && <MenuBrowser onAddToCart={addToCart} />}
        {activeTab === "cart" && (
          <ShoppingCart items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
        )}
        {activeTab === "orders" && <OrderHistory userId={1} />}
      </div>
    </div>
  )
}
