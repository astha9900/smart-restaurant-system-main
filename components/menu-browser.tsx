"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MenuBrowserProps {
  onAddToCart: (item: any) => void
}

export function MenuBrowser({ onAddToCart }: MenuBrowserProps) {
  const [menu, setMenu] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/menu")
        const data = await response.json()
        if (data.success) {
          setMenu(data.menu)
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading menu...</div>
  }

  const selectedCategoryItems = menu.find((c) => c.id === selectedCategory)?.items || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Categories */}
      <div className="lg:col-span-1">
        <Card className="bg-surface-light border-border p-4">
          <h3 className="text-lg font-semibold mb-4 text-primary">Categories</h3>
          <div className="space-y-2">
            {menu.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-background font-semibold"
                    : "bg-background text-foreground hover:bg-surface"
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCategoryItems.map((item) => (
            <Card key={item.id} className="bg-surface-light border-border p-4 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground">{item.name}</h4>
                  <p className="text-sm text-foreground/60 mt-1">{item.description}</p>
                </div>
              </div>

              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {item.allergens.map((allergen: string) => (
                    <span key={allergen} className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                      ⚠️ {allergen}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">${item.price}</span>
                  <span className="text-xs text-foreground/60">🕐 {item.prep_time}min</span>
                </div>
                <Button
                  onClick={() => onAddToCart(item)}
                  className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg font-medium"
                >
                  Add
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
