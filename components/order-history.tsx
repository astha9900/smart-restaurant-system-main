"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface OrderHistoryProps {
  userId: number
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`)
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  if (orders.length === 0) {
    return <div className="text-center py-12 text-foreground/60">No orders yet</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="bg-surface-light border-border p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-foreground/60">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === "pending"
                  ? "bg-warning/20 text-warning"
                  : order.status === "preparing"
                    ? "bg-primary/20 text-primary"
                    : order.status === "ready"
                      ? "bg-success/20 text-success"
                      : "bg-foreground/20 text-foreground"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="mb-3 p-2 bg-background rounded text-sm">
            <p className="font-medium">{order.items.length} items</p>
            {order.items.slice(0, 2).map((item: any, i: number) => (
              <p key={i} className="text-foreground/60 text-xs">
                • {item.name} x{item.quantity}
              </p>
            ))}
            {order.items.length > 2 && <p className="text-foreground/60 text-xs">+{order.items.length - 2} more</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Order Type:</span>
            <span className="font-semibold capitalize">{order.orderType}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-foreground/60">Total:</span>
            <span className="font-semibold text-primary">${order.total.toFixed(2)}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
