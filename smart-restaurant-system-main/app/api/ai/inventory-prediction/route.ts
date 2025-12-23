import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { currentInventory, salesHistory, menuItems } = body

  try {
    const prompt = `You are a restaurant inventory management AI. Analyze the current inventory, historical sales data, and menu items to predict which items need reordering.

Current Inventory: ${JSON.stringify(currentInventory)}
Sales History (last 7 days): ${JSON.stringify(salesHistory)}
Menu Items: ${JSON.stringify(menuItems)}

Provide predictions in JSON format with an array of items. For each item include: {
  "itemName": "string",
  "currentStock": number,
  "predictedUsage": number,
  "recommendedReorderQuantity": number,
  "priority": "critical" | "high" | "medium" | "low",
  "daysUntilStockout": number
}

Only return valid JSON, no additional text.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.5,
    })

    const predictions = JSON.parse(text)
    return NextResponse.json({ success: true, predictions })
  } catch (error) {
    console.error("AI inventory prediction error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate predictions" }, { status: 500 })
  }
}
