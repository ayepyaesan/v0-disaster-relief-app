"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { announcements } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, AlertTriangle, TrendingUp, HelpCircle, Clock, User, Heart, MessageCircle } from "lucide-react"

type AnnouncementType = "Alert" | "Update" | "Request"

export default function AnnouncementsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [filterType, setFilterType] = useState<string>("all")
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const filteredAnnouncements =
    filterType === "all" ? announcements : announcements.filter((a) => a.type === filterType)

  const getTypeIcon = (type: AnnouncementType) => {
    const icons: Record<AnnouncementType, React.ReactNode> = {
      Alert: <AlertTriangle className="h-5 w-5" />,
      Update: <TrendingUp className="h-5 w-5" />,
      Request: <HelpCircle className="h-5 w-5" />,
    }
    return icons[type] || <Megaphone className="h-5 w-5" />
  }

  const getTypeColor = (type: AnnouncementType) => {
    const colors: Record<AnnouncementType, string> = {
      Alert: "bg-red-100 text-red-800",
      Update: "bg-blue-100 text-blue-800",
      Request: "bg-amber-100 text-amber-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getTypeBgColor = (type: AnnouncementType) => {
    const colors: Record<AnnouncementType, string> = {
      Alert: "bg-red-100/50",
      Update: "bg-blue-100/50",
      Request: "bg-amber-100/50",
    }
    return colors[type] || "bg-gray-100/50"
  }

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Community Feed</h1>
          <p className="text-muted-foreground">
            Stay updated with official announcements and volunteer community messages.
          </p>
        </div>

        {/* Type Filter */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <label className="block text-sm font-medium text-foreground mb-3">Filter by Type</label>
          <div className="flex flex-wrap gap-2">
            {["all", "Alert", "Update", "Request"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filterType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type === "all" ? (
                  <>
                    <Megaphone className="h-4 w-4" />
                    All Posts
                  </>
                ) : type === "Alert" ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Alerts
                  </>
                ) : type === "Update" ? (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    Updates
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4" />
                    Requests
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((post) => (
              <Card
                key={post.id}
                className={`border-2 transition-all hover:shadow-lg ${getTypeBgColor(post.type as AnnouncementType)}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(post.type as AnnouncementType)}>
                          {getTypeIcon(post.type as AnnouncementType)}
                          <span className="ml-1">{post.type}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(post.timestamp)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">{post.content}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`gap-2 ${
                        likedPosts.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                      <span className="text-xs">Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">Reply</span>
                    </Button>
                    {(post.type === "Alert" || post.type === "Request") && (
                      <Button variant="outline" size="sm" className="ml-auto gap-2 bg-transparent">
                        {post.type === "Request" ? "Help" : "Acknowledge"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements in this category.</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="border border-border bg-alert/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Emergency Alerts</p>
                  <p className="text-xs text-muted-foreground">Critical safety information about disaster zones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-info/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Updates</p>
                  <p className="text-xs text-muted-foreground">Relief operations status and center availability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Requests</p>
                  <p className="text-xs text-muted-foreground">Help needed from volunteer community</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
