"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { volunteerGroups } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, MapPin, Clock, Phone, User, AlertCircle, Check } from "lucide-react"

type GroupStatus = "Active" | "In Transit" | "Completed"

export default function GroupsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const getStatusColor = (status: GroupStatus) => {
    const colors: Record<GroupStatus, string> = {
      Active: "bg-accent text-accent-foreground",
      "In Transit": "bg-secondary text-secondary-foreground",
      Completed: "bg-muted text-muted-foreground",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusBgColor = (status: GroupStatus) => {
    const colors: Record<GroupStatus, string> = {
      Active: "bg-accent/10",
      "In Transit": "bg-secondary/10",
      Completed: "bg-muted/50",
    }
    return colors[status] || "bg-gray-100"
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Volunteer Groups</h1>
          <p className="text-muted-foreground">
            Join active volunteer groups and coordinate relief efforts in your area.
          </p>
        </div>

        {/* My Groups Section */}
        {joinedGroups.length > 0 && (
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                My Groups ({joinedGroups.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {volunteerGroups
                  .filter((g) => joinedGroups.includes(g.id))
                  .map((group) => (
                    <Badge
                      key={group.id}
                      className="px-3 py-2 bg-accent text-accent-foreground cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      {group.name}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Groups Grid */}
        <div className="grid gap-4">
          {volunteerGroups.map((group) => (
            <Card
              key={group.id}
              className={`border-2 transition-all ${
                selectedGroupId === group.id
                  ? "ring-2 ring-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{group.name}</h3>
                      <Badge className={getStatusColor(group.status as GroupStatus)}>{group.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.task}</p>
                  </div>
                  {joinedGroups.includes(group.id) && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-xs font-semibold text-accent">Joined</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={`rounded-lg p-3 ${getStatusBgColor(group.status as GroupStatus)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Members</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{group.members}</p>
                  </div>

                  <div className={`rounded-lg p-3 ${getStatusBgColor(group.status as GroupStatus)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Zone</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{group.zone}</p>
                  </div>

                  <div className={`rounded-lg p-3 ${getStatusBgColor(group.status as GroupStatus)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{group.status}</p>
                  </div>
                </div>

                {/* Leader Info */}
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Group Leader</p>
                        <p className="text-sm font-semibold text-foreground">{group.leader}</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedGroupId(group.id)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{group.name}</DialogTitle>
                          <DialogDescription>{group.task}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Members</p>
                              <p className="text-lg font-bold text-foreground">{group.members}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Zone</p>
                              <p className="text-lg font-bold text-foreground">{group.zone}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Leader</p>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <User className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-semibold text-foreground">{group.leader}</p>
                                <p className="text-xs text-muted-foreground">{group.contact}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Status</p>
                            <Badge className={getStatusColor(group.status as GroupStatus)}>{group.status}</Badge>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-border">
                            <Button
                              onClick={() => handleJoinGroup(group.id)}
                              className="flex-1"
                              variant={joinedGroups.includes(group.id) ? "destructive" : "default"}
                            >
                              {joinedGroups.includes(group.id) ? "Leave Group" : "Join Group"}
                            </Button>
                            <Button variant="outline" className="flex-1 bg-transparent">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => handleJoinGroup(group.id)}
                  className="w-full"
                  variant={joinedGroups.includes(group.id) ? "outline" : "default"}
                >
                  {joinedGroups.includes(group.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Joined - Click to Leave
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Join This Group
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">{volunteerGroups.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Groups</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-accent">
                {volunteerGroups.filter((g) => g.status === "Active").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Active Now</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-secondary">
                {volunteerGroups.reduce((sum, g) => sum + g.members, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Volunteers</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">{joinedGroups.length}</p>
              <p className="text-xs text-muted-foreground mt-1">My Groups</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
