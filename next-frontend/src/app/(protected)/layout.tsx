"use client"

import type React from "react"

import { ApiKeyProvider } from "../../../contexts/api-key-context"
import { Navbar } from "@/components/navbar"
import { useApiKey } from "../../../contexts/api-key-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { AccountProvider } from "../../../contexts/account-context"

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { apiKey, isLoading } = useApiKey()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!apiKey && pathname !== "/" && !isLoading) {
      router.push("/")
    }
  }, [apiKey, router, pathname, isLoading])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center bg-background">{children}</main>
    </div>
  )
}

export default function ProtectedLayoutWithProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApiKeyProvider>
      <AccountProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </AccountProvider>
    </ApiKeyProvider>
  )
}
