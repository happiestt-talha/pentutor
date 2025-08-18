"use client"

import { useEffect, useRef } from "react"
import { Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react"

export function VideoTile({
  stream,
  participantName,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isLocal = false,
  className = "",
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // Mute local video to prevent feedback
        className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
      />

      {/* Avatar when video is off */}
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#313D6A]">
          <div className="w-16 h-16 bg-[#F5BB07] rounded-full flex items-center justify-center text-[#313D6A] font-bold text-xl">
            {participantName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium text-sm truncate">
            {participantName} {isLocal && "(You)"}
          </span>

          <div className="flex items-center gap-1">
            {/* Screen sharing indicator */}
            {isScreenSharing && (
              <div className="p-1 bg-[#F5BB07] rounded">
                <Monitor className="w-3 h-3 text-[#313D6A]" />
              </div>
            )}

            {/* Microphone status */}
            <div className={`p-1 rounded ${isMuted ? "bg-red-500" : "bg-green-500"}`}>
              {isMuted ? <MicOff className="w-3 h-3 text-white" /> : <Mic className="w-3 h-3 text-white" />}
            </div>

            {/* Video status */}
            <div className={`p-1 rounded ${isVideoOff ? "bg-red-500" : "bg-green-500"}`}>
              {isVideoOff ? <VideoOff className="w-3 h-3 text-white" /> : <Video className="w-3 h-3 text-white" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
