"use client"
import { useEffect, useState } from "react"
import { PushAPI, CONSTANTS, SignerType } from "@pushprotocol/restapi"
import { useDynamicContext } from "@/lib/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatView } from "@pushprotocol/uiweb"

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
  const [isSending, setIsSending] = useState(false)

  console.log("start chatUI")
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

  function sendAnything() {
    console.log("anything here")
  }

  async function sendMessage(e?: React.MouseEvent) {
    console.log("anything")
    // Prevent default if called from a form
    e?.preventDefault()

    if (isSending) {
      console.log("Already sending a message")
      return
    }

    if (!user) {
      console.error("User not initialized")
      return
    }

    if (!receiverAddress) {
      console.error("No receiver address specified")
      return
    }

    if (!message.trim()) {
      console.error("Message is empty")
      return
    }

    console.log("Sending message to:", receiverAddress)
    console.log("Message content:", message)

    setIsSending(true)

    try {
      const response = await user.chat.send(receiverAddress, {
        content: message,
      })

      console.log("Message sent successfully:", response)

      // Add message to local state
      const newMessage = {
        content: message,
        fromDID: `eip155:${primaryWallet}`,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, newMessage])
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      // If you have a toast component:
      // toast({
      //   title: "Error sending message",
      //   description: "Please try again",
      //   variant: "destructive",
      // })
    } finally {
      setIsSending(false)
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
      <ChatView
        chatId="b8e068e02fe12d7136bc2f24408835573f30c6fbf0b65ea26ab4c7055a2c85f1"
        limit={10}
        isConnected={true}
      />
    </Card>
  )
}

export default ChatUI
