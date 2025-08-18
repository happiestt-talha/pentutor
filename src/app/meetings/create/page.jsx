"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Users, Lock, Mail, Settings, Video } from "lucide-react"
import { meetingsApi } from "@/lib/meetingsApi"
import { toast } from "@/hooks/use-toast"

export default function CreateMeetingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    meeting_type: "instant",
    access_type: "public",
    max_participants: 100,
    waiting_room: false,
    allow_screen_share: true,
    allow_unmute: true,
    enable_chat: true,
    enable_reactions: true,
    is_password_required: false,
    is_recorded: false,
    invites: [],
  })

  const [inviteEmails, setInviteEmails] = useState("")
  const [scheduledDateTime, setScheduledDateTime] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        scheduled_time: formData.meeting_type === "scheduled" ? scheduledDateTime : undefined,
        invites:
          formData.access_type === "private"
            ? inviteEmails
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean)
            : undefined,
      }

      const response = await meetingsApi.createMeeting(submitData)
      console.log("meeting created response", response)

      toast({
        title: "Meeting Created Successfully!",
        description: `Meeting ID: ${response.meeting_id}`,
      })

      // Redirect based on meeting type
      if (formData.meeting_type === "instant") {
        router.push(`/meetings/room/${response.meeting_id}`)
      } else {
        router.push(`/meetings?created=${response.meeting_id}`)
      }
    } catch (error) {
      toast({
        title: "Error Creating Meeting",
        description: error instanceof Error ? error.message : "Failed to create meeting",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313D6A] via-[#313D6A]/90 to-[#F5BB07]/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Meeting</h1>
          <p className="text-white/80">Set up your meeting with advanced options</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Meeting Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter meeting title"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                <div>
                  <Label className="text-white">Meeting Type</Label>
                  <Select
                    value={formData.meeting_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, meeting_type: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Instant Meeting
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Scheduled Meeting
                        </div>
                      </SelectItem>
                      <SelectItem value="lecture">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Lecture/Webinar
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.meeting_type === "scheduled" && (
                  <div>
                    <Label htmlFor="scheduled_time" className="text-white">
                      Scheduled Time
                    </Label>
                    <Input
                      id="scheduled_time"
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Access Type</Label>
                  <Select
                    value={formData.access_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, access_type: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Public - Anyone can join
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private - Invite only
                        </div>
                      </SelectItem>
                      <SelectItem value="approval_required">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Approval Required
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="password_required" className="text-white">
                    Password Protection
                  </Label>
                  <Switch
                    id="password_required"
                    checked={formData.is_password_required}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_password_required: checked }))}
                  />
                </div>

                {formData.is_password_required && (
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Meeting Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter meeting password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="max_participants" className="text-white">
                    Max Participants
                  </Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="2"
                    max="1000"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, max_participants: Number.parseInt(e.target.value) }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invitations for Private Meetings */}
          {formData.access_type === "private" && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Invite Participants
                </CardTitle>
                <CardDescription className="text-white/70">Enter email addresses separated by commas</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="user1@example.com, user2@example.com, ..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  rows={3}
                />
              </CardContent>
            </Card>
          )}

          {/* Meeting Settings */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Meeting Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="waiting_room" className="text-white">
                  Waiting Room
                </Label>
                <Switch
                  id="waiting_room"
                  checked={formData.waiting_room}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, waiting_room: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow_screen_share" className="text-white">
                  Screen Sharing
                </Label>
                <Switch
                  id="allow_screen_share"
                  checked={formData.allow_screen_share}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allow_screen_share: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow_unmute" className="text-white">
                  Allow Unmute
                </Label>
                <Switch
                  id="allow_unmute"
                  checked={formData.allow_unmute}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allow_unmute: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enable_chat" className="text-white">
                  Enable Chat
                </Label>
                <Switch
                  id="enable_chat"
                  checked={formData.enable_chat}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enable_chat: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enable_reactions" className="text-white">
                  Enable Reactions
                </Label>
                <Switch
                  id="enable_reactions"
                  checked={formData.enable_reactions}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enable_reactions: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_recorded" className="text-white">
                  Record Meeting
                </Label>
                <Switch
                  id="is_recorded"
                  checked={formData.is_recorded}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_recorded: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold px-8 py-3 text-lg"
            >
              {loading
                ? "Creating..."
                : formData.meeting_type === "instant"
                  ? "Create & Start Meeting"
                  : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
