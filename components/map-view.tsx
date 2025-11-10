"use client"

import { useEffect, useRef } from "react"

interface MapMarker {
  id: string
  lat: number
  lng: number
  name: string
  type: "center" | "group" | "disaster"
  color: string
}

export function MapView({ markers }: { markers: MapMarker[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Since we can't use external maps in this environment, we'll create an interactive canvas-based map
    if (!mapContainerRef.current) return

    const canvas = mapContainerRef.current.querySelector("canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = mapContainerRef.current.clientWidth
    canvas.height = mapContainerRef.current.clientHeight

    // Draw map background (simulated)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#e8f4f8")
    gradient.addColorStop(1, "#d0e8f2")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#c0d8ea"
    ctx.lineWidth = 0.5
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw markers
    markers.forEach((marker) => {
      // Normalize lat/lng to canvas coordinates (simplified mapping)
      const x = (marker.lng - 96.0) * 1000 + canvas.width / 2
      const y = (16.9 - marker.lat) * 1000 + canvas.height / 2

      if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
        // Draw marker circle
        ctx.fillStyle = marker.color
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()

        // Draw marker border
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw inner icon indicator
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }, [markers])

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-border bg-card"
    >
      <canvas className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-lg border border-border p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground">Legend</p>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Relief Centers</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Volunteer Groups</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Disaster Zones</span>
        </div>
      </div>
    </div>
  )
}
