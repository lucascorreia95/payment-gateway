"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface ApiKeyContextType {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  isLoading: boolean
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedApiKey = localStorage.getItem("apiKey")
    if (storedApiKey) {
      setApiKeyState(storedApiKey)
    }
    setIsLoading(false)
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem("apiKey", key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem("apiKey")
    setApiKeyState(null)
  }

  return <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isLoading }}>{children}</ApiKeyContext.Provider>
}

export function useApiKey() {
  const context = useContext(ApiKeyContext)
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider")
  }
  return context
}
