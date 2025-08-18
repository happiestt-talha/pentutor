"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Phone, MessageSquare, Users } from "lucide-react"

export function MeetingControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveMeeting,
  onToggleChat,
  onToggleParticipants,
  participantCount,
  unreadMessages,
}) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      {/* Microphone Control */}
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="lg"
        onClick={onToggleMute}
        className="rounded-full w-12 h-12 p-0"
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      {/* Video Control */}
      <Button
        variant={isVideoOff ? "destructive" : "secondary"}
        size="lg"
        onClick={onToggleVideo}
        className="rounded-full w-12 h-12 p-0"
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </Button>

      {/* Screen Share Control */}
      <Button
        variant={isScreenSharing ? "default" : "secondary"}
        size="lg"
        onClick={onToggleScreenShare}
        className="rounded-full w-12 h-12 p-0"
        style={isScreenSharing ? { backgroundColor: "#F5BB07", color: "#313D6A" } : {}}
      >
        {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
      </Button>

      {/* Participants Panel */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onToggleParticipants}
        className="rounded-full w-12 h-12 p-0 relative"
      >
        <Users className="w-5 h-5" />
        {participantCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F5BB07] text-[#313D6A] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {participantCount}
          </span>
        )}
      </Button>

      {/* Chat Panel */}
      <Button variant="secondary" size="lg" onClick={onToggleChat} className="rounded-full w-12 h-12 p-0 relative">
        <MessageSquare className="w-5 h-5" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadMessages}
          </span>
        )}
      </Button>

      {/* Leave Meeting */}
      <Button variant="destructive" size="lg" onClick={onLeaveMeeting} className="rounded-full w-12 h-12 p-0 ml-4">
        <Phone className="w-5 h-5 rotate-[135deg]" />
      </Button>
    </div>
  )
}
