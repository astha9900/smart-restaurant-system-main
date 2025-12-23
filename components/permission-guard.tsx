"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"

interface PermissionGuardProps {
  children: ReactNode
  permission: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return fallback || null
  }

  return <>{children}</>
}
