"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers";
import { useDynamicContext } from '@/lib/dynamic';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const circlesConfig = {
  circlesRpcUrl: "https://static.94.138.251.148.clients.your-server.de/rpc/",
  v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
  v2HubAddress: "0x3D61f0A272eC69d65F5CFF097212079aaFDe8267",
  migrationAddress: "0x28141b6743c8569Ad8B20Ac09046Ba26F9Fb1c90",
  nameRegistryAddress: "0x8D1BEBbf5b8DFCef0F7E2039e4106A76Cb66f968",
  profileServiceUrl: "https://static.94.138.251.148.clients.your-server.de/profiles/",
  baseGroupMintPolicy: "0x79Cbc9C7077dF161b92a745345A6Ade3fC626A60",
};

export const GnosisChainConfig: CirclesConfig = circlesConfig;

const Home = () => {
  const { user, primaryWallet } = useDynamicContext();
  const [sdk, setSdk] = useState<Sdk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initCircles();
  }, [primaryWallet,]);

  async function initCircles() {
    try {
      if (!primaryWallet?.address) {
        setError("Please connect your wallet first");
        return;
      }

      const adapter = new BrowserProviderContractRunner();
      console.log("Initializing Circles SDK with adapter:", adapter);
      await adapter.init();
      const newSdk = new Sdk(adapter, GnosisChainConfig);
      console.log("Circles SDK initialized:", newSdk);
      setSdk(newSdk);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize Circles SDK");
      console.error("Failed to initialize Circles:", err);
    }
  }

  async function createAvatar(inviterAddress: string) {
    console.log("Creating Avatar")
    if (!sdk) {
      setError("SDK not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const avatar = await sdk.acceptInvitation(inviterAddress, {
        name: "Mihir"
      });
      console.log("Avatar created:", avatar.avatarInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create avatar");
      console.error("Failed to create avatar:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl text-gray-400 font-bold mb-4">Circles Integration</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p>Address: {primaryWallet?.address || "Not connected"}</p>
        </div>

        <Button 
          onClick={() => createAvatar("0x0000000000000000000000000000000000000000")} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Creating Avatar..." : "Create Avatar"}
        </Button>
      </div>
    </div>
  );
};

export default Home;