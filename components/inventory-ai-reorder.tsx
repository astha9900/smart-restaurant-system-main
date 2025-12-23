"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InventoryPrediction {
  itemName: string
  currentStock: number
  predictedUsage: number
  recommendedReorderQuantity: number
  priority: "critical" | "high" | "medium" | "low"
  daysUntilStockout: number
}

export function InventoryAIReorder() {
  const [predictions, setPredictions] = useState<InventoryPrediction[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/inventory-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentInventory: [
            { name: "Salmon", quantity: 8 },
            { name: "Pasta", quantity: 45 },
            { name: "Vegetables", quantity: 0 },
          ],
          salesHistory: [
            { date: "2025-01-20", itemsSold: { Salmon: 5, Pasta: 10 } },
            { date: "2025-01-19", itemsSold: { Salmon: 6, Pasta: 8 } },
          ],
          menuItems: [{ name: "Salmon Dish", ingredient: "Salmon", quantity: 1 }],
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error("Failed to fetch predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  const priorityColors: Record<string, string> = {
    critical: "bg-error/20 text-error",
    high: "bg-warning/20 text-warning",
    medium: "bg-primary/20 text-primary",
    low: "bg-success/20 text-success",
  }

  return (
    <Card className="bg-surface-light border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">AI Inventory Predictions</h3>
        <Button
          onClick={fetchPredictions}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {loading ? "Analyzing..." : "Run Prediction"}
        </Button>
      </div>

      {predictions.length === 0 ? (
        <p className="text-foreground/60 text-sm">Click "Run Prediction" for AI-powered inventory forecasting</p>
      ) : (
        <div className="space-y-3">
          {predictions.map((pred, i) => (
            <div key={i} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{pred.itemName}</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    Current: {pred.currentStock} | Usage: {pred.predictedUsage}/day
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[pred.priority]}`}>
                  {pred.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/60">Days until stockout</p>
                  <p className="text-lg font-bold text-accent">{pred.daysUntilStockout}</p>
                </div>
                <Button className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded font-semibold text-sm">
                  Reorder {pred.recommendedReorderQuantity}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
