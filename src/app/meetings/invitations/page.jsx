"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Mail, Check, X, Video } from "lucide-react"
import { meetingsApi } from "@/lib/meetingsApi"
import { toast } from "@/hooks/use-toast"

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const response = await meetingsApi.getUserMeetings()
      setInvitations(response.invited_meetings || [])
    } catch (error) {
      toast({
        title: "Error Loading Invitations",
        description: error instanceof Error ? error.message : "Failed to load invitations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInvitation = async (inviteId, action) => {
    try {
      await meetingsApi.respondToInvite(inviteId, action)
      toast({
        title: `Invitation ${action === "accept" ? "Accepted" : "Declined"}`,
        description: `You have ${action === "accept" ? "accepted" : "declined"} the meeting invitation.`,
      })
      loadInvitations() // Reload the list
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} invitation`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] via-[#313D6A]/90 to-[#F5BB07]/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">Loading invitations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313D6A] via-[#313D6A]/90 to-[#F5BB07]/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Meeting Invitations</h1>
          <p className="text-white/80">Manage your meeting invitations</p>
        </div>

        {invitations.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <Mail className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Invitations</h3>
              <p className="text-white/70">You don't have any meeting invitations at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((invite) => (
              <Card key={invite.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        {invite.meeting.title}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Invited by {invite.invited_by.username}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        invite.status === "pending"
                          ? "secondary"
                          : invite.status === "accepted"
                            ? "default"
                            : "destructive"
                      }
                      className={
                        invite.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : invite.status === "accepted"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                      }
                    >
                      {invite.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80">
                      <User className="w-4 h-4" />
                      <span>Host: {invite.meeting.host.username}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/80">
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        {invite.meeting.meeting_type}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        {invite.meeting.access_type}
                      </Badge>
                    </div>

                    {invite.meeting.scheduled_time && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span>Scheduled: {new Date(invite.meeting.scheduled_time).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>Invited: {new Date(invite.invited_at).toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {invite.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleInvitation(invite.id, "accept")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button onClick={() => handleInvitation(invite.id, "decline")} variant="destructive">
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}

                      {invite.status === "accepted" && invite.meeting.status === "active" && (
                        <Button
                          onClick={() => (window.location.href = `/meetings/room/${invite.meeting.meeting_id}`)}
                          className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A]"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
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
