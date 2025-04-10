"use client"

import { useApiKey } from "../../contexts/api-key-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAccount } from "../../contexts/account-context"

export function Navbar() {
  const { clearApiKey } = useApiKey()
  const { account } = useAccount()
  const router = useRouter()

  const handleLogout = () => {
    clearApiKey()
    router.push("/")
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-white">
              Gateway
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4">Olá, {account?.name}</span>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                  clipRule="evenodd"
                />
                <path d="M8.293 7.293a1 1 0 011.414 0L11 8.586V7a1 1 0 112 0v5a1 1 0 01-1 1H7a1 1 0 110-2h2.586l-1.293-1.293a1 1 0 010-1.414z" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
