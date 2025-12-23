"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Recommendation {
  dishName: string
  reason: string
  matchScore: number
  price: number
}

interface AIRecommendationsProps {
  userId: number
  onAddToCart?: (item: any) => void
}

export function AIRecommendations({ userId, onAddToCart }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/dish-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: { dietary: "none", spiceLevel: "medium" },
          orderHistory: [
            { name: "Pasta Carbonara", date: "2025-01-20" },
            { name: "Grilled Salmon", date: "2025-01-18" },
          ],
          availableItems: [
            { name: "Vegetable Stir Fry", price: 11.99 },
            { name: "Tiramisu", price: 7.99 },
            { name: "Spring Rolls", price: 5.99 },
          ],
        }),
      })

      const data = await response.json()
      if (data.success) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-surface-light border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">AI-Powered Recommendations</h3>
        <Button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {loading ? "Loading..." : "Get Suggestions"}
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-foreground/60 text-sm">Click "Get Suggestions" to receive AI-powered dish recommendations</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-foreground">{rec.dishName}</p>
                <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary font-semibold">
                  {rec.matchScore}%
                </span>
              </div>
              <p className="text-sm text-foreground/60 mb-3">{rec.reason}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-accent">${rec.price}</span>
                {onAddToCart && (
                  <Button
                    onClick={() =>
                      onAddToCart({
                        id: i,
                        name: rec.dishName,
                        price: rec.price,
                      })
                    }
                    className="bg-primary hover:bg-primary-dark text-background px-3 py-1 rounded text-xs font-semibold"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
