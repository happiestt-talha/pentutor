"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWebRTC } from "@/hooks/useWebRTC"
import VideoTile  from "./VideoTile"
import { MeetingControls } from "./MeetingControls"
import { ParticipantsPanel } from "./ParticipantsPanel"
import { ChatPanel } from "./ChatPanel"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"


export function MeetingRoom({ meetingId, participantName, isHost = false }) {
  const router = useRouter()
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  const signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || "ws://localhost:8080"

  const {
    participants,
    localStream,
    isConnected,
    isMuted,
    isVideoOff,
    isScreenSharing,
    chatMessages,
    connectionState,
    connect,
    disconnect,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    sendChatMessage,
  } = useWebRTC({
    meetingId,
    participantName,
    signalingUrl,
  })

  // Connect on mount
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  // Track unread messages
  useEffect(() => {
    if (!showChat) {
      setUnreadMessages((prev) => prev + 1)
    }
  }, [chatMessages.length, showChat])

  // Reset unread count when chat is opened
  useEffect(() => {
    if (showChat) {
      setUnreadMessages(0)
    }
  }, [showChat])

  const handleLeaveMeeting = () => {
    disconnect()
    router.push("/meetings")
  }

  const handleToggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare()
    } else {
      startScreenShare()
    }
  }

  // Connection states
  if (connectionState === "connecting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5BB07] mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Connecting to meeting...</h2>
          <p className="text-white/70">Please wait while we set up your connection</p>
        </div>
      </div>
    )
  }

  if (connectionState === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Connection Failed</h2>
          <p className="text-white/70 mb-4">Unable to connect to the meeting</p>
          <Button onClick={() => router.push("/meetings")} variant="outline">
            Back to Meetings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313D6A] to-[#1a2142] flex flex-col">
      {/* Header */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">Meeting: {meetingId}</h1>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-white/70 text-sm">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Video Grid */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {/* Local Video */}
            <VideoTile
              stream={localStream || undefined}
              participantName={participantName}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isScreenSharing={isScreenSharing}
              isLocal={true}
              className="aspect-video"
            />

            {/* Remote Videos */}
            {participants
              .filter((p) => p.id !== participantName)
              .map((participant) => (
                <VideoTile
                  key={participant.id}
                  stream={participant.stream}
                  participantName={participant.name}
                  isMuted={participant.isMuted}
                  isVideoOff={participant.isVideoOff}
                  className="aspect-video"
                />
              ))}
          </div>

          {/* Meeting Controls */}
          <div className="flex justify-center">
            <MeetingControls
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isScreenSharing={isScreenSharing}
              onToggleMute={toggleMute}
              onToggleVideo={toggleVideo}
              onToggleScreenShare={handleToggleScreenShare}
              onLeaveMeeting={handleLeaveMeeting}
              onToggleChat={() => setShowChat(!showChat)}
              onToggleParticipants={() => setShowParticipants(!showParticipants)}
              participantCount={participants.length}
              unreadMessages={unreadMessages}
            />
          </div>
        </div>

        {/* Side Panels */}
        {showParticipants && (
          <ParticipantsPanel participants={participants} currentUserId={participantName} isHost={isHost} />
        )}

        {showChat && (
          <ChatPanel messages={chatMessages} onSendMessage={sendChatMessage} currentUserId={participantName} />
        )}
      </div>
    </div>
  )
}
