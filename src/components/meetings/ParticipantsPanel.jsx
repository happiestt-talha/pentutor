"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Crown, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ParticipantsPanel({
  participants,
  currentUserId,
  onMuteParticipant,
  onRemoveParticipant,
  isHost = false,
}) {
  return (
    <div className="w-80 bg-white/10 backdrop-blur-sm rounded-lg p-4 h-full">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">Participants ({participants.length})</h3>

      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 bg-[#F5BB07] rounded-full flex items-center justify-center text-[#313D6A] font-bold text-sm">
                  {participant.name.charAt(0).toUpperCase()}
                </div>

                {/* Name and Status */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">
                      {participant.name}
                      {participant.id === currentUserId && " (You)"}
                    </span>
                    {participant.isHost && <Crown className="w-4 h-4 text-[#F5BB07]" />}
                  </div>

                  {/* Audio/Video Status */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`p-1 rounded ${participant.isMuted ? "bg-red-500/20" : "bg-green-500/20"}`}>
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Mic className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                    <div className={`p-1 rounded ${participant.isVideoOff ? "bg-red-500/20" : "bg-green-500/20"}`}>
                      {participant.isVideoOff ? (
                        <VideoOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Video className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Controls */}
              {isHost && participant.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#313D6A] border-white/20">
                    <DropdownMenuItem
                      onClick={() => onMuteParticipant?.(participant.id)}
                      className="text-white hover:bg-white/10"
                    >
                      {participant.isMuted ? "Unmute" : "Mute"} Participant
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRemoveParticipant?.(participant.id)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      Remove Participant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
