"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AIInsights {
  summary: string
  peakHours: string[]
  topDishes: string[]
  averageOrderValue: number
  recommendations: string[]
  trends: string
}

export function AdminAIInsights() {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("week")

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/order-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orders: [
            { id: 1, total: 42.5, items: ["Pasta", "Salmon"], createdAt: new Date().toISOString() },
            { id: 2, total: 28.75, items: ["Stir Fry"], createdAt: new Date().toISOString() },
          ],
          timeframe,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <Button
          onClick={fetchInsights}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-background px-6 py-2 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Generate AI Insights"}
        </Button>
      </div>

      {insights && (
        <div className="space-y-4">
          {/* Summary */}
          <Card className="bg-surface-light border-border p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Summary</h3>
            <p className="text-foreground">{insights.summary}</p>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-surface-light border-border p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Peak Hours</h3>
              <div className="space-y-2">
                {insights.peakHours.map((hour, i) => (
                  <p key={i} className="text-sm text-foreground">
                    {hour}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="bg-surface-light border-border p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Top Dishes</h3>
              <div className="space-y-2">
                {insights.topDishes.map((dish, i) => (
                  <p key={i} className="text-sm text-foreground">
                    {i + 1}. {dish}
                  </p>
                ))}
              </div>
            </Card>
          </div>

          {/* AOV */}
          <Card className="bg-surface-light border-border p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-accent">${insights.averageOrderValue.toFixed(2)}</p>
          </Card>

          {/* Trends */}
          <Card className="bg-surface-light border-border p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Market Trends</h3>
            <p className="text-foreground">{insights.trends}</p>
          </Card>

          {/* Recommendations */}
          <Card className="bg-surface-light border-border p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">AI Recommendations</h3>
            <ul className="space-y-2">
              {insights.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
