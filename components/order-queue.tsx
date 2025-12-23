"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OrderItem {
  id: number
  orderId: number
  orderType: string
  items: Array<{ name: string; quantity: number; specialInstructions?: string }>
  status: "pending" | "confirmed" | "preparing" | "ready" | "served"
  prepTime: number
  createdAt: string
  priority: "low" | "medium" | "high"
}

export function OrderQueue() {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 1,
      orderId: 101,
      orderType: "dine-in",
      items: [
        { name: "Pasta Carbonara", quantity: 2, specialInstructions: "Extra parmesan" },
        { name: "Grilled Salmon", quantity: 1 },
      ],
      status: "pending",
      prepTime: 15,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      priority: "high",
    },
    {
      id: 2,
      orderId: 102,
      orderType: "takeaway",
      items: [{ name: "Vegetable Stir Fry", quantity: 1 }],
      status: "confirmed",
      prepTime: 10,
      createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
      priority: "medium",
    },
    {
      id: 3,
      orderId: 103,
      orderType: "dine-in",
      items: [{ name: "Spring Rolls", quantity: 3 }],
      status: "preparing",
      prepTime: 5,
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
      priority: "medium",
    },
  ])

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o)))
  }

  const getTimeRemaining = (createdAt: string, prepTime: number) => {
    const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000 / 60)
    const remaining = Math.max(0, prepTime - elapsed)
    return remaining
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-error/20 text-error border-error/50"
      case "medium":
        return "bg-warning/20 text-warning border-warning/50"
      case "low":
        return "bg-success/20 text-success border-success/50"
      default:
        return "bg-foreground/10 text-foreground border-border"
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning",
    confirmed: "bg-primary/20 text-primary",
    preparing: "bg-primary/20 text-primary",
    ready: "bg-success/20 text-success",
    served: "bg-foreground/20 text-foreground",
  }

  // Sort orders: pending first, then by priority
  const sortedOrders = [...orders].sort((a, b) => {
    const statusPriority = { pending: 0, confirmed: 1, preparing: 2, ready: 3, served: 4 }
    const priorityValue = { high: 0, medium: 1, low: 2 }
    if (
      statusPriority[a.status as keyof typeof statusPriority] !==
      statusPriority[b.status as keyof typeof statusPriority]
    ) {
      return (
        statusPriority[a.status as keyof typeof statusPriority] -
        statusPriority[b.status as keyof typeof statusPriority]
      )
    }
    return (
      priorityValue[a.priority as keyof typeof priorityValue] - priorityValue[b.priority as keyof typeof priorityValue]
    )
  })

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Orders in Queue</p>
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
        </Card>
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Pending</p>
          <p className="text-3xl font-bold text-warning">{orders.filter((o) => o.status === "pending").length}</p>
        </Card>
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Preparing</p>
          <p className="text-3xl font-bold text-primary">{orders.filter((o) => o.status === "preparing").length}</p>
        </Card>
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Ready</p>
          <p className="text-3xl font-bold text-success">{orders.filter((o) => o.status === "ready").length}</p>
        </Card>
      </div>

      {/* Order Queue */}
      <div className="space-y-3">
        {sortedOrders.length === 0 ? (
          <Card className="bg-surface-light border-border p-8 text-center">
            <p className="text-foreground/60">No orders in queue</p>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const timeRemaining = getTimeRemaining(order.createdAt, order.prepTime)
            return (
              <Card
                key={order.id}
                className={`border-l-4 p-4 bg-surface-light ${
                  order.status === "pending" ? "border-l-error" : "border-l-primary"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-primary">#{order.orderId}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}
                      >
                        {order.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-foreground/10 text-foreground">
                        {order.orderType}
                      </span>
                    </div>

                    <div className="mb-3 space-y-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-foreground">
                          <span className="font-semibold">
                            {item.quantity}x {item.name}
                          </span>
                          {item.specialInstructions && (
                            <span className="text-foreground/60 ml-2">({item.specialInstructions})</span>
                          )}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground/60">Time Remaining:</span>
                        <span className={`font-semibold ${timeRemaining <= 5 ? "text-error" : "text-success"}`}>
                          {timeRemaining}m
                        </span>
                      </div>
                      <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            timeRemaining <= 5 ? "bg-error" : timeRemaining <= 10 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${Math.max(0, (timeRemaining / order.prepTime) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {order.status === "pending" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded font-semibold text-sm"
                      >
                        Accept
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded font-semibold text-sm"
                      >
                        Start
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        className="bg-success hover:bg-success/80 text-background px-4 py-2 rounded font-semibold text-sm"
                      >
                        Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "served")}
                        className="bg-foreground/20 hover:bg-foreground/30 text-foreground px-4 py-2 rounded font-semibold text-sm"
                      >
                        Served
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
