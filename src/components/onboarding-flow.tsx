"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Glasses, Globe2, Twitter, Wallet } from 'lucide-react'
import { CirclesConfig, Sdk } from '@circles-sdk/sdk'
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers"
import { useDynamicContext } from '@/lib/dynamic'
import { useSocialAccounts } from "@dynamic-labs/sdk-react-core";
import { SocialIcon } from '@dynamic-labs/iconic';
import { useWalletOptions } from "@dynamic-labs/sdk-react-core";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user, primaryWallet } = useDynamicContext()
  const [sdk, setSdk] = useState<Sdk| null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasCirclesAccount, setHasCirclesAccount] = useState(false)

  const {
    linkSocialAccount,
    unlinkSocialAccount,
    isProcessing,
    isLinked,
    getLinkedAccountInformation,
  } = useSocialAccounts();

const { selectWalletOption } = useWalletOptions();

  // const isProviderLinked = isLinked("twitter" as any);
  // const connectedAccountInfo = getLinkedAccountInformation("twitter" as any);

  const circlesConfig = {
    circlesRpcUrl: "https://static.94.138.251.148.clients.your-server.de/rpc/",
    v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
    v2HubAddress: "0x3D61f0A272eC69d65F5CFF097212079aaFDe8267",
    migrationAddress: "0x28141b6743c8569Ad8B20Ac09046Ba26F9Fb1c90",
    nameRegistryAddress: "0x8D1BEBbf5b8DFCef0F7E2039e4106A76Cb66f968",
    profileServiceUrl: "https://static.94.138.251.148.clients.your-server.de/profiles/",
    baseGroupMintPolicy: "0x79Cbc9C7077dF161b92a745345A6Ade3fC626A60",
  }

  const steps = [
    {
      title: "FIND YOUR MAGICAL CONNECTIONS",
      subtitle:
        "Tired of random networking? Discover like-minded peers privately at events.",
      progress: 0,
      bullets: [
        "Discover ideal matches based on your Twitter data",
        "Enjoy private match making on TEE",
        "Pay for AI services with your data, not your privacy",
      ],
      buttonText: "CONNECT WALLET",
      icon: <Wallet className="w-6 h-6" />
    },
    {
      title: "CONNECT YOUR TWITTER",
      subtitle:
        "Link your profile to unlock tailored networking opportunities.",
      progress: 25,
      bullets: [
        "Compute privately on your data to extract your Interests",
        "Your data is yours to own, not big tech's",
        "Free service? No, you pay with your data without revealing it.",
      ],
      buttonText: "CONNECT 𝕏",
      icon: <Twitter className="w-6 h-6" />,
    },
    {
      title: "MEET YOURSELF",
      subtitle:
        "Review your extracted interests and mint dataDAO tokens proportional to your data's quality & staking your $CRC.",
      progress: 50,
      dataScore: "SIGMA DATA CONFIDENCE SCORE= 2.3",
      buttonText: hasCirclesAccount ? "Continue" : "Create Circles Account",
      icon: <Glasses className="w-6 h-6" />
    },
    {
      title: "FIND YOUR MATCHES",
      subtitle:
        "Compute on dataDAO's data treasury and find the closest matches",
      progress: 75,
      bullets: [
        "Pay in your dataDAO's tokens to access dataDAO's pool",
        "See match scores indicating compatibility",
        "Direct message via Twitter to organize meeting up",
      ],
      buttonText: "MEET YOUR MATCHES",
      icon: <Globe2 className="w-6 h-6" />,
    },
    {
      title: "CONNECT WITH YOUR MATCHES",
      subtitle: "Connect with peers who share your passions.",
      progress: 100,
      matches: [
        { username: "@vitalik", matchScore: "80% interest match" },
        { username: "@vitalik", matchScore: "80% interest match" },
        { username: "@vitalik", matchScore: "80% interest match" },
      ],
      buttonText: "MEET YOUR MATCHES",
      icon: <Globe2 className="w-6 h-6" />
    }
  ]

  async function initCircles() {
    try {
      if (!primaryWallet?.address) {
        console.log("Please connect your wallet first")
        return
      }

      const adapter = new BrowserProviderContractRunner()
      await adapter.init()
      const newSdk = new Sdk(adapter, circlesConfig)
      setSdk(newSdk)
      return newSdk
    } catch (err) {
      console.log("Failed to initialize Circles SDK")
      console.error("Failed to initialize Circles:", err)
    }
  }

  async function createAvatar() {
    setIsLoading(true)
    setError(null)

    try {
      const initializedSdk = sdk || await initCircles()
      if (!initializedSdk) {
        throw new Error("Failed to initialize Circles SDK")
      }

      const avatar = await initializedSdk.acceptInvitation("0x0000000000000000000000000000000000000000", {
        name: "User"
      })
      console.log("Avatar created:", avatar.avatarInfo)
      setHasCirclesAccount(true)
      handleNext()
    } catch (err) {
      console.log("Failed to create avatar")
      console.error("Failed to create avatar:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepAction = async () => {
    switch (currentStep) {
      case 0:
        // Handle wallet connection
        // Add your wallet connection logic here
        await selectWalletOption("metamask")
        handleNext()
        break
      case 1:
        linkSocialAccount("twitter" as any)
        handleNext()
        break
      case 2:
        if (!hasCirclesAccount) {
          await createAvatar()
        } else {
          handleNext()
        }
        break
      default:
        handleNext()
    }
  }

  const currentStepData = steps[currentStep]

  const runBackendPipeline = async () => {
    try {
      const url = new URL(window.location.href)
      const domain = url.hostname

      const response = await axios.post(`${domain}/api/profile_extraction`, {
        username: "your-username-here",
        profile: "your-profile-here",
        // we need to implement the address here as well - is missing on the api
        address: "your-address-here",
      })
      console.log(response.data)
    } catch (error) {
      console.error("Error while calling the backend:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-[#1a1b23] text-white border-none relative">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-gray-400 hover:bg-slate-700"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Go back</span>
          </Button>
        )}
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-yellow-400">
            {currentStepData.icon}
            SERENDIPITY
          </div>
          <h2 className="text-[#40e0d0] font-medium text-center">
            {currentStepData.title}
          </h2>
          <p className="text-sm text-gray-300 text-center">
            {currentStepData.subtitle}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.bullets && (
            <ul className="space-y-2 text-sm text-gray-300">
              {currentStepData.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#40e0d0]">•</span> {bullet}
                </li>
              ))}
            </ul>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {currentStep === 0 && (
            <div className="flex justify-center py-4">
              <Wallet className="w-24 h-24 text-gray-400" />
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex justify-center py-4">
              <Twitter className="w-24 h-24 text-gray-400" />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="w-full h-48 bg-gray-700 rounded-lg" />
              <p className="text-center text-sm font-mono">
                {currentStepData.dataScore}
              </p>
              {!hasCirclesAccount && (
                <div className="p-4 bg-[#40e0d0]/10 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">
                    Create your Circles account to start connecting with others.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && currentStepData.matches && (
            <div className="space-y-3">
              {currentStepData.matches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-[#40e0d0]/20 bg-[#40e0d0]/5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{match.username}</span>
                    <span className="text-sm text-gray-300">
                      {match.matchScore}
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="text-[#40e0d0] hover:text-[#40e0d0]/80 p-0 h-auto text-sm"
                  >
                    DM on Twitter App
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-[#40e0d0] hover:bg-[#3bcdc0] text-black font-medium"
            size="lg"
            onClick={handleStepAction}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : currentStepData.buttonText}
          </Button>
          <div className="w-full">
            <Progress
              value={currentStepData.progress}
              className="h-2 bg-gray-700"
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
