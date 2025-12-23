"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
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
  }, [])

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      const data = await response.json()
      if (data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning",
    confirmed: "bg-primary/20 text-primary",
    preparing: "bg-primary/20 text-primary",
    ready: "bg-success/20 text-success",
    served: "bg-foreground/20 text-foreground",
    cancelled: "bg-error/20 text-error",
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "preparing", "ready", "served", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${
              filter === status ? "bg-primary text-background" : "bg-surface text-foreground hover:bg-surface-light"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="bg-surface-light border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">#{order.id}</td>
                  <td className="px-6 py-4 text-sm capitalize">{order.orderType}</td>
                  <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                  <td className="px-6 py-4 text-sm font-semibold text-accent">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-2 py-1 rounded bg-background border border-border text-foreground text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="served">Served</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
