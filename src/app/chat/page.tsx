"use client"
import { useEffect, useState } from "react"
import { PushAPI, CONSTANTS, SignerType } from "@pushprotocol/restapi"
import { useDynamicContext } from "@/lib/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  content: string
  fromDID: string
  timestamp: number
}

const ChatUI = () => {
  const { primaryWallet } = useDynamicContext()
  const [user, setUser] = useState<PushAPI | null>(null)
  const [receiverAddress, setReceiverAddress] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [streamConnected, setStreamConnected] = useState(false)

  async function initialize() {
    if (!primaryWallet) return

    try {
      const newUser = await PushAPI.initialize(
        primaryWallet as unknown as SignerType,
        {
          env: CONSTANTS.ENV.STAGING,
        }
      )
      setUser(newUser)

      // Initialize stream
      const stream = await newUser.initStream([CONSTANTS.STREAM.CHAT])

      stream.on(CONSTANTS.STREAM.CHAT, (message) => {
        setMessages((prev) => [...prev, message])
      })

      stream.connect()
      setStreamConnected(true)
    } catch (error) {
      console.error("Error initializing Push:", error)
    }
  }

  async function fetchChatHistory() {
    if (!user || !receiverAddress) return

    try {
      const history = await user.chat.history(receiverAddress)
      setMessages(history.reverse())
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  async function sendMessage() {
    if (!user || !receiverAddress || !message.trim()) return

    try {
      await user.chat.send(receiverAddress, {
        content: message,
      })

      // Add message to local state
      setMessages((prev) => [
        ...prev,
        {
          content: message,
          fromDID: `eip155:${primaryWallet}`,
          timestamp: Date.now(),
        },
      ])

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  useEffect(() => {
    initialize()
  }, [primaryWallet])

  useEffect(() => {
    if (receiverAddress) {
      fetchChatHistory()
    }
  }, [receiverAddress, user])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Push Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter receiver's wallet address"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </div>

          <div className="h-96 overflow-y-auto border rounded-md p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.fromDID === `eip155:${primaryWallet}`
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.fromDID === `eip155:${primaryWallet}`
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">
                    {formatAddress(msg.fromDID.replace("eip155:", ""))}
                  </p>
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatUI
