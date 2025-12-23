"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  reorderLevel: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Pasta", quantity: 45, reorderLevel: 20, status: "in-stock" },
    { id: 2, name: "Salmon Fillets", quantity: 8, reorderLevel: 15, status: "low-stock" },
    { id: 3, name: "Mixed Vegetables", quantity: 0, reorderLevel: 30, status: "out-of-stock" },
    { id: 4, name: "Olive Oil", quantity: 35, reorderLevel: 10, status: "in-stock" },
    { id: 5, name: "Tomato Sauce", quantity: 12, reorderLevel: 20, status: "low-stock" },
    { id: 6, name: "Mozzarella", quantity: 60, reorderLevel: 25, status: "in-stock" },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const status =
            newQuantity === 0 ? "out-of-stock" : newQuantity <= item.reorderLevel ? "low-stock" : "in-stock"
          return { ...item, quantity: newQuantity, status }
        }
        return item
      }),
    )
  }

  const statusColors: Record<string, string> = {
    "in-stock": "bg-success/20 text-success",
    "low-stock": "bg-warning/20 text-warning",
    "out-of-stock": "bg-error/20 text-error",
  }

  const lowStockItems = inventory.filter((item) => item.status !== "in-stock")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Items</p>
          <p className="text-3xl font-bold text-primary">{inventory.length}</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">In Stock</p>
          <p className="text-3xl font-bold text-success">{inventory.filter((i) => i.status === "in-stock").length}</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Low Stock Alert</p>
          <p className="text-3xl font-bold text-warning">{lowStockItems.length}</p>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="bg-surface-light border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Current Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{item.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                      min="0"
                      className="w-20 px-2 py-1 rounded bg-background border border-border text-foreground text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">{item.reorderLevel}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
                      {item.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.status !== "in-stock" && (
                      <Button className="bg-primary hover:bg-primary-dark text-background px-3 py-1 rounded text-xs font-semibold">
                        Reorder
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Reorder Suggestions */}
      <Card className="bg-surface-light border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Reorder Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="p-4 bg-background rounded-lg border border-border">
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="text-sm text-foreground/60 mt-1">
                Current: {item.quantity} | Recommended: {item.reorderLevel}
              </p>
              <Button className="mt-3 bg-accent hover:bg-accent-light text-background px-4 py-2 rounded text-sm font-semibold w-full">
                Order Now
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
