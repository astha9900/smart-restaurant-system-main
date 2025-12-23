import { type NextRequest, NextResponse } from "next/server"

const orders: any[] = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")

  let filtered = orders
  if (userId) filtered = filtered.filter((o) => o.userId.toString() === userId)
  if (status) filtered = filtered.filter((o) => o.status === status)

  return NextResponse.json({ success: true, orders: filtered })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, tableId, orderType, items, specialNotes } = body

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

  const newOrder = {
    id: orders.length + 1,
    userId,
    tableId,
    orderType,
    items,
    total,
    specialNotes,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  orders.push(newOrder)
  return NextResponse.json({ success: true, order: newOrder })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { orderId, status } = body

  const order = orders.find((o) => o.id === orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
    return NextResponse.json({ success: true, order })
  }

  return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
}
