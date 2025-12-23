import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userPreferences, orderHistory, menuItems } = body

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Based on the user's preferences: ${JSON.stringify(userPreferences)}, previous orders: ${JSON.stringify(orderHistory)}, and available menu items: ${JSON.stringify(menuItems)}, provide 3 personalized dish recommendations with brief explanations. Format as JSON array.`,
    })

    const recommendations = JSON.parse(text)
    return NextResponse.json({ success: true, recommendations })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate recommendations" }, { status: 500 })
  }
}
