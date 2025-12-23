"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  available: boolean
  prepTime: number
}

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Spring Rolls", price: 5.99, category: "Appetizers", available: true, prepTime: 5 },
    { id: 2, name: "Bruschetta", price: 6.99, category: "Appetizers", available: true, prepTime: 3 },
    { id: 3, name: "Pasta Carbonara", price: 14.99, category: "Main Courses", available: true, prepTime: 15 },
    { id: 4, name: "Grilled Salmon", price: 18.99, category: "Main Courses", available: false, prepTime: 12 },
    { id: 5, name: "Tiramisu", price: 7.99, category: "Desserts", available: true, prepTime: 2 },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<MenuItem>>({})

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const handleDelete = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setMenuItems(menuItems.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setMenuItems([...menuItems, { id: Date.now(), ...formData } as MenuItem])
    }
    setFormData({})
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => {
          setShowForm(true)
          setEditingId(null)
          setFormData({})
        }}
        className="bg-primary hover:bg-primary-dark text-background px-6 py-2 rounded-lg font-semibold"
      >
        Add New Item
      </Button>

      {showForm && (
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit" : "Add New"} Menu Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                step="0.01"
                required
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
              <select
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              >
                <option value="">Select Category</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Main Courses">Main Courses</option>
                <option value="Desserts">Desserts</option>
              </select>
              <input
                type="number"
                placeholder="Prep Time (minutes)"
                value={formData.prepTime || ""}
                onChange={(e) => setFormData({ ...formData, prepTime: Number.parseInt(e.target.value) })}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-background px-6 py-2 rounded-lg">
                {editingId ? "Update" : "Add"}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-surface hover:bg-surface-light text-foreground px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="bg-surface-light border-border p-4 hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <p className="text-sm text-foreground/60">{item.category}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.available ? "bg-success/20 text-success" : "bg-error/20 text-error"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-bold text-accent">${item.price.toFixed(2)}</p>
                <p className="text-xs text-foreground/60">Prep: {item.prepTime}min</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => toggleAvailability(item.id)}
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold ${
                  item.available
                    ? "bg-error/20 text-error hover:bg-error/30"
                    : "bg-success/20 text-success hover:bg-success/30"
                }`}
              >
                {item.available ? "Disable" : "Enable"}
              </Button>
              <Button
                onClick={() => {
                  setEditingId(item.id)
                  setFormData(item)
                  setShowForm(true)
                }}
                className="flex-1 bg-primary hover:bg-primary-dark text-background px-3 py-2 rounded text-sm font-semibold"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(item.id)}
                className="flex-1 bg-error/20 hover:bg-error/30 text-error px-3 py-2 rounded text-sm font-semibold"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
