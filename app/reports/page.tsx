"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { reports } from "@/lib/mock-data"
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
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, MapPin, Clock, User, CheckCircle2, AlertCircle, Upload, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ReportCategory = "Damage" | "Supply Needs" | "Medical" | "Evacuation" | "Other"
type ReportUrgency = "Low" | "Medium" | "High" | "Critical"
type ReportStatus = "Pending" | "Verified"

export default function ReportsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [submittedReports, setSubmittedReports] = useState(reports)
  const [formData, setFormData] = useState({
    category: "Damage" as ReportCategory,
    description: "",
    location: user?.assignedArea || "",
    urgency: "Medium" as ReportUrgency,
  })
  const [fileUpload, setFileUpload] = useState<string>("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitReport = () => {
    if (!formData.description || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newReport = {
      id: String(submittedReports.length + 1),
      reporter: user?.name || "Unknown",
      category: formData.category,
      description: formData.description,
      location: formData.location,
      urgency: formData.urgency,
      status: "Pending" as ReportStatus,
      timestamp: new Date(),
    }

    setSubmittedReports((prev) => [newReport, ...prev])
    toast({
      title: "Report Submitted Successfully",
      description: `Your ${formData.category.toLowerCase()} report has been submitted and is pending verification.`,
    })

    // Reset form
    setFormData({
      category: "Damage",
      description: "",
      location: user?.assignedArea || "",
      urgency: "Medium",
    })
    setFileUpload("")
  }

  const getCategoryColor = (category: ReportCategory) => {
    const colors: Record<ReportCategory, string> = {
      Damage: "bg-red-100 text-red-800",
      "Supply Needs": "bg-amber-100 text-amber-800",
      Medical: "bg-red-100 text-red-800",
      Evacuation: "bg-orange-100 text-orange-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getUrgencyColor = (urgency: ReportUrgency) => {
    const colors: Record<ReportUrgency, string> = {
      Low: "bg-blue-100 text-blue-800",
      Medium: "bg-amber-100 text-amber-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    }
    return colors[urgency] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: ReportStatus) => {
    return status === "Verified" ? (
      <CheckCircle2 className="h-5 w-5 text-accent" />
    ) : (
      <AlertCircle className="h-5 w-5 text-primary" />
    )
  }

  const myReports = submittedReports.filter((r) => r.reporter === user?.name)
  const recentReports = submittedReports.slice(0, 5)

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Disaster Reports</h1>
          <p className="text-muted-foreground">
            Submit damage reports, supply needs, and emergency alerts from the field.
          </p>
        </div>

        {/* Submit Report Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto gap-2">
              <Plus className="h-5 w-5" />
              Submit New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Disaster Report</DialogTitle>
              <DialogDescription>
                Report damages, supply needs, medical emergencies, or other incidents from the field.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Reporter Info */}
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Reporting Officer</p>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Report Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border bg-background text-foreground p-2 text-sm"
                >
                  <option value="Damage">Damage</option>
                  <option value="Supply Needs">Supply Needs</option>
                  <option value="Medical">Medical Emergency</option>
                  <option value="Evacuation">Evacuation Alert</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                <div className="flex gap-2">
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border bg-background text-foreground p-2 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the situation in detail..."
                  className="w-full rounded-lg border border-border bg-background text-foreground p-2 text-sm"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Attach Photo/Video (optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {fileUpload ? fileUpload : "Click to upload or drag and drop"}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button onClick={handleSubmitReport} className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* My Reports Summary */}
        {myReports.length > 0 && (
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Your Reports ({myReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status as ReportStatus)}
                      <span className="text-sm text-foreground">{report.category}</span>
                    </div>
                    <Badge className={getStatusIcon(report.status as ReportStatus) ? "bg-accent" : "bg-primary"}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest disaster reports from the field</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(report.category as ReportCategory)}>{report.category}</Badge>
                      <Badge className={getUrgencyColor(report.urgency as ReportUrgency)}>{report.urgency}</Badge>
                      <div className="flex items-center gap-1 ml-auto">
                        {getStatusIcon(report.status as ReportStatus)}
                        <span className="text-xs font-semibold text-foreground">{report.status}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground mb-1">{report.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {report.reporter}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {report.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-primary">{submittedReports.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-destructive">
                {submittedReports.filter((r) => (r.urgency as ReportUrgency) === "Critical").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Critical</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-accent">
                {submittedReports.filter((r) => (r.status as ReportStatus) === "Verified").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Verified</p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-secondary">{myReports.length}</p>
              <p className="text-xs text-muted-foreground mt-1">My Reports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
