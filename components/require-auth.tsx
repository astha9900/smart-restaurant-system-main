"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"

interface RequireAuthProps {
  children: ReactNode
  roles?: string[]
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-surface-light border-border p-8">
          <p className="text-foreground">Authenticating...</p>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="bg-surface-light border-border p-8 text-center">
          <p className="text-error font-semibold">Access Denied</p>
          <p className="text-foreground/60 text-sm mt-2">You don't have permission to access this page.</p>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
