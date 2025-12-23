"use client"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { CustomerDashboard } from "@/components/customer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { KitchenDashboard } from "@/components/kitchen-dashboard"
import { Card } from "@/components/ui/card"

export default function Home() {
  const { user, login, logout, isLoading } = useAuth()

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
    return <LoginForm onLogin={login} />
  }

  return (
    <main className="min-h-screen bg-background">
      {user.role === "customer" && <CustomerDashboard user={user} onLogout={logout} />}
      {user.role === "admin" && <AdminDashboard user={user} onLogout={logout} />}
      {user.role === "staff" && <KitchenDashboard user={user} onLogout={logout} />}
    </main>
  )
}
