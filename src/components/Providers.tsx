"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia, baseSepolia, optimismSepolia} from "wagmi/chains";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Solidity Next.js Starter',
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID ?? "",
  chains: [baseSepolia, optimismSepolia, sepolia],
  ssr: true,
});

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
      appInfo={{
        appName: 'Seredipity',
        learnMoreUrl: 'https://github.com/ethbangkok-serendipity/serendipity',
      }}
      >{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export { Providers };