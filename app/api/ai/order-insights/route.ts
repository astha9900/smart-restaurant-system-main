import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { orders, timeframe } = body

  try {
    const prompt = `You are a restaurant business intelligence AI. Analyze these orders and provide insights.

Orders (${timeframe}): ${JSON.stringify(orders)}

Provide analysis in JSON format with: {
  "summary": "brief summary of trends",
  "peakHours": ["array of peak hours"],
  "topDishes": ["array of top 3 dishes"],
  "averageOrderValue": number,
  "recommendations": ["array of actionable recommendations"],
  "trends": "description of notable trends"
}

Only return valid JSON, no additional text.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.6,
    })

    const insights = JSON.parse(text)
    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error("AI order insights error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate insights" }, { status: 500 })
  }
}
