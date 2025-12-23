"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"

interface RoleGuardProps {
  children: ReactNode
  roles: string | string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole(roles)) {
    return fallback || null
  }

  return <>{children}</>
}
