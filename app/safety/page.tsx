"use client"

import { useState } from "react"
import { disasterSafetyGuides } from "@/lib/mock-data"
import {
  AlertTriangle,
  Waves,
  Wind,
  Flame,
  Mountain,
  ChevronDown,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const iconMap: Record<string, any> = {
  AlertTriangle,
  Waves,
  Wind,
  Flame,
  Mountain,
}

export default function SafetyPage() {
  const [selectedDisaster, setSelectedDisaster] = useState<string>(disasterSafetyGuides[0].id)
  const [expandedStep, setExpandedStep] = useState<"before" | "during" | "after" | null>("before")

  const current = disasterSafetyGuides.find((d) => d.id === selectedDisaster)

  if (!current) return null

  const Icon = iconMap[current.icon]

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Safety Instructions</h1>
          <p className="text-muted-foreground">Learn how to prepare for and respond to different types of disasters</p>
        </div>

        {/* Disaster Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          {disasterSafetyGuides.map((disaster) => {
            const DisasterIcon = iconMap[disaster.icon]
            const isSelected = disaster.id === selectedDisaster

            return (
              <button
                key={disaster.id}
                onClick={() => setSelectedDisaster(disaster.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <DisasterIcon className="h-8 w-8" style={{ color: disaster.color }} />
                <span className="font-semibold text-sm text-center">{disaster.type}</span>
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Overview */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div className="flex items-center gap-3 mb-4">
              {Icon && <Icon className="h-8 w-8" style={{ color: current.color }} />}
              <h2 className="text-2xl font-bold text-foreground">{current.type}</h2>
            </div>

            <p className="text-muted-foreground mb-6">{current.description}</p>

            {/* Emergency Contacts */}
            <div className="space-y-3 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Emergency Contacts
              </h3>
              {current.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-2 bg-muted/50 rounded text-sm text-foreground">
                  {contact}
                </div>
              ))}
            </div>
          </Card>

          {/* Right Content - Safety Steps */}
          <div className="lg:col-span-2 space-y-4">
            {/* Before */}
            <Card className="overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === "before" ? null : "before")}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Before the Disaster</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedStep === "before" ? "rotate-180" : ""}`}
                />
              </button>

              {expandedStep === "before" && (
                <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                  {current.beforeSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* During */}
            <Card className="overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === "during" ? null : "during")}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <h3 className="text-xl font-bold text-foreground">During the Disaster</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedStep === "during" ? "rotate-180" : ""}`}
                />
              </button>

              {expandedStep === "during" && (
                <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                  {current.duringSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-foreground font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* After */}
            <Card className="overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === "after" ? null : "after")}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-bold text-foreground">After the Disaster</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedStep === "after" ? "rotate-180" : ""}`}
                />
              </button>

              {expandedStep === "after" && (
                <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
                  {current.afterSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Tips */}
            <Card className="bg-primary/10 border-primary/20 p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Always follow official emergency guidance and evacuation orders</li>
                <li>• Keep an emergency kit with water, food, first aid, and medications</li>
                <li>• Have a family communication plan</li>
                <li>• Stay informed through official channels</li>
                <li>• Help neighbors and vulnerable community members when safe</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
