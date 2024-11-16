"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { ChatWidget, ChatUIProvider, darkChatTheme } from "@pushprotocol/uiweb"

import { config } from "@/lib/wagmi"
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  DynamicWagmiConnector,
} from "@/lib/dynamic"

const queryClient = new QueryClient()

export function Providers(props: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "181a95d1-1081-4c0c-8c96-431e10cd86fa",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <ChatUIProvider theme={darkChatTheme}>
              {props.children}
            </ChatUIProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}
