"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MeetingRoom } from "@/components/meetings/MeetingRoom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { meetingsApi } from "@/lib/meetingsApi"
import { Loader2, AlertCircle } from "lucide-react"



export default function MeetingRoomPage() {
  const params = useParams()
  const router = useRouter()
  const meetingId = params.meetingId

  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [participantName, setParticipantName] = useState("")
  const [password, setPassword] = useState("")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [showNamePrompt, setShowNamePrompt] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isInMeeting, setIsInMeeting] = useState(false)

  // Load meeting details
  useEffect(() => {
    const loadMeeting = async () => {
      try {
        setLoading(true)
        console.log("meeting id", meetingId)
        const meetingData = await meetingsApi.getMeeting(meetingId)
        console.log("meeting data", meetingData)
        setMeeting(meetingData)

        // Check if password is required
        if (meetingData.is_password_protected) {
          setShowPasswordPrompt(true)
        }
      } catch (err) {
        setError(err.message || "Failed to load meeting")
      } finally {
        setLoading(false)
      }
    }

    if (meetingId) {
      loadMeeting()
    }
  }, [meetingId])

  // Get participant name from localStorage or prompt
  useEffect(() => {
    const savedName = localStorage.getItem("participantName")
    if (savedName) {
      setParticipantName(savedName)
      setShowNamePrompt(false)
    }
  }, [])

  const handleJoinMeeting = async () => {
    if (!participantName.trim()) {
      alert("Please enter your name")
      return
    }

    try {
      setJoining(true)

      // Save participant name
      localStorage.setItem("participantName", participantName)

      // Join meeting via API
      await meetingsApi.joinMeeting(meetingId, {
        participant_name: participantName,
        meeting_id: meetingId,
        password: password || undefined,
      })

      // Enter meeting room
      setIsInMeeting(true)
      setShowNamePrompt(false)
      setShowPasswordPrompt(false)
    } catch (err) {
      setError(err.message || "Failed to join meeting")

      // If password error, show password prompt
      if (err.message?.includes("password")) {
        setShowPasswordPrompt(true)
      }
    } finally {
      setJoining(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinMeeting()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5BB07] mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold">Loading meeting...</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <CardTitle className="text-white">Error</CardTitle>
            <CardDescription className="text-white/70">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/meetings")} className="w-full" variant="outline">
              Back to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Already in meeting - show meeting room
  if (isInMeeting && meeting) {
    return (
      <MeetingRoom
        meetingId={meetingId}
        participantName={participantName}
        isHost={false} // TODO: Check if current user is host
      />
    )
  }

  // Join meeting prompts
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Join Meeting</CardTitle>
          {meeting && (
            <div className="space-y-2">
              <CardDescription className="text-white/70 text-lg font-medium">{meeting.title}</CardDescription>
              {meeting.description && (
                <CardDescription className="text-white/60">{meeting.description}</CardDescription>
              )}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-white/60">Host:</span>
                <span className="text-[#F5BB07] font-medium">{meeting.host.name}</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name Input */}
          {showNamePrompt && (
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Your Name</label>
              <Input
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                autoFocus
              />
            </div>
          )}

          {/* Password Input */}
          {showPasswordPrompt && (
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Meeting Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter meeting password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                autoFocus={!showNamePrompt}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Join Button */}
          <Button
            onClick={handleJoinMeeting}
            disabled={joining || !participantName.trim()}
            className="w-full bg-[#F5BB07] text-[#313D6A] hover:bg-[#F5BB07]/90 font-semibold"
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Joining...
              </>
            ) : (
              "Join Meeting"
            )}
          </Button>

          {/* Back Button */}
          <Button
            onClick={() => router.push("/meetings")}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Back to Meetings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
