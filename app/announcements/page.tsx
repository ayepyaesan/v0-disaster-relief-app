"use client"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { helpRequestPosts } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Megaphone,
  Package,
  Heart,
  MessageSquare,
  CheckCircle,
  Plus,
  MapPin,
  Clock,
  AlertCircle,
  X,
  Send,
} from "lucide-react"

type Category = "Supply Need" | "Donation Request" | "Volunteer Support" | "Medical Aid" | "Logistics"
type Status = "Needs Help" | "Completed"
type Urgency = "Low" | "Medium" | "High" | "Critical"

interface Post {
  id: string
  groupName: string
  groupId: string
  title: string
  category: Category
  description: string
  location: string
  urgency: Urgency
  status: Status
  image?: string
  timestamp: Date
  comments: Array<{
    id: string
    userName: string
    message: string
    timestamp: Date
  }>
}

export default function CommunityFeedPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(helpRequestPosts)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    title: "",
    category: "Supply Need" as Category,
    description: "",
    location: "",
    urgency: "Medium" as Urgency,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const getFilteredAndSortedPosts = () => {
    let filtered = [...posts]

    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filterCategory)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus)
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    } else if (sortBy === "comments") {
      filtered.sort((a, b) => b.comments.length - a.comments.length)
    } else if (sortBy === "urgency") {
      const urgencyOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
      filtered.sort(
        (a, b) =>
          urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder],
      )
    }

    return filtered
  }

  const handleCreatePost = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all fields")
      return
    }

    const newPost: Post = {
      id: String(posts.length + 1),
      groupName: user?.name || "Anonymous",
      groupId: "1",
      title: formData.title,
      category: formData.category,
      description: formData.description,
      location: formData.location || user?.assignedArea || "Unknown",
      urgency: formData.urgency,
      status: "Needs Help",
      timestamp: new Date(),
      comments: [],
    }

    setPosts([newPost, ...posts])
    setShowCreateModal(false)
    setFormData({
      title: "",
      category: "Supply Need",
      description: "",
      location: "",
      urgency: "Medium",
    })
  }

  const handleMarkCompleted = (postId: string) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, status: "Completed" } : p)))
  }

  const handleAddComment = (postId: string) => {
    const comment = newComments[postId]
    if (!comment?.trim()) return

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c${Date.now()}`,
                userName: user?.name || "Anonymous",
                message: comment,
                timestamp: new Date(),
              },
            ],
          }
        }
        return p
      }),
    )

    setNewComments({ ...newComments, [postId]: "" })
  }

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments)
    if (newSet.has(postId)) {
      newSet.delete(postId)
    } else {
      newSet.add(postId)
    }
    setExpandedComments(newSet)
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

  const getCategoryColor = (category: Category): string => {
    const colors: Record<Category, string> = {
      "Supply Need": "bg-blue-100 text-blue-800",
      "Donation Request": "bg-green-100 text-green-800",
      "Volunteer Support": "bg-purple-100 text-purple-800",
      "Medical Aid": "bg-red-100 text-red-800",
      Logistics: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getUrgencyColor = (urgency: Urgency): string => {
    const colors: Record<Urgency, string> = {
      Critical: "bg-red-600 text-white",
      High: "bg-orange-500 text-white",
      Medium: "bg-yellow-500 text-white",
      Low: "bg-green-500 text-white",
    }
    return colors[urgency] || "bg-gray-500 text-white"
  }

  const filteredPosts = getFilteredAndSortedPosts()

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Community Feed</h1>
            <p className="text-muted-foreground">
              Volunteer Support Hub - Post help requests and collaborate with field teams
            </p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-card p-4 md:p-6 rounded-lg border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                <option value="Supply Need">Supply Need</option>
                <option value="Donation Request">Donation Request</option>
                <option value="Volunteer Support">Volunteer Support</option>
                <option value="Medical Aid">Medical Aid</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="all">All Posts</option>
                <option value="Needs Help">Needs Help</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="recent">Most Recent</option>
                <option value="comments">Most Comments</option>
                <option value="urgency">Highest Urgency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id} className="border-2 border-border overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getCategoryColor(post.category)}>
                          <Package className="h-3 w-3 mr-1" />
                          {post.category}
                        </Badge>
                        <Badge className={getUrgencyColor(post.urgency)}>
                          {post.urgency === "Critical" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {post.urgency}
                        </Badge>
                        <Badge
                          variant={post.status === "Completed" ? "default" : "outline"}
                          className={
                            post.status === "Completed" ? "bg-green-600 text-white" : "border-amber-500 text-amber-700"
                          }
                        >
                          {post.status === "Completed" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Needs Help
                            </>
                          )}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg md:text-xl">{post.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(post.timestamp)}
                    </Badge>
                  </div>

                  <CardDescription className="flex flex-wrap items-center gap-4">
                    <span className="font-semibold text-foreground">{post.groupName}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {post.location}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-foreground leading-relaxed">{post.description}</p>

                  {/* Image if available */}
                  {post.image && (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSet = new Set(likedPosts)
                        if (newSet.has(post.id)) {
                          newSet.delete(post.id)
                        } else {
                          newSet.add(post.id)
                        }
                        setLikedPosts(newSet)
                      }}
                      className={`gap-2 ${
                        likedPosts.has(post.id) ? "text-red-600" : "text-muted-foreground hover:text-red-600"
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                      <span className="text-xs">Support</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">{post.comments.length} Comments</span>
                    </Button>
                    {post.status === "Needs Help" && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkCompleted(post.id)}
                        className="ml-auto gap-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Completed
                      </Button>
                    )}
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(post.id) && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-medium text-sm text-foreground">{comment.userName}</p>
                              <span className="text-xs text-muted-foreground">{getTimeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-foreground">{comment.message}</p>
                          </div>
                        ))}
                      </div>

                      {post.status === "Needs Help" && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add your offer or comment..."
                            value={newComments[post.id] || ""}
                            onChange={(e) =>
                              setNewComments({
                                ...newComments,
                                [post.id]: e.target.value,
                              })
                            }
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post.id)
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No posts match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Create Help Request</CardTitle>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Need medical supplies urgently"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="Supply Need">Supply Need</option>
                  <option value="Donation Request">Donation Request</option>
                  <option value="Volunteer Support">Volunteer Support</option>
                  <option value="Medical Aid">Medical Aid</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  placeholder="Provide details about what you need..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Leave blank to use your assigned area"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as Urgency })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary/90">
                  Post Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
