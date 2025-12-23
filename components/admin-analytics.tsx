"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics?period=week")
        const data = await response.json()
        if (data.success) {
          setAnalytics(data.analytics)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12">Failed to load analytics</div>
  }

  // Mock data for charts
  const dailyData = [
    { day: "Mon", orders: 32, revenue: 2400 },
    { day: "Tue", orders: 45, revenue: 2800 },
    { day: "Wed", orders: 38, revenue: 2600 },
    { day: "Thu", orders: 52, revenue: 3200 },
    { day: "Fri", orders: 68, revenue: 4100 },
    { day: "Sat", orders: 72, revenue: 4500 },
    { day: "Sun", orders: 38, revenue: 2300 },
  ]

  const topDishesData = analytics.topDishes || []

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{analytics.totalOrders}</p>
          <p className="text-xs text-success mt-2">↑ 12% from last week</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-accent">${analytics.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-success mt-2">↑ 8% from last week</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Average Order Value</p>
          <p className="text-3xl font-bold text-primary">${analytics.averageOrderValue.toFixed(2)}</p>
          <p className="text-xs text-foreground/60 mt-2">Per transaction</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Occupancy Rate</p>
          <p className="text-3xl font-bold text-success">{(analytics.occupancyRate * 100).toFixed(0)}%</p>
          <p className="text-xs text-foreground/60 mt-2">Tables in use</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders & Revenue */}
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a4556" />
              <XAxis dataKey="day" stroke="#e4e4e7" />
              <YAxis stroke="#e4e4e7" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #3a4556", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#00d9ff" strokeWidth={2} dot={{ fill: "#00d9ff" }} />
              <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2} dot={{ fill: "#ff6b35" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Dishes */}
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top 3 Dishes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDishesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a4556" />
              <XAxis dataKey="name" stroke="#e4e4e7" />
              <YAxis stroke="#e4e4e7" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #3a4556", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Bar dataKey="orders" fill="#00d9ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Peak Hours & Customer Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {analytics.peakHours?.map((hour: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-foreground">{hour}</span>
                <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent-light"
                    style={{ width: `${75 - index * 15}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Satisfaction</h3>
          <div className="flex items-end justify-center gap-2 h-64">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{analytics.customerSatisfaction}</div>
              <p className="text-sm text-foreground/60 mt-2">out of 5.0</p>
              <div className="text-2xl mt-4">★★★★★</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
