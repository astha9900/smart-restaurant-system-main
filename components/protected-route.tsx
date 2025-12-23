"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string | string[]
  requiredPermission?: string
  fallback?: ReactNode
}

export function ProtectedRoute({ children, requiredRole, requiredPermission, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-surface-light border-border p-8">
          <p className="text-foreground">Loading...</p>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="bg-surface-light border-border p-8 text-center">
            <p className="text-foreground/60">You must be logged in to access this page.</p>
          </Card>
        </div>
      )
    )
  }

  const hasRequiredRole =
    !requiredRole || (Array.isArray(requiredRole) ? requiredRole.includes(user.role) : user.role === requiredRole)
  const hasRequiredPermission = !requiredPermission

  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-surface-light border-border p-8 text-center">
          <p className="text-foreground/60">You don't have the required role to access this page.</p>
        </Card>
      </div>
    )
  }

  if (!hasRequiredPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-surface-light border-border p-8 text-center">
          <p className="text-foreground/60">You don't have the required permissions to access this page.</p>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
