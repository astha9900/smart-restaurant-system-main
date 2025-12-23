"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ShoppingCartProps {
  items: any[]
  onRemove: (itemId: number) => void
  onUpdateQuantity: (itemId: number, quantity: number) => void
}

export function ShoppingCart({ items, onRemove, onUpdateQuantity }: ShoppingCartProps) {
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [specialNotes, setSpecialNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Your cart is empty")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          tableId: orderType === "dine-in" ? 1 : null,
          orderType,
          items,
          specialNotes,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Order placed successfully! Order ID: " + data.order.id)
        items.forEach((item) => onRemove(item.id))
        setSpecialNotes("")
      }
    } catch (error) {
      alert("Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Order Summary</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-foreground/60">${item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded bg-surface hover:bg-surface-light text-foreground"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded bg-surface hover:bg-surface-light text-foreground"
                  >
                    +
                  </button>
                  <span className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-2 px-3 py-1 rounded bg-error/20 text-error hover:bg-error/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-surface-light border-border p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-4 text-primary">Checkout</h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
              >
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Notes</label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Any special requests..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"
              />
            </div>
          </div>

          <div className="space-y-2 pb-4 border-b border-border mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span className="text-primary">${(total * 1.1).toFixed(2)}</span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || items.length === 0}
            className="w-full bg-primary hover:bg-primary-dark text-background font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
