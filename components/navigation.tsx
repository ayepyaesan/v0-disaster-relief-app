"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Users, Package, FileText, Megaphone, User, LogOut, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Navigation() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated || pathname === "/login") {
    return null
  }

  const navItems = [
    { href: "/home", label: "Map", icon: MapPin },
    { href: "/centers", label: "Centers", icon: Package },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/supplies", label: "Supplies", icon: Package },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/announcements", label: "Feed", icon: Megaphone },
    { href: "/safety", label: "Safety", icon: AlertTriangle },
  ]

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              DR
            </div>
            <h1 className="text-xl font-bold text-foreground">Disaster Relief Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">{user?.name}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-destructive/10 text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto border-t border-border px-4 md:px-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </header>
    </>
  )
}
