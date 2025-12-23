import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, preferences, orderHistory, availableItems } = body

  try {
    const prompt = `You are a restaurant AI assistant. Based on the following customer information, provide 3 personalized dish recommendations in JSON format.

Customer Preferences: ${JSON.stringify(preferences)}
Previous Orders: ${JSON.stringify(orderHistory)}
Available Menu Items: ${JSON.stringify(availableItems)}

Return a JSON array with exactly 3 recommendations. Each recommendation should have: {
  "dishName": "string",
  "reason": "string explaining why this recommendation",
  "matchScore": number between 0-100,
  "price": number
}

Only return valid JSON, no additional text.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.7,
    })

    const recommendations = JSON.parse(text)
    return NextResponse.json({ success: true, recommendations })
  } catch (error) {
    console.error("AI recommendation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate recommendations" }, { status: 500 })
  }
}
