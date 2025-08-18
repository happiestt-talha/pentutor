"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Mail, Check, X } from "lucide-react"
import { meetingsApi } from "@/lib/meetingsApi"
import { toast } from "@/hooks/use-toast"

export default function JoinRequestsPage() {
  const [joinRequests, setJoinRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJoinRequests()
  }, [])

  const loadJoinRequests = async () => {
    try {
      const response = await meetingsApi.getUserMeetings()
      setJoinRequests(response.join_requests || [])
    } catch (error) {
      toast({
        title: "Error Loading Join Requests",
        description: error instanceof Error ? error.message : "Failed to load join requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRequest = async (requestId, action) => {
    try {
      await meetingsApi.respondToJoinRequest(requestId, action)
      toast({
        title: `Join Request ${action === "approve" ? "Approved" : "Denied"}`,
        description: `The join request has been ${action === "approve" ? "approved" : "denied"}.`,
      })
      loadJoinRequests() // Reload the list
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} join request`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] via-[#313D6A]/90 to-[#F5BB07]/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">Loading join requests...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313D6A] via-[#313D6A]/90 to-[#F5BB07]/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join Requests</h1>
          <p className="text-white/80">Manage pending join requests for your meetings</p>
        </div>

        {joinRequests.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <User className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Join Requests</h3>
              <p className="text-white/70">You don't have any pending join requests at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {joinRequests.map((request) => (
              <Card key={request.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{request.meeting.title}</CardTitle>
                      <CardDescription className="text-white/70">
                        Meeting ID: {request.meeting.meeting_id}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                      className={
                        request.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : request.status === "approved"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80">
                      <User className="w-4 h-4" />
                      <span>
                        {request.user
                          ? `${request.user.first_name || ""} ${request.user.last_name || ""} (${request.user.username})`.trim()
                          : request.guest_name}
                      </span>
                    </div>

                    {request.guest_email && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Mail className="w-4 h-4" />
                        <span>{request.guest_email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>Requested: {new Date(request.requested_at).toLocaleString()}</span>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleJoinRequest(request.id, "approve")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleJoinRequest(request.id, "deny")} variant="destructive">
                          <X className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
