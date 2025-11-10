"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { reliefCenters } from "@/lib/mock-data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

type CenterStatus = "Available" | "Full"
type CenterType = "Shelter" | "Medical" | "Food"

export default function CentersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const filteredCenters = reliefCenters.filter((center) => {
    const typeMatch = filterType === "all" || center.type === filterType
    const statusMatch = filterStatus === "all" || center.status === filterStatus
    return typeMatch && statusMatch
  })

  const getTypeColor = (type: CenterType) => {
    const colors: Record<CenterType, string> = {
      Shelter: "bg-blue-100 text-blue-800",
      Medical: "bg-red-100 text-red-800",
      Food: "bg-amber-100 text-amber-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: CenterStatus) => {
    return status === "Available" ? (
      <CheckCircle2 className="h-5 w-5 text-accent" />
    ) : (
      <XCircle className="h-5 w-5 text-destructive" />
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Relief Centers</h1>
          <p className="text-muted-foreground">
            Find nearby relief centers with real-time capacity information and contact details.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-lg border border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Type</label>
            <div className="flex flex-wrap gap-2">
              {["all", "Shelter", "Medical", "Food"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Status</label>
            <div className="flex flex-wrap gap-2">
              {["all", "Available", "Full"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status === "all" ? "All Status" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid gap-4">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
              <Card
                key={center.id}
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCenter === center.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCenter(selectedCenter === center.id ? null : center.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{center.name}</h3>
                        <Badge className={getTypeColor(center.type as CenterType)}>{center.type}</Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(center.status as CenterStatus)}
                          <span
                            className={`text-sm font-semibold ${
                              center.status === "Available" ? "text-accent" : "text-destructive"
                            }`}
                          >
                            {center.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{center.distance} away</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Capacity Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Occupancy</span>
                      <span className="text-sm font-semibold">
                        {center.currentOccupancy}/{center.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          (center.currentOccupancy / center.capacity) > 0.8 ? "bg-destructive" : "bg-accent"
                        }`}
                        style={{ width: `${(center.currentOccupancy / center.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Lat: {center.lat.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">Capacity: {center.capacity}</span>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {selectedCenter === center.id && (
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="text-sm font-semibold text-foreground">{center.contact}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button className="w-full">Call</Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          View on Map
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No relief centers match your filters.</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">{reliefCenters.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Centers</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-accent">
                {reliefCenters.filter((c) => c.status === "Available").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Available</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-secondary">
                {reliefCenters.reduce((sum, c) => sum + c.currentOccupancy, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">People Served</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">
                {Math.round(
                  (reliefCenters.reduce((sum, c) => sum + c.currentOccupancy, 0) /
                    reliefCenters.reduce((sum, c) => sum + c.capacity, 0)) *
                    100,
                )}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-1">Network Capacity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
