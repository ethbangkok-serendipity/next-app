import { http, createConfig } from "wagmi"
import { mainnet, sepolia, gnosis, gnosisChiado} from "wagmi/chains"

export const config = createConfig({
  chains: [ gnosis, gnosisChiado, mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [gnosis.id]: http(),
    [gnosisChiado.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}