"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "wagmi"
// import { ConnectButton } from "@rainbow-me/rainbowkit"
import { DynamicWidget } from "@/lib/dynamic"
import { useDynamicContext } from "@/lib/dynamic"

const Header = () => {
  const pathname = usePathname()
  const { address } = useAccount()
  const { user } = useDynamicContext()
  console.log(user)
  return (
    <header className="fixed top-0 w-full max-w-sm bg-black z-50">
      <div className="px-6 py-4 flex flex-row items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-emerald-400"
        >
          S
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            href="/matches"
            className={`text-sm ${
              pathname === "/matches" 
                ? "text-emerald-400 font-semibold" 
                : "text-gray-100 font-medium"
            }`}
          >
            Matches
          </Link>
          <Link
            href="/profile"
            className={`text-sm ${
              pathname === "/profile" 
                ? "text-emerald-400 font-semibold" 
                : "text-gray-100 font-medium"
            }`}
          >
            My Profile
          </Link>
          {/* <ConnectButton
            showBalance={false}
            accountStatus="address"
            label="Connect"
            chainStatus="none"
          /> */}
          <DynamicWidget />
        </div>
      </div>
    </header>
  )
}

export { Header }