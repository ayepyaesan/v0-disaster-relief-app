"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  assignedArea: string
  contact: string
  reportsSubmitted: number
  groupsJoined: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    if (email && password) {
      setUser({
        id: "1",
        name: "Sarah Johnson",
        email,
        role: "Medical",
        assignedArea: "Dagon Township",
        contact: "+95 9 123 456 789",
        reportsSubmitted: 5,
        groupsJoined: 2,
      })
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
