"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Glasses, Globe2, Twitter } from "lucide-react"

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)

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
      icon: <Glasses className="w-6 h-6" />,
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
      buttonText: "Join dataDAO",
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
        { username: "@vitalik", matchScore: "80% interest match" },
        { username: "@vitalik", matchScore: "80% interest match" },
        { username: "@vitalik", matchScore: "80% interest match" },
      ],
      buttonText: "BACK",
      icon: <Glasses className="w-6 h-6" />,
    },
  ]

  const currentStepData = steps[currentStep]

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

          {currentStep === 0 && (
            <div className="flex justify-center py-4"></div>
          )}

          {currentStep === 1 && (
            <div className="flex justify-center py-4">
              <svg
                className="w-32 h-32 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z" />
              </svg>
            </div>
          )}

          {currentStep === 2 && (
            <>
              <div className="w-full h-48 bg-gray-700 rounded-lg" />
              <p className="text-center text-sm font-mono">
                {currentStepData.dataScore}
              </p>
            </>
          )}

          {currentStep === 3 && (
            <div className="flex justify-center py-4">
              <svg
                className="w-32 h-32 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              {currentStepData.matches?.map((match, index) => (
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
            onClick={currentStep === steps.length - 1 ? handleBack : handleNext}
          >
            {currentStepData.buttonText}
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
