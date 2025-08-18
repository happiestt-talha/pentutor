"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

export function ChatPanel({ messages, onSendMessage, currentUserId }) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-80 bg-white/10 backdrop-blur-sm rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">Chat</h3>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${message.participantId === currentUserId ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.participantId === currentUserId ? "bg-[#F5BB07] text-[#313D6A]" : "bg-white/20 text-white"
                }`}
              >
                {message.participantId !== currentUserId && (
                  <div className="text-xs opacity-70 mb-1 font-medium">{message.participantName}</div>
                )}
                <div className="text-sm">{message.message}</div>
              </div>
              <div className="text-xs text-white/60">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          size="sm"
          className="bg-[#F5BB07] text-[#313D6A] hover:bg-[#F5BB07]/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
