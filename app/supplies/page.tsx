"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supplies, reliefCenters } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Droplet, Heart, Package, Home, Wrench, MapPin, Plus, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <Droplet className="h-6 w-6" />,
  Medical: <Heart className="h-6 w-6" />,
  Shelter: <Home className="h-6 w-6" />,
  Tools: <Wrench className="h-6 w-6" />,
}

export default function SuppliesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [requestQuantity, setRequestQuantity] = useState<Record<string, string>>({})
  const [selectedSupplyId, setSelectedSupplyId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const filteredSupplies = filterCategory === "all" ? supplies : supplies.filter((s) => s.category === filterCategory)

  const categories = ["all", "Food", "Medical", "Shelter", "Tools"]

  const handleRequestSupply = (supplyId: string) => {
    const quantity = requestQuantity[supplyId] || "1"
    const supply = supplies.find((s) => s.id === supplyId)

    if (supply) {
      toast({
        title: "Request Submitted",
        description: `Requested ${quantity} units of ${supply.item} from ${supply.center}`,
      })
      setRequestQuantity((prev) => ({ ...prev, [supplyId]: "1" }))
      setSelectedSupplyId(null)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-amber-100 text-amber-800",
      Medical: "bg-red-100 text-red-800",
      Shelter: "bg-blue-100 text-blue-800",
      Tools: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const totalSupplies = supplies.reduce((sum, s) => sum + s.quantity, 0)

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Supply Store</h1>
          <p className="text-muted-foreground">Browse available supplies and submit requests for relief centers.</p>
        </div>

        {/* Category Filter */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <label className="block text-sm font-medium text-foreground mb-3">Filter by Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category === "all" ? "All Supplies" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Supplies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSupplies.map((supply) => (
            <Card key={supply.id} className="border-2 border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className={`p-3 rounded-lg ${getCategoryColor(supply.category)}`}>
                    {categoryIcons[supply.category] || <Package className="h-6 w-6" />}
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">×{supply.quantity}</span>
                </div>
                <CardTitle className="text-lg">{supply.item}</CardTitle>
                <CardDescription>{supply.category}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{supply.center}</span>
                </div>

                {/* Request Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedSupplyId(supply.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Request Supply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request {supply.item}</DialogTitle>
                      <DialogDescription>Submit a supply request from {supply.center}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-xs text-muted-foreground">Item</p>
                          <p className="text-sm font-semibold text-foreground">{supply.item}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Available</p>
                          <p className="text-sm font-semibold text-accent">{supply.quantity}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Quantity Requested</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            max={supply.quantity}
                            value={requestQuantity[supply.id] || "1"}
                            onChange={(e) =>
                              setRequestQuantity((prev) => ({
                                ...prev,
                                [supply.id]: e.target.value,
                              }))
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground flex items-center">
                            max: {supply.quantity}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Purpose/Notes (optional)
                        </label>
                        <textarea
                          placeholder="Describe why you need these supplies..."
                          className="w-full rounded-lg border border-border p-2 text-sm bg-background text-foreground placeholder-muted-foreground"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <Button onClick={() => handleRequestSupply(supply.id)} className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSupplies.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No supplies available in this category.</p>
          </div>
        )}

        {/* Supply Overview */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle>Supply Network Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{totalSupplies}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-secondary">{categories.length - 1}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Relief Centers</p>
                <p className="text-2xl font-bold text-accent">{reliefCenters.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Supply Types</p>
                <p className="text-2xl font-bold text-primary">{supplies.length}</p>
              </div>
            </div>

            {/* Supply by Category */}
            <div className="border-t border-border pt-4">
              <p className="font-semibold text-foreground mb-3">Breakdown by Category</p>
              <div className="space-y-2">
                {categories.slice(1).map((category) => {
                  const categorySupplies = supplies.filter((s) => s.category === category)
                  const categoryTotal = categorySupplies.reduce((sum, s) => sum + s.quantity, 0)
                  return (
                    <div key={category} className="flex items-center justify-between p-2 rounded">
                      <span className="text-sm text-muted-foreground">{category}</span>
                      <span className="font-semibold text-foreground">{categoryTotal} units</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
