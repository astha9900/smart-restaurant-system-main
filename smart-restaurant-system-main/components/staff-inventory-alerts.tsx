"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AlertItem {
  id: number
  name: string
  currentStock: number
  reorderLevel: number
  suggestedAlternative?: string
  severity: "critical" | "warning"
}

export function StaffInventoryAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      name: "Salmon Fillets",
      currentStock: 3,
      reorderLevel: 15,
      suggestedAlternative: "Use Tilapia as substitute",
      severity: "critical",
    },
    {
      id: 2,
      name: "Mixed Vegetables",
      currentStock: 0,
      reorderLevel: 30,
      suggestedAlternative: "Use frozen mixed vegetables",
      severity: "critical",
    },
    {
      id: 3,
      name: "Tomato Sauce",
      currentStock: 8,
      reorderLevel: 20,
      suggestedAlternative: "None available",
      severity: "warning",
    },
  ])

  const severityColors: Record<string, string> = {
    critical: "bg-error/20 text-error border-error/50",
    warning: "bg-warning/20 text-warning border-warning/50",
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Total Alerts</p>
          <p className="text-3xl font-bold text-warning">{alerts.length}</p>
        </Card>
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Critical</p>
          <p className="text-3xl font-bold text-error">{alerts.filter((a) => a.severity === "critical").length}</p>
        </Card>
        <Card className="bg-surface-light border-border p-4">
          <p className="text-sm text-foreground/60 mb-1">Warnings</p>
          <p className="text-3xl font-bold text-warning">{alerts.filter((a) => a.severity === "warning").length}</p>
        </Card>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 p-6 bg-surface-light border-l-error`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold text-foreground">{alert.name}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[alert.severity]}`}
                  >
                    {alert.severity === "critical" ? "🔴 CRITICAL" : "⚠️ WARNING"}
                  </span>
                </div>
                <p className="text-sm text-foreground/60">
                  Stock Level: {alert.currentStock} / {alert.reorderLevel}
                </p>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${alert.currentStock <= 5 ? "bg-error" : "bg-warning"}`}
                  style={{ width: `${Math.min((alert.currentStock / alert.reorderLevel) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Suggested Alternative */}
            {alert.suggestedAlternative && (
              <Card className="bg-background border-border p-3 mb-4">
                <p className="text-xs text-foreground/60 mb-1">Suggested Alternative:</p>
                <p className="text-sm font-semibold text-primary">{alert.suggestedAlternative}</p>
              </Card>
            )}

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded font-semibold">
                Notify Admin
              </Button>
              <Button className="flex-1 bg-surface hover:bg-surface-light text-foreground px-4 py-2 rounded font-semibold">
                Use Alternative
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
