"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Glasses,
  Globe2,
  Twitter,
  Wallet,
  Coins,
  ChevronRight,
  Star,
} from "lucide-react"
import { CirclesConfig, Sdk } from "@circles-sdk/sdk"
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers"
import { useDynamicContext } from "@/lib/dynamic"
import { useSocialAccounts } from "@dynamic-labs/sdk-react-core"
import { SocialIcon } from "@dynamic-labs/iconic"
import { useWalletOptions } from "@dynamic-labs/sdk-react-core"

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user, primaryWallet } = useDynamicContext()
  const [sdk, setSdk] = useState<Sdk | null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [hasCirclesAccount, setHasCirclesAccount] = useState(false)
  const [interests, setInterests] = useState([
    { category: "Blockchain", score: 85 },
    { category: "AI & Machine Learning", score: 92 },
    { category: "Web3", score: 78 },
    { category: "DeFi", score: 88 },
  ])

  const {
    linkSocialAccount,
    unlinkSocialAccount,
    isProcessing,
    isLinked,
    getLinkedAccountInformation,
  } = useSocialAccounts()

  const { selectWalletOption } = useWalletOptions()

  // Add useEffect to handle wallet connection state
  useEffect(() => {
    if (currentStep === 0 && primaryWallet?.address) {
      handleNext()
    }
  }, [primaryWallet?.address])

  // Add useEffect to handle Twitter connection state
  useEffect(() => {
    if (currentStep === 1 && isLinked("twitter" as any)) {
      handleNext()
    }
  }, [isLinked])

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
      icon: <Wallet className="w-6 h-6" />,
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
      dataScore: "SIGMA DATA CONFIDENCE SCORE = 2.3",
      buttonText: hasCirclesAccount ? "Continue" : "Create Circles Account",
      icon: <Glasses className="w-6 h-6" />,
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
        { username: "@vitalik", matchScore: "80% interest match", avatar: "V" },
        { username: "@gavin", matchScore: "75% interest match", avatar: "G" },
        { username: "@aave", matchScore: "70% interest match", avatar: "A" },
      ],
      buttonText: "MEET YOUR MATCHES",
      icon: <Globe2 className="w-6 h-6" />,
    },
  ]

  const circlesConfig = {
    circlesRpcUrl: "https://static.94.138.251.148.clients.your-server.de/rpc/",
    v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
    v2HubAddress: "0x3D61f0A272eC69d65F5CFF097212079aaFDe8267",
    migrationAddress: "0x28141b6743c8569Ad8B20Ac09046Ba26F9Fb1c90",
    nameRegistryAddress: "0x8D1BEBbf5b8DFCef0F7E2039e4106A76Cb66f968",
    profileServiceUrl:
      "https://static.94.138.251.148.clients.your-server.de/profiles/",
    baseGroupMintPolicy: "0x79Cbc9C7077dF161b92a745345A6Ade3fC626A60",
  }

  const handleMintTokens = async () => {
    setIsMinting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Add your actual minting logic here
    } catch (error) {
      console.log("Failed to mint tokens. Please try again.")
    } finally {
      setIsMinting(false)
    }
  }

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
      return null
    }
  }

  async function createAvatar() {
    setIsLoading(true)
    setError(null)

    try {
      const initializedSdk = sdk || (await initCircles())
      if (!initializedSdk) {
        throw new Error("Failed to initialize Circles SDK")
      }

      const avatar = await initializedSdk.acceptInvitation(
        "0x0000000000000000000000000000000000000000",
        {
          name: user?.firstName || "User",
        }
      )
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

  const handleStepAction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      switch (currentStep) {
        case 0:
          await selectWalletOption("metamask")
          // Next step handled by useEffect
          break
        case 1:
          await linkSocialAccount("twitter" as any)
          // Next step handled by useEffect
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
    } catch (error) {
      console.error("Error during step action:", error)
      setError("An error occurred during this step" as any)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-b bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1b23] text-white border-none relative shadow-xl">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-gray-400 hover:bg-slate-700/50 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Go back</span>
          </Button>
        )}
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <span className="text-yellow-400">SERENDIPITY</span>
            {currentStepData.icon}
          </div>
          <h2 className="text-[#40e0d0] font-semibold text-center text-xl">
            {currentStepData.title}
          </h2>
          <p className="text-gray-300 text-center">
            {currentStepData.subtitle}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {currentStepData.bullets && (
            <ul className="space-y-3">
              {currentStepData.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-gray-800/30 p-3 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 text-[#40e0d0] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#40e0d0]">
                    Your Interests
                  </h3>
                  <div className="text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-mono">
                      {currentStepData.dataScore}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {interests.map((interest, index) => (
                    <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">
                          {interest.category}
                        </span>
                        <span className="text-[#40e0d0] font-mono">
                          {interest.score}%
                        </span>
                      </div>
                      <Progress
                        value={interest.score}
                        className="h-1.5 bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-[#40e0d0]/10 border-[#40e0d0]/30 hover:bg-[#40e0d0]/20 text-[#40e0d0]"
                  size="lg"
                  onClick={handleMintTokens}
                  disabled={isMinting}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  {isMinting ? "Minting..." : "Mint $MM Tokens"}
                </Button>
                <Button
                  className="bg-[#40e0d0] hover:bg-[#3bcdc0] text-black font-medium"
                  size="lg"
                  onClick={handleStepAction}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : currentStepData.buttonText}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && currentStepData.matches && (
            <div className="space-y-4">
              {currentStepData.matches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-[#40e0d0]/20 bg-[#40e0d0]/5 hover:bg-[#40e0d0]/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#40e0d0]/20 flex items-center justify-center text-[#40e0d0] font-semibold">
                      {match.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{match.username}</span>
                        <span className="text-sm text-[#40e0d0]">
                          {match.matchScore}
                        </span>
                      </div>
                      <Button
                        variant="link"
                        className="text-[#40e0d0] hover:text-[#40e0d0]/80 p-0 h-auto text-sm"
                      >
                        DM on Twitter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {currentStep !== 2 && (
            <Button
              className="w-full bg-[#40e0d0] hover:bg-[#3bcdc0] text-black font-medium transition-colors"
              size="lg"
              onClick={handleStepAction}
              disabled={isLoading || isProcessing}
            >
              {isLoading || isProcessing
                ? "Processing..."
                : currentStepData.buttonText}
            </Button>
          )}
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
