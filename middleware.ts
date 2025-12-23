import { type NextRequest, NextResponse } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/kitchen", "/dashboard"]

// Role-specific routes
const adminRoutes = ["/admin"]
const kitchenRoutes = ["/kitchen"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const userRole = request.cookies.get("user_role")?.value

  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check role-based access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (kitchenRoutes.some((route) => pathname.startsWith(route))) {
    if (userRole !== "staff") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
