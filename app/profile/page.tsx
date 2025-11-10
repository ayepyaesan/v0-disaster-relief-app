"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Award, Users, Edit2, Check, X, FileText } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
      })
    }
  }, [isAuthenticated, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, this would update the user data via an API
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Medical: "bg-red-100 text-red-800",
      Rescue: "bg-orange-100 text-orange-800",
      Logistics: "bg-blue-100 text-blue-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            variant={isEditing ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-2 border-border">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <Badge className={`mt-2 ${getRoleColor(user.role)}`}>{user.role} Team</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  {isEditing ? (
                    <Input name="email" value={formData.email} onChange={handleInputChange} className="mt-1" />
                  ) : (
                    <p className="text-foreground mt-1">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Phone Number</label>
                  {isEditing ? (
                    <Input name="contact" value={formData.contact} onChange={handleInputChange} className="mt-1" />
                  ) : (
                    <p className="text-foreground mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {user.contact}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <Input name="name" value={formData.name} onChange={handleInputChange} className="mt-1" />
                  ) : (
                    <p className="text-foreground mt-1">{user.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Assignment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Area</p>
                  <p className="text-foreground font-medium mt-1">{user.assignedArea}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-foreground font-medium mt-1">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="font-semibold text-foreground">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-accent/10 p-4 border border-accent">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Reports Submitted</span>
                  </div>
                  <p className="text-2xl font-bold text-accent">{user.reportsSubmitted}</p>
                </div>
                <div className="rounded-lg bg-secondary/10 p-4 border border-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-muted-foreground">Groups Joined</span>
                  </div>
                  <p className="text-2xl font-bold text-secondary">{user.groupsJoined}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Volunteer Activity Level
                </h3>
                <span className="text-sm font-bold text-primary">{Math.min(user.reportsSubmitted * 20, 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all"
                  style={{ width: `${Math.min(user.reportsSubmitted * 20, 100)}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
