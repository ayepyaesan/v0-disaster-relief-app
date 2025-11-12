"use client"

import { useState } from "react"
import { Share2, Heart, Award, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { donationCampaigns } from "@/lib/mock-data"

interface DonationForm {
  campaignId: string
  amount: string
  isOpen: boolean
}

interface UserDonation {
  campaignId: string
  amount: number
  date: Date
  badge: string
}

export default function DonationsPage() {
  const [donationForm, setDonationForm] = useState<DonationForm>({ campaignId: "", amount: "", isOpen: false })
  const [userDonations, setUserDonations] = useState<UserDonation[]>([
    { campaignId: "1", amount: 50000, date: new Date("2025-11-10T14:30:00"), badge: "Water Supporter" },
    { campaignId: "2", amount: 100000, date: new Date("2025-11-10T12:15:00"), badge: "Medical Hero" },
    { campaignId: "3", amount: 25000, date: new Date("2025-11-10T10:45:00"), badge: "Food Champion" },
  ])
  const [shareMessage, setShareMessage] = useState("")

  const handleDonate = () => {
    if (donationForm.amount && donationForm.campaignId) {
      const campaign = donationCampaigns.find((c) => c.id === donationForm.campaignId)
      const amount = Number.parseInt(donationForm.amount)

      // Generate badge based on amount
      let badge = "Supporter"
      if (amount >= 100000) badge = "Champion"
      if (amount >= 250000) badge = "Hero"
      if (amount >= 500000) badge = "Lifesaver"

      setUserDonations([
        ...userDonations,
        {
          campaignId: donationForm.campaignId,
          amount,
          date: new Date(),
          badge,
        },
      ])
      setDonationForm({ campaignId: "", amount: "", isOpen: false })
    }
  }

  const handleShare = (campaignTitle: string) => {
    const text = `I just donated to "${campaignTitle}" on the Disaster Relief Platform. Join me in making a difference!`
    setShareMessage(text)
    if (navigator.share) {
      navigator.share({
        title: "Support Disaster Relief",
        text,
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)
  const totalCampaignRaised = donationCampaigns.reduce((sum, c) => sum + c.raised, 0)
  const totalDonors = userDonations.length + 12544 // Mock additional donors

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Support Relief Campaigns</h1>
          <p className="text-muted-foreground">
            Choose a campaign and make an immediate impact on disaster relief efforts
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                  <p className="text-3xl font-bold text-primary">{(totalCampaignRaised / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="h-5 w-5 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your Contributions</p>
                  <p className="text-3xl font-bold text-green-600">{totalDonated.toLocaleString()}</p>
                </div>
                <Heart className="h-5 w-5 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                  <p className="text-3xl font-bold text-blue-600">{totalDonors.toLocaleString()}</p>
                </div>
                <Users className="h-5 w-5 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Active Campaigns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {donationCampaigns.map((campaign) => {
              const progress = (campaign.raised / campaign.target) * 100
              const campaignDonors = userDonations.filter((d) => d.campaignId === campaign.id).length

              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${campaign.color}20` }}
                      >
                        <span className="text-xl" style={{ color: campaign.color }}>
                          {campaign.icon === "Droplet" && "💧"}
                          {campaign.icon === "Heart" && "❤️"}
                          {campaign.icon === "Package" && "📦"}
                          {campaign.icon === "Home" && "🏠"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(campaign.title)}
                        className="hover:bg-muted"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <CardDescription className="text-sm">{campaign.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: campaign.color,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Campaign Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-muted/50 rounded-lg p-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Raised</p>
                        <p className="font-bold text-sm text-foreground">{(campaign.raised / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center border-l border-r border-border">
                        <p className="text-xs text-muted-foreground mb-1">Target</p>
                        <p className="font-bold text-sm text-foreground">{(campaign.target / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Donors</p>
                        <p className="font-bold text-sm text-foreground">{campaignDonors + 45}</p>
                      </div>
                    </div>

                    {/* Impact Badge */}
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent flex-shrink-0" />
                      <p className="text-xs text-accent font-medium">
                        {progress >= 75 ? "Near Goal!" : progress >= 50 ? "Halfway There" : "Just Started"}
                      </p>
                    </div>

                    {/* Donation Button */}
                    <Button
                      onClick={() => setDonationForm({ ...donationForm, campaignId: campaign.id, isOpen: true })}
                      className="w-full h-10"
                      style={{ backgroundColor: campaign.color }}
                    >
                      Donate to Campaign
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {donationForm.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{donationCampaigns.find((c) => c.id === donationForm.campaignId)?.title}</CardTitle>
                <CardDescription>Enter your donation amount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Amount (Kyat)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={donationForm.amount}
                    onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[5000, 10000, 25000, 50000].map((amount) => (
                    <Button
                      key={amount}
                      variant={donationForm.amount === String(amount) ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDonationForm({ ...donationForm, amount: String(amount) })}
                      className="text-xs"
                    >
                      {amount / 1000}K
                    </Button>
                  ))}
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900">
                    Your donation will be tracked and verified through the admin dashboard
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setDonationForm({ ...donationForm, isOpen: false })}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleDonate} disabled={!donationForm.amount}>
                    Confirm Donation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {userDonations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Your Achievement Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userDonations.map((donation, idx) => (
                <Card key={idx} className="text-center p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="text-4xl">
                      {donation.badge === "Supporter" && "🌟"}
                      {donation.badge === "Champion" && "🏆"}
                      {donation.badge === "Hero" && "🦸"}
                      {donation.badge === "Lifesaver" && "💎"}
                      {donation.badge === "Water Supporter" && "💧"}
                      {donation.badge === "Medical Hero" && "❤️"}
                      {donation.badge === "Food Champion" && "🍽️"}
                    </div>
                    <p className="font-bold text-sm text-foreground">{donation.badge}</p>
                    <p className="text-xs text-muted-foreground">{donation.amount.toLocaleString()} Kyat</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Donor Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Aung Kyaw",
                location: "Yangon",
                message:
                  "My donation helped provide clean water to 50 families. It felt amazing to make a direct impact!",
                amount: 100000,
              },
              {
                name: "Khin May",
                location: "Mandalay",
                message: "Supporting the medical fund was the right choice. Healthcare matters during crisis.",
                amount: 75000,
              },
              {
                name: "Zaw Moe",
                location: "Naypyidaw",
                message: "Providing food for families in need is exactly what I wanted my money to do.",
                amount: 50000,
              },
            ].map((story, idx) => (
              <Card key={idx} className="bg-muted/50 border-0">
                <CardContent className="p-4 space-y-3">
                  <div className="flex gap-2 items-start">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{story.name}</p>
                      <p className="text-xs text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground italic">"{story.message}"</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Donated: {story.amount.toLocaleString()} Kyat
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">How Campaign Donations Work</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-accent">1</span>
                <span>Select a campaign that aligns with your values</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">2</span>
                <span>Enter your donation amount and confirm</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">3</span>
                <span>Earn achievement badges based on your contribution</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">4</span>
                <span>Track impact through the admin dashboard</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">5</span>
                <span>Share your support to inspire others</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
