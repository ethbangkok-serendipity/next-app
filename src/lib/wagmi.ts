import { http, createConfig } from "wagmi"
import { gnosis, gnosisChiado } from "wagmi/chains"

export const config = createConfig({
  chains: [ gnosis, gnosisChiado],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [gnosis.id]: http(),
    [gnosisChiado.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}