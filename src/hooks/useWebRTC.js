"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export const useWebRTC = ({ meetingId, participantName, signalingUrl, turnServers }) => {
  const [participants, setParticipants] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [connectionState, setConnectionState] = useState("disconnected")

  const wsRef = useRef(null)
  const peerConnectionsRef = useRef(new Map())
  const dataChannelsRef = useRef(new Map())
  const localStreamRef = useRef(null)

  const defaultTurnServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:localhost:3478",
      username: "user",
      credential: "pass",
    },
  ]

  const iceServers = turnServers || defaultTurnServers

  // Initialize local media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      })
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error("[v0] Failed to get user media:", error)
      throw error
    }
  }, [])

  // Create peer connection
  const createPeerConnection = useCallback(
    (participantId) => {
      const peerConnection = new RTCPeerConnection({ iceServers })

      // Add local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current)
        })
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log("[v0] Received remote track from:", participantId)
        const [remoteStream] = event.streams
        setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, stream: remoteStream } : p)))
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              targetParticipant: participantId,
            }),
          )
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log("[v0] Connection state with", participantId, ":", peerConnection.connectionState)
        if (peerConnection.connectionState === "failed") {
          setConnectionState("failed")
        }
      }

      // Create data channel for chat
      const dataChannel = peerConnection.createDataChannel("chat")
      dataChannel.onopen = () => console.log("[v0] Data channel opened with:", participantId)
      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            participantId,
            participantName: message.senderName,
            message: message.text,
            timestamp: new Date(),
          },
        ])
      }

      dataChannelsRef.current.set(participantId, dataChannel)
      peerConnectionsRef.current.set(participantId, peerConnection)

      return peerConnection
    },
    [iceServers],
  )

  // Send WebSocket message
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    async (event) => {
      const message = JSON.parse(event.data)
      console.log("[v0] Received message:", message.type)

      switch (message.type) {
        case "participant-joined":
          setParticipants((prev) => {
            if (prev.find((p) => p.id === message.participant.id)) return prev
            return [...prev, message.participant]
          })

          // Create offer for new participant
          if (message.participant.id !== participantName) {
            const peerConnection = createPeerConnection(message.participant.id)
            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)
            sendMessage({
              type: "offer",
              offer,
              targetParticipant: message.participant.id,
            })
          }
          break

        case "participant-left":
          setParticipants((prev) => prev.filter((p) => p.id !== message.participantId))
          const peerConnection = peerConnectionsRef.current.get(message.participantId)
          if (peerConnection) {
            peerConnection.close()
            peerConnectionsRef.current.delete(message.participantId)
            dataChannelsRef.current.delete(message.participantId)
          }
          break

        case "offer":
          const offerPeerConnection = createPeerConnection(message.fromParticipant)
          await offerPeerConnection.setRemoteDescription(message.offer)
          const answer = await offerPeerConnection.createAnswer()
          await offerPeerConnection.setLocalDescription(answer)
          sendMessage({
            type: "answer",
            answer,
            targetParticipant: message.fromParticipant,
          })
          break

        case "answer":
          const answerPeerConnection = peerConnectionsRef.current.get(message.fromParticipant)
          if (answerPeerConnection) {
            await answerPeerConnection.setRemoteDescription(message.answer)
          }
          break

        case "ice-candidate":
          const icePeerConnection = peerConnectionsRef.current.get(message.fromParticipant)
          if (icePeerConnection) {
            await icePeerConnection.addIceCandidate(message.candidate)
          }
          break

        case "participants-list":
          setParticipants(message.participants)
          break
      }
    },
    [createPeerConnection, sendMessage, participantName],
  )

  // Connect to meeting
  const connect = useCallback(async () => {
    try {
      setConnectionState("connecting")

      // Initialize media first
      await initializeMedia()

      // Connect to signaling server
      const ws = new WebSocket(signalingUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        setIsConnected(true)
        setConnectionState("connected")

        // Join meeting
        sendMessage({
          type: "join-meeting",
          meetingId,
          participant: {
            id: participantName,
            name: participantName,
            isHost: false,
            isMuted: false,
            isVideoOff: false,
          },
        })
      }

      ws.onmessage = handleWebSocketMessage

      ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)
        setConnectionState("disconnected")
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setConnectionState("failed")
      }
    } catch (error) {
      console.error("[v0] Failed to connect:", error)
      setConnectionState("failed")
    }
  }, [signalingUrl, meetingId, participantName, initializeMedia, handleWebSocketMessage, sendMessage])

  // Disconnect from meeting
  const disconnect = useCallback(() => {
    // Close all peer connections
    peerConnectionsRef.current.forEach((pc) => pc.close())
    peerConnectionsRef.current.clear()
    dataChannelsRef.current.clear()

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
    }

    setIsConnected(false)
    setLocalStream(null)
    setParticipants([])
    setConnectionState("disconnected")
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)

        // Notify other participants
        sendMessage({
          type: "participant-update",
          participantId: participantName,
          isMuted: !audioTrack.enabled,
        })
      }
    }
  }, [sendMessage, participantName])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)

        // Notify other participants
        sendMessage({
          type: "participant-update",
          participantId: participantName,
          isVideoOff: !videoTrack.enabled,
        })
      }
    }
  }, [sendMessage, participantName])

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0]
      peerConnectionsRef.current.forEach(async (pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      })

      // Update local stream
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0]
        localStreamRef.current.removeTrack(oldVideoTrack)
        localStreamRef.current.addTrack(videoTrack)
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()))
      }

      setIsScreenSharing(true)

      // Handle screen share end
      videoTrack.onended = () => {
        stopScreenShare()
      }
    } catch (error) {
      console.error("[v0] Failed to start screen share:", error)
    }
  }, [])

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const videoTrack = cameraStream.getVideoTracks()[0]

      // Replace screen share track with camera track
      peerConnectionsRef.current.forEach(async (pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      })

      // Update local stream
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0]
        localStreamRef.current.removeTrack(oldVideoTrack)
        localStreamRef.current.addTrack(videoTrack)
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()))
      }

      setIsScreenSharing(false)
    } catch (error) {
      console.error("[v0] Failed to stop screen share:", error)
    }
  }, [])

  // Send chat message
  const sendChatMessage = useCallback(
    (message) => {
      const chatMessage = {
        senderName: participantName,
        text: message,
      }

      // Send to all participants via data channels
      dataChannelsRef.current.forEach((dataChannel) => {
        if (dataChannel.readyState === "open") {
          dataChannel.send(JSON.stringify(chatMessage))
        }
      })

      // Add to local chat
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          participantId: participantName,
          participantName,
          message,
          timestamp: new Date(),
        },
      ])
    },
    [participantName],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    // State
    participants,
    localStream,
    isConnected,
    isMuted,
    isVideoOff,
    isScreenSharing,
    chatMessages,
    connectionState,

    // Actions
    connect,
    disconnect,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    sendChatMessage,
  }
}
