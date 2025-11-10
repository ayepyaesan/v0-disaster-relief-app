"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }
      if (!email.includes("@")) {
        setError("Please enter a valid email")
        return
      }

      await login(email, password)
      router.push("/home")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-2xl font-bold">
              DR
            </div>
            <h1 className="text-2xl font-bold text-foreground text-balance">Disaster Relief Volunteer Portal</h1>
            <p className="text-sm text-muted-foreground">Sign in to access relief operations</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                type="email"
                placeholder="volunteer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
            <p className="text-xs text-muted-foreground">Email: volunteer@example.com</p>
            <p className="text-xs text-muted-foreground">Password: any password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
