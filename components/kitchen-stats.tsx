"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function KitchenStats() {
  const hourlyData = [
    { hour: "10:00", prepared: 5, pending: 2 },
    { hour: "11:00", prepared: 12, pending: 1 },
    { hour: "12:00", prepared: 28, pending: 5 },
    { hour: "13:00", prepared: 22, pending: 3 },
    { hour: "14:00", prepared: 8, pending: 1 },
    { hour: "15:00", prepared: 3, pending: 0 },
    { hour: "16:00", prepared: 6, pending: 1 },
  ]

  const dishPerformance = [
    { name: "Pasta Carbonara", prepared: 12, time: 14 },
    { name: "Grilled Salmon", prepared: 9, time: 16 },
    { name: "Stir Fry", prepared: 15, time: 9 },
    { name: "Spring Rolls", prepared: 18, time: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Orders Today</p>
          <p className="text-3xl font-bold text-primary">76</p>
          <p className="text-xs text-success mt-2">Average prep time: 11min</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">On-Time Delivery</p>
          <p className="text-3xl font-bold text-success">94%</p>
          <p className="text-xs text-success mt-2">↑ 2% from yesterday</p>
        </Card>

        <Card className="bg-surface-light border-border p-6">
          <p className="text-sm text-foreground/60 mb-2">Efficiency Rating</p>
          <p className="text-3xl font-bold text-accent">8.9/10</p>
          <p className="text-xs text-foreground/60 mt-2">Based on today's orders</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Throughput */}
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hourly Throughput</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a4556" />
              <XAxis dataKey="hour" stroke="#e4e4e7" />
              <YAxis stroke="#e4e4e7" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #3a4556", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Legend />
              <Line type="monotone" dataKey="prepared" stroke="#00d9ff" strokeWidth={2} dot={{ fill: "#00d9ff" }} />
              <Line type="monotone" dataKey="pending" stroke="#ff6b35" strokeWidth={2} dot={{ fill: "#ff6b35" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Dish Performance */}
        <Card className="bg-surface-light border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dish Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dishPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a4556" />
              <XAxis dataKey="name" stroke="#e4e4e7" width={100} />
              <YAxis stroke="#e4e4e7" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #3a4556", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Bar dataKey="prepared" fill="#00d9ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="bg-surface-light border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Fastest Dishes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishPerformance
            .sort((a, b) => a.time - b.time)
            .map((dish, i) => (
              <div key={i} className="p-4 bg-background rounded-lg">
                <p className="font-semibold text-foreground">{dish.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-foreground/60">Avg Time</span>
                  <span className="text-lg font-bold text-primary">{dish.time}min</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-foreground/60">Today</span>
                  <span className="text-sm font-semibold text-success">{dish.prepared} orders</span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
