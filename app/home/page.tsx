"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { reliefCenters, volunteerGroups } from "@/lib/mock-data"
import { MapView } from "@/components/map-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertCircle, Navigation, Plus, Search } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Prepare map markers
  const mapMarkers = [
    ...reliefCenters.map((center) => ({
      id: center.id,
      lat: center.lat,
      lng: center.lng,
      name: center.name,
      type: "center" as const,
      color: "#22c55e", // Green
    })),
    ...volunteerGroups.map((group) => ({
      id: group.id,
      lat: 16.8661 + Math.random() * 0.1 - 0.05, // Mock variation
      lng: 96.1951 + Math.random() * 0.1 - 0.05,
      name: group.name,
      type: "group" as const,
      color: "#3b82f6", // Blue
    })),
    {
      id: "disaster-1",
      lat: 16.88,
      lng: 96.19,
      name: "Disaster Zone A",
      type: "disaster" as const,
      color: "#ef4444", // Red
    },
    {
      id: "disaster-2",
      lat: 16.87,
      lng: 96.21,
      name: "Disaster Zone B",
      type: "disaster" as const,
      color: "#ef4444", // Red
    },
  ]

  const nearestCenters = reliefCenters.slice(0, 3)
  const activeCenters = reliefCenters.filter((c) => c.status === "Available")

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Live Disaster Relief Map</h1>
              <p className="text-muted-foreground max-w-lg">
                Real-time view of disaster zones, relief centers, and active volunteer groups in your area. Use the map
                to coordinate relief efforts and respond to emergencies.
              </p>
            </div>
            <AlertCircle className="h-12 w-12 text-primary flex-shrink-0" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={() => router.push("/reports")} className="h-12 text-base gap-2">
            <Plus className="h-5 w-5" />
            Post Report
          </Button>
          <Button variant="outline" onClick={() => router.push("/centers")} className="h-12 text-base gap-2">
            <MapPin className="h-5 w-5" />
            Find Center
          </Button>
          <Button variant="outline" className="h-12 text-base gap-2 bg-transparent">
            <Navigation className="h-5 w-5" />
            My Location
          </Button>
          <Button variant="outline" onClick={() => router.push("/groups")} className="h-12 text-base gap-2">
            <Search className="h-5 w-5" />
            Join Group
          </Button>
        </div>

        {/* Map */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Disaster Relief Map</CardTitle>
            <CardDescription>Green: Relief Centers | Blue: Volunteer Groups | Red: Disaster Zones</CardDescription>
          </CardHeader>
          <CardContent>
            <MapView markers={mapMarkers} />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Active Relief Centers</p>
                <p className="text-3xl font-bold text-accent">{activeCenters.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Ready to serve</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Volunteer Groups</p>
                <p className="text-3xl font-bold text-secondary">{volunteerGroups.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Operating</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Volunteers</p>
                <p className="text-3xl font-bold text-primary">
                  {volunteerGroups.reduce((sum, g) => sum + g.members, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">In field</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nearest Centers */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Nearest Relief Centers</CardTitle>
            <CardDescription>Get directions or contact for immediate assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearestCenters.map((center) => (
                <div
                  key={center.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        center.status === "Available" ? "bg-accent/20" : "bg-destructive/20"
                      }`}
                    >
                      <MapPin
                        className={`h-5 w-5 ${center.status === "Available" ? "text-accent" : "text-destructive"}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{center.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {center.type} • {center.distance} away
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {center.currentOccupancy}/{center.capacity} people
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        center.status === "Available" ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {center.status}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
