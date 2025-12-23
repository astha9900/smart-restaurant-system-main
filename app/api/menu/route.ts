import { NextResponse } from "next/server"

// Mock menu data
const menuData = [
  {
    id: 1,
    category: "Appetizers",
    items: [
      {
        id: 101,
        name: "Spring Rolls",
        price: 5.99,
        description: "Fresh spring rolls with peanut sauce",
        prep_time: 5,
        allergens: ["peanuts"],
      },
      {
        id: 102,
        name: "Bruschetta",
        price: 6.99,
        description: "Toasted bread with tomatoes",
        prep_time: 3,
        allergens: [],
      },
    ],
  },
  {
    id: 2,
    category: "Main Courses",
    items: [
      {
        id: 201,
        name: "Pasta Carbonara",
        price: 14.99,
        description: "Classic Italian pasta",
        prep_time: 15,
        allergens: ["eggs", "dairy"],
      },
      {
        id: 202,
        name: "Grilled Salmon",
        price: 18.99,
        description: "Fresh salmon with lemon butter",
        prep_time: 12,
        allergens: ["fish"],
      },
      {
        id: 203,
        name: "Vegetable Stir Fry",
        price: 11.99,
        description: "Mixed vegetables with soy sauce",
        prep_time: 10,
        allergens: ["soy"],
      },
    ],
  },
  {
    id: 3,
    category: "Desserts",
    items: [
      {
        id: 301,
        name: "Tiramisu",
        price: 7.99,
        description: "Classic Italian dessert",
        prep_time: 2,
        allergens: ["eggs", "dairy"],
      },
      {
        id: 302,
        name: "Chocolate Cake",
        price: 6.99,
        description: "Rich chocolate cake",
        prep_time: 2,
        allergens: ["dairy", "gluten"],
      },
    ],
  },
]

export async function GET() {
  return NextResponse.json({ success: true, menu: menuData })
}
