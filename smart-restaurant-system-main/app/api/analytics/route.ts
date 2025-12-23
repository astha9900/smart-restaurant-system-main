import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "week" // week, month, year

  const analytics = {
    totalOrders: 245,
    totalRevenue: 12500.5,
    averageOrderValue: 51.02,
    topDishes: [
      { name: "Pasta Carbonara", orders: 45, revenue: 674.55 },
      { name: "Grilled Salmon", orders: 38, revenue: 721.62 },
      { name: "Vegetable Stir Fry", orders: 32, revenue: 383.68 },
    ],
    occupancyRate: 0.75,
    peakHours: ["12:00-13:00", "18:00-20:00"],
    customerSatisfaction: 4.6,
  }

  return NextResponse.json({ success: true, analytics, period })
}
