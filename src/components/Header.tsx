"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
const Header = () => {
  const pathname = usePathname()
  const { address } = useAccount();

  return (
    <header
      className={`py-4 w-full px-24 mb-0 flex flex-col items-center justify-between z-10 bg-gradient-to-b from-white via-white to-transparent`}
    >
      <div className="flex justify-center items-center gap-6">
        <Link
          href="/"
          className="text-3xl md:text-2xl font-extrabold text-emerald-500"
        >
          deel.
        </Link>
            <Link
              href="/jobs"
              className={` ${pathname === "/jobs" ? "text-emerald-500 font-bold" : "text-gray-700 font-semibold"}`}
            >
              Jobs
            </Link>
          <Link
            href="/my-listings"
            className={` ${pathname === "/my-listings" ? "text-emerald-500 font-bold" : "text-gray-700 font-semibold"}`}
          >
            My Listings
          </Link>
      </div>
      <div>
      <div className="flex justify-center items-center gap-4">
        {(address) && (
            <Link
              href="/deel-id"
              className={` ${pathname === "/deel-id" ? "text-emerald-500 font-bold" : "text-gray-700 font-semibold"}`}
            >
              My Profile
            </Link>
          )}
        <ConnectButton
            showBalance={false}
            accountStatus="address"
            label="Connect"
          />
      </div>
      </div>
    </header>
  )
}

export { Header }